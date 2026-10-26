import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./storybook-tests",
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4174/lapexMaqueta/storybook/",
    headless: true,
    browserName: "chromium",
  },
  webServer: {
    command: "python3 -m http.server 4174 --directory storybook-public",
    url: "http://127.0.0.1:4174/lapexMaqueta/storybook/index.html",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
