import { test, expect } from "@playwright/test"

const cases = [
 { section: "Pilotos", folder: "pilots/pilot-default-2.png", label: "Piloto A · rojo y blanco", selected: "pilots/pilot-001.jpg", legacy: "pilots/pilot-default.png", legacyLabel: "Silueta anterior de piloto", count: 16 },
 { section: "Circuitos", folder: "circuits/circuit-default-2.png", label: "Autódromo tradicional con paddock", selected: "circuits/circuit-001.jpg", legacy: "circuits/circuit-default.png", legacyLabel: "Silueta anterior de circuito", count: 7 },
 { section: "Vehículos", folder: "vehicles/vehicle-default-2.png", label: "TC Pick Up", selected: "vehicles/touring/touring-017.jpg", legacy: "vehicles/vehicle-default.jpg", legacyLabel: "Silueta anterior de vehículo deportivo", count: 13 },
]

for (const c of cases) {
 test("Recursos: galería modal y fallback de " + c.section, async ({ page }) => {
  await page.goto("/")
  const nav = page.locator("[data-sidebar='sidebar']").first()
  await nav.getByText("Recursos", { exact: true }).click()
  await nav.getByText(c.section, { exact: true }).click()
  await page.locator(".page-tools").getByRole("button", { name: /Nuevo/ }).click()

  const preview = page.locator(".avatar-picker img.resource-avatar")
  await expect(preview).toHaveAttribute("src", new RegExp(c.folder.replace(".", "\\." ) + "$"))
  await expect.poll(() => preview.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect(page.locator(".avatar-picker .avatar-selection-status")).toHaveText("Imagen predeterminada")

  await page.getByRole("button", { name: "Elegir ilustración" }).click()
  const modal = page.getByRole("dialog")
  await expect(modal).toBeVisible()
  await expect(modal.locator(".avatar-gallery-choice")).toHaveCount(c.count)
  await modal.getByRole("button", { name: "Elegir " + c.label }).click()
  await expect(modal).not.toBeVisible()
  await expect(preview).toHaveAttribute("src", new RegExp(c.selected.replace(".", "\\.") + "$"))
  await expect.poll(() => preview.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)

  await page.getByRole("button", { name: "Elegir ilustración" }).click()
  await page.keyboard.press("Escape")
  await expect(modal).not.toBeVisible()
  await expect(preview).toHaveAttribute("src", new RegExp(c.selected.replace(".", "\\.") + "$"))

  // Los defaults anteriores quedan accesibles si un registro tiene su clave histórica.
  await page.getByRole("button", { name: "Elegir ilustración" }).click()
  await modal.getByRole("button", { name: "Elegir " + c.legacyLabel }).click()
  await expect(preview).toHaveAttribute("src", new RegExp(c.legacy.replace(".", "[.]") + "$"))
  await expect.poll(() => preview.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await page.getByRole("button", { name: "Restablecer predeterminada" }).click()
  await expect(preview).toHaveAttribute("src", new RegExp(c.folder.replace(".", "\\.") + "$"))
 })
}

test("Recursos: subida local temporal tiene precedencia y puede revertirse", async ({ page }) => {
 await page.goto("/")
 const nav = page.locator("[data-sidebar='sidebar']").first()
 await nav.getByText("Recursos", { exact: true }).click()
 await nav.getByText("Pilotos", { exact: true }).click()
 await page.locator(".page-tools").getByRole("button", { name: /Nuevo/ }).click()
 const preview = page.locator(".avatar-picker img.resource-avatar")
 await page.locator('input[aria-label="Subir imagen propia"]').setInputFiles("public/resource-images/demo-001/pilots/pilot-default.png")
 await expect(preview).toHaveAttribute("src", /^data:image\/png;base64,/)
 await expect(page.locator(".avatar-selection-status")).toHaveText("Imagen propia")
 await page.getByRole("button", { name: "Restablecer predeterminada" }).click()
 await expect(preview).toHaveAttribute("src", /pilot-default-2\.png$/)
})
