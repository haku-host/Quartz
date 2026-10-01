import fs from "node:fs/promises"
import path from "node:path"
import redirects from "../../../scripts/legacy-urls.json"
import { QuartzEmitterPlugin } from "../types"
import { FilePath, FullSlug, resolveRelative, simplifySlug } from "../../util/path"

// Keep the exact spelling of published v4 URLs, including Cyrillic capitals.
// Frontmatter aliases in Quartz 5 are normalized to lowercase.
export const LegacyRedirects: QuartzEmitterPlugin = () => ({
  name: "HakuLegacyRedirects",
  async *emit({ argv, cfg }) {
    for (const [oldSlug, targetSlug] of Object.entries(redirects)) {
      const target = encodeURI(resolveRelative(oldSlug as FullSlug, targetSlug as FullSlug))
      const canonical = new URL(
        encodeURI(simplifySlug(targetSlug as FullSlug).replace(/^\/+/, "")),
        `https://${cfg.configuration.baseUrl}/`,
      ).href
      const destination = path.join(argv.output, `${oldSlug}.html`) as FilePath
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(
        destination,
        `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<link rel="canonical" href="${canonical}">
<meta http-equiv="refresh" content="0; url=${target}">
<title>Статья переехала — Haku Host</title>
</head>
<body><p>Статья переехала. <a href="${target}">Открыть актуальную инструкцию</a>.</p></body>
</html>
`,
      )
      yield destination
    }
  },
})
