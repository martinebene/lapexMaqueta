import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig } from "vite"

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  // Los archivos públicos son compartidos con el build de la maqueta.
  staticDirs: ["../public"],
  framework: { name: "@storybook/react-vite", options: {} },
  // Reutiliza plugins y aliases del Vite original; la ruta de assets es distinta.
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, { base: "/lapexMaqueta/storybook/" }),
}
export default config
