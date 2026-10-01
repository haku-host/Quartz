import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { LegacyRedirects } from "./quartz/plugins/emitters/legacyRedirects"
import { componentRegistry } from "./quartz/components/registry"
import type { ExplorerOptions } from "@quartz-community/explorer"
import graphPackage from "@quartz-community/graph/package.json" with { type: "json" }

const explorerOptions: Partial<ExplorerOptions> = {
  sortFn: (a, b) => {
    const sections = [
      "start",
      "services",
      "billing",
      "hakustack",
      "pterodactyl",
      "minecraft",
      "help",
      "about",
    ]
    const rankA = a.slugSegments?.length === 1 ? sections.indexOf(a.slugSegment ?? "") : -1
    const rankB = b.slugSegments?.length === 1 ? sections.indexOf(b.slugSegment ?? "") : -1
    if (rankA >= 0 && rankB >= 0) return rankA - rankB
    return (
      (a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1) ||
      (a.displayName ?? "").localeCompare(b.displayName ?? "", "ru", { numeric: true })
    )
  },
}
componentRegistry.setOptionOverrides("@quartz-community/explorer", explorerOptions)

const config = await loadQuartzConfig()
// GitHub Pages needs its own base path; the server build keeps the YAML default.
const baseUrlOverride = process.env.HAKU_WIKI_BASE_URL?.trim()
if (baseUrlOverride) {
  config.configuration.baseUrl = baseUrlOverride.replace(/^https?:\/\//, "").replace(/\/+$/, "")
}
config.plugins.emitters.push(LegacyRedirects())
config.plugins.emitters.push({
  name: "HakuMobileNavigation",
  emit: async () => [],
  externalResources: () => ({
    js: [
      {
        loadTime: "afterDOMReady",
        contentType: "inline",
        moduleType: "module",
        spaPreserve: true,
        script: `
          const mobileNavigation = window.matchMedia("(max-width: 800px)")
          mobileNavigation.addEventListener("change", ({ matches }) => {
            document.documentElement.classList.remove("mobile-no-scroll")
            document.querySelectorAll(".explorer").forEach((explorer) => {
              explorer.classList.toggle("collapsed", matches)
              explorer.setAttribute("aria-expanded", String(!matches))
            })
          })
        `,
      },
    ],
  }),
})
export default config
export const layout = await loadQuartzLayout()

// graph 1.0.0 derives the current slug from the URL and loses folder /index.
// Use Quartz's canonical data-slug so /folder/ keeps its links on both sites.
// Keep the match explicit: a future plugin update must review or remove this shim.
const graphSlugReader = "function u(){var o=we(),a=Hu();"
const graphComponents = new Set(
  [layout.defaults, ...Object.values(layout.byPageType)].flatMap((page) => page.right ?? []),
)
for (const component of graphComponents) {
  if (component.name !== "Graph") continue
  if (
    graphPackage.version !== "1.0.0" ||
    typeof component.afterDOMLoaded !== "string" ||
    !component.afterDOMLoaded.includes(graphSlugReader)
  ) {
    throw new Error("Review the Graph folder-slug compatibility shim after upgrading the plugin")
  }
  component.afterDOMLoaded = component.afterDOMLoaded.replace(
    graphSlugReader,
    `function u(){if(document.body?.dataset?.slug)return document.body.dataset.slug;var o=we(),a=Hu();`,
  )
}
