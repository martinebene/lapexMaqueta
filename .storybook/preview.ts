import type { Preview } from "@storybook/react-vite"
import { createElement } from "react"
import "../src/i18n"
import "../src/index.css"
import "../src/layout.css"

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: { expanded: true },
    backgrounds: { disable: true },
  },
  decorators: [
    (Story) => createElement("div",
      { className: "style-nova", style: { width: "100%", minWidth: 0, color: "var(--foreground)" } },
      createElement(Story)),
  ],
}
export default preview
