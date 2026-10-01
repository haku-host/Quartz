import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { LegacyRedirects } from "./quartz/plugins/emitters/legacyRedirects"
import { componentRegistry } from "./quartz/components/registry"
import type { ExplorerOptions } from "@quartz-community/explorer"

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
