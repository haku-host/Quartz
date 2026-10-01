#!/usr/bin/env node
// Run after `npx quartz build`. An optional project-root argument permits isolated fixtures.
// This is an offline check: it does not request external URLs or execute browser JavaScript.
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { fromHtml } from "hast-util-from-html"
import { parseDocument } from "yaml"
import { unified } from "unified"
import remarkParse from "remark-parse"
import { isRelativeURL, simplifySlug, slugifyFilePath } from "@quartz-community/utils/path"

const root = process.argv[2]
  ? path.resolve(process.argv[2])
  : fileURLToPath(new URL("../", import.meta.url))
const errors = new Set()
const counts = { articles: 0, wikilinks: 0, pages: 0, urls: 0, anchors: 0, legacy: 0 }
const fail = (where, message) => errors.add(`${where}: ${message}`)
const read = (name) => fs.readFile(path.join(root, name), "utf8")
const markdown = unified().use(remarkParse)

async function listFiles(directory) {
  const result = []
  const entries = await fs.readdir(path.join(root, directory), { withFileTypes: true })
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const name = path.posix.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...(await listFiles(name)))
    else if (entry.isFile()) result.push(name)
  }
  return result
}

function yaml(text, where) {
  const document = parseDocument(text, { uniqueKeys: true })
  for (const error of document.errors) fail(where, error.message)
  return document.errors.length ? null : document.toJS()
}

function walk(node, visit) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
  if (node.content) walk(node.content, visit) // <template> contents
}

function decode(value, where) {
  try {
    return decodeURIComponent(value)
  } catch {
    fail(where, `invalid URL encoding: ${value}`)
    return null
  }
}

function routeKey(slug) {
  return simplifySlug(slug.replace(/^\/+/, "")).replace(/\/+$/, "") || "/"
}

function validSlug(value, where) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value !== value.trim() ||
    /[?#\\]/.test(value) ||
    /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value) ||
    value.split("/").includes("..")
  ) {
    fail(where, `expected a local slug, received ${JSON.stringify(value)}`)
    return false
  }
  return true
}

function srcsetUrls(value) {
  // Follow srcset's URL-token boundary: commas inside a data URL are not separators.
  const urls = []
  let remaining = value.trim()
  while (remaining) {
    remaining = remaining.replace(/^[,\s]+/, "")
    const token = /^\S+/.exec(remaining)?.[0]
    if (!token) break
    remaining = remaining.slice(token.length)
    urls.push(token.replace(/,+$/, ""))
    if (token.endsWith(",")) continue
    // Skip width/density descriptors; they cannot contain another URL.
    const separator = remaining.indexOf(",")
    remaining = separator < 0 ? "" : remaining.slice(separator + 1)
  }
  return urls
}

async function main() {
  const config = yaml(await read("quartz.config.yaml"), "quartz.config.yaml")
  const baseUrl = config?.configuration?.baseUrl
  if (typeof baseUrl !== "string" || !baseUrl) {
    throw new Error("quartz.config.yaml must specify configuration.baseUrl")
  }
  const site = new URL(baseUrl.includes("://") ? baseUrl : `https://${baseUrl}`)
  if (!site.pathname.endsWith("/")) site.pathname += "/"

  const sourceFiles = await listFiles("content")
  const articles = []
  const targets = new Map()
  const ownership = new Map()
  const sourceAssets = new Set()
  const expectedRedirects = []

  function register(slug, owner, kind) {
    const key = routeKey(slug)
    if (ownership.has(key)) {
      fail(owner, `${kind} slug ${JSON.stringify(slug)} collides with ${ownership.get(key)}`)
    } else {
      ownership.set(key, `${kind} in ${owner}`)
    }
    targets.set(slug, owner)
    targets.set(key, owner)
  }

  for (const file of sourceFiles) {
    const relative = file.slice("content/".length)
    if (!relative.endsWith(".md")) {
      sourceAssets.add(slugifyFilePath(relative))
      continue
    }
    counts.articles++
    const source = await read(file)
    const front = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source)
    if (!front) {
      fail(file, "missing YAML frontmatter")
      continue
    }
    const data = yaml(front[1], file)
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      fail(file, "frontmatter must be a mapping")
      continue
    }
    for (const field of ["title", "description"]) {
      if (typeof data[field] !== "string" || !data[field].trim()) {
        fail(file, `frontmatter ${field} must be a nonempty string`)
      }
    }
    const date = data.modified
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date
    ) {
      fail(file, "frontmatter modified must be a valid YYYY-MM-DD date")
    }
    const slug = slugifyFilePath(relative)
    register(slug, file, "article")
    articles.push({ file, slug, body: source.slice(front[0].length), data })
  }

  // NoteProperties normalizes aliases before AliasRedirects resolves relative paths.
  for (const article of articles) {
    const raw = article.data.aliases ?? article.data.alias ?? []
    const aliases = typeof raw === "string" ? raw.split(",").map((s) => s.trim()) : raw
    if (!Array.isArray(aliases)) {
      fail(article.file, "aliases must be a string or an array of strings")
      continue
    }
    const slugs = []
    for (const alias of aliases) {
      if (typeof alias !== "string" || !alias.trim()) {
        fail(article.file, "each alias must be a nonempty string")
        continue
      }
      slugs.push(slugifyFilePath(alias.endsWith(".md") ? alias : `${alias}.md`))
    }
    if (article.data.permalink !== undefined) slugs.push(article.data.permalink)
    for (let slug of slugs) {
      if (typeof slug === "string" && isRelativeURL(slug)) {
        slug = path.posix.normalize(path.posix.join(simplifySlug(article.slug), "..", slug))
      }
      if (!validSlug(slug, article.file)) continue
      slug = slug.replace(/^\/+/, "")
      register(slug, article.file, "alias")
      expectedRedirects.push({ slug, target: article.slug, owner: article.file, legacy: false })
    }
  }

  const legacyName = "scripts/legacy-urls.json"
  const legacySource = await read(legacyName)
  const legacy = JSON.parse(legacySource)
  yaml(legacySource, legacyName) // Also catches duplicate object keys, unlike JSON.parse.
  if (
    !legacy ||
    typeof legacy !== "object" ||
    Array.isArray(legacy) ||
    !Object.keys(legacy).length
  ) {
    throw new Error(`${legacyName} must contain a nonempty oldSlug:newSlug object`)
  }
  for (const [slug, target] of Object.entries(legacy)) {
    if (!validSlug(slug, legacyName) || !validSlug(target, legacyName)) continue
    if (/^\/|\/$|\.html$/.test(slug) || /^\/|\/$|\.html$/.test(target)) {
      fail(legacyName, `use exact extensionless slugs for ${JSON.stringify(slug)}`)
      continue
    }
    // Legacy URLs deliberately preserve case, including /Главная and /главная.
    register(slug, legacyName, "legacy redirect")
    expectedRedirects.push({ slug, target, owner: legacyName, legacy: true })
    counts.legacy++
    if (!articles.some((article) => article.slug === target)) {
      fail(legacyName, `${slug} targets a missing canonical article: ${target}`)
    }
  }

  for (const article of articles) {
    walk(markdown.parse(article.body), (node) => {
      if (node.type !== "text") return // Ignore code blocks, inline code and HTML comments.
      for (const match of node.value.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
        const raw = match[1].split("#", 1)[0].trim()
        if (!raw || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)) continue
        counts.wikilinks++
        const decoded = decode(raw, article.file)
        if (decoded === null) continue
        let target = decoded.replace(/^\/+/, "")
        if (/^\.{1,2}\//.test(target)) {
          target = path.posix.normalize(path.posix.join(path.posix.dirname(article.slug), target))
        }
        target = slugifyFilePath(target)
        if (!targets.has(target) && !targets.has(routeKey(target)) && !sourceAssets.has(target)) {
          fail(article.file, `unresolved wikilink ${JSON.stringify(match[0])}`)
        }
      }
    })
  }

  const output = new Set((await listFiles("public")).map((file) => file.slice("public/".length)))
  const pages = new Map()
  function documentUrl(file) {
    const pathname = file.replace(/(?:^|\/)index\.html$/, (part) =>
      part.startsWith("/") ? "/" : "",
    )
    return new URL(encodeURI(pathname.replace(/\.html$/, "")), site)
  }

  function localUrl(raw, base, where) {
    if (typeof raw !== "string") return null
    let url
    try {
      url = new URL(raw.trim(), base)
    } catch {
      fail(where, `malformed URL: ${JSON.stringify(raw)}`)
      return null
    }
    if (!["http:", "https:"].includes(url.protocol) || url.host !== site.host) return null
    const pathname = decode(url.pathname, where)
    const basePath = decode(site.pathname, "quartz.config.yaml")
    if (pathname === null || basePath === null) return null
    // A project site's /Quartz and /Quartz/ both identify its index page.
    // Match the whole base path so /Quartz-other cannot pass this check.
    const isSiteRoot = pathname === basePath.replace(/\/$/, "")
    if (!isSiteRoot && !pathname.startsWith(basePath)) {
      fail(where, `URL is outside the configured site path: ${raw}`)
      return null
    }
    const relative = isSiteRoot ? "" : pathname.slice(basePath.length)
    const candidates =
      relative.endsWith("/") || !relative
        ? [`${relative}index.html`]
        : path.posix.extname(relative)
          ? [relative]
          : [relative, `${relative}.html`, `${relative}/index.html`]
    const file = candidates.find((candidate) => output.has(candidate))
    if (!file) {
      fail(where, `missing local target ${JSON.stringify(raw)} (${candidates.join(" or ")})`)
      return null
    }
    return { file, url }
  }

  for (const file of output) {
    if (!file.endsWith(".html")) continue
    counts.pages++
    const tree = fromHtml(await read(`public/${file}`))
    const page = {
      file,
      url: documentUrl(file),
      ids: new Set(),
      refs: [],
      canonical: [],
      refresh: [],
    }
    let htmlBase
    walk(tree, (node) => {
      if (node.type !== "element") return
      const props = node.properties ?? {}
      const where = `public/${file}${node.position?.start?.line ? `:${node.position.start.line}` : ""}`
      if (props.id !== undefined) page.ids.add(String(props.id))
      if (node.tagName === "a" && props.name !== undefined) page.ids.add(String(props.name))
      if (node.tagName === "base" && props.href && htmlBase === undefined) htmlBase = props.href
      for (const attribute of ["href", "src", "poster", "xLinkHref"]) {
        if (props[attribute] !== undefined) {
          page.refs.push({ raw: String(props[attribute]), where, anchor: true })
        }
      }
      if (node.tagName === "object" && props.data) {
        page.refs.push({ raw: String(props.data), where, anchor: false })
      }
      if (props.srcSet) {
        for (const raw of srcsetUrls(String(props.srcSet))) {
          page.refs.push({ raw, where, anchor: false })
        }
      }
      const rel = Array.isArray(props.rel) ? props.rel : String(props.rel ?? "").split(/\s+/)
      if (node.tagName === "link" && rel.some((item) => item.toLowerCase() === "canonical")) {
        page.canonical.push(String(props.href ?? ""))
      }
      if (node.tagName === "meta") {
        if (String(props.httpEquiv ?? "").toLowerCase() === "refresh") {
          const content = String(props.content ?? "")
          const match = /^\s*(\d+(?:\.\d+)?)\s*;\s*url\s*=\s*(.*?)\s*$/i.exec(content)
          if (!match || !match[2]) fail(where, `invalid meta refresh: ${JSON.stringify(content)}`)
          else
            page.refresh.push({
              delay: Number(match[1]),
              raw: match[2].replace(/^(["'])(.*)\1$/, "$2"),
            })
        }
        if (
          /^(?:og:image(?::(?:url|secure_url))?|twitter:image(?::src)?)$/i.test(
            String(props.property ?? props.name ?? ""),
          )
        ) {
          if (props.content) page.refs.push({ raw: String(props.content), where, anchor: false })
        }
      }
    })
    if (htmlBase !== undefined) {
      try {
        page.url = new URL(htmlBase, page.url)
      } catch {
        fail(`public/${file}`, `invalid base href: ${htmlBase}`)
      }
    }
    pages.set(file, page)
  }
  if (!pages.size) throw new Error("public/ has no HTML pages; run npx quartz build first")

  for (const article of articles) {
    if (!pages.has(`${article.slug}.html`))
      fail(article.file, `missing built page public/${article.slug}.html`)
  }

  const redirects = new Map()
  for (const page of pages.values()) {
    if (!page.refresh.length) continue
    const where = `public/${page.file}`
    if (page.refresh.length !== 1) fail(where, "redirect must have exactly one meta refresh")
    if (page.canonical.length !== 1) fail(where, "redirect must have exactly one canonical link")
    const target = localUrl(page.refresh[0].raw, page.url, where)
    if (!target) fail(where, "redirect must point to an existing local page")
    else if (!pages.has(target.file)) fail(where, "redirect target must be HTML")
    else redirects.set(page.file, target)
    const canonical = localUrl(page.canonical[0], page.url, where)
    if (!canonical || canonical.file !== target?.file || canonical.url.hash !== target.url.hash) {
      fail(where, "canonical and meta refresh must resolve to the same local target")
    }
  }

  function finalTarget(target, where) {
    const visited = new Set()
    while (redirects.has(target.file)) {
      if (visited.has(target.file)) {
        fail(where, `redirect loop involving ${target.file}`)
        return null
      }
      visited.add(target.file)
      const next = redirects.get(target.file)
      const url = new URL(next.url)
      if (!url.hash) url.hash = target.url.hash
      target = { file: next.file, url }
    }
    return target
  }

  for (const page of pages.values()) {
    if (redirects.has(page.file))
      finalTarget({ file: page.file, url: page.url }, `public/${page.file}`)
    for (const { raw, where, anchor } of page.refs) {
      counts.urls++
      const target = localUrl(raw, page.url, where)
      if (!target || !anchor) continue
      const final = finalTarget(target, where)
      if (!final || !pages.has(final.file) || !final.url.hash) continue
      const id = decode(final.url.hash.slice(1), where)?.split(":~:", 1)[0]
      if (!id || id.toLowerCase() === "top") continue
      counts.anchors++
      if (!pages.get(final.file).ids.has(id)) {
        fail(
          where,
          `missing HTML anchor ${JSON.stringify(id)} in ${final.file} (link ${JSON.stringify(raw)})`,
        )
      }
    }
  }

  for (const expected of expectedRedirects) {
    const file = `${expected.slug}.html`
    const targetFile = `${expected.target}.html`
    const where = `${expected.owner} (${expected.slug})`
    const page = pages.get(file)
    if (!page) {
      fail(where, `missing redirect public/${file}`)
      continue
    }
    if (!pages.has(targetFile)) fail(where, `missing destination public/${targetFile}`)
    if (page.refresh.length !== 1 || page.refresh[0].delay !== 0) {
      fail(where, "expected one immediate (0-second) meta refresh")
    }
    if (page.canonical.length !== 1) fail(where, "expected exactly one canonical link")
    for (const [kind, raw] of [
      ["refresh", page.refresh[0]?.raw],
      ["canonical", page.canonical[0]],
    ]) {
      const target = localUrl(raw, page.url, where)
      if (!target || target.file !== targetFile || target.url.hash || target.url.search) {
        fail(where, `${kind} must point directly to ${expected.target}`)
      }
      if (expected.legacy && kind === "canonical" && !/^https?:\/\//i.test(raw ?? "")) {
        fail(where, "legacy canonical must be an absolute URL")
      }
    }
    if (redirects.has(targetFile))
      fail(where, "destination must be canonical content, not another redirect")
  }
}

try {
  await main()
} catch (error) {
  fail("check-wiki", error.message)
}

console.log(
  `Wiki: ${counts.articles} articles, ${counts.wikilinks} wikilinks, ${counts.pages} HTML pages, ` +
    `${counts.urls} URL references, ${counts.anchors} anchors, ${counts.legacy} legacy URLs.`,
)
if (errors.size) {
  console.error(`Wiki check failed: ${errors.size} issue(s).`)
  for (const error of [...errors].sort().slice(0, 80)) console.error(`- ${error}`)
  if (errors.size > 80) console.error(`… ${errors.size - 80} further issue(s) omitted.`)
  process.exitCode = 1
} else {
  console.log("Wiki check passed.")
}
