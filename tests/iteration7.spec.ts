import {test,expect} from "@playwright/test"

test("Recursos: detalles expandidos con avatar y acción Compartir",async({page})=>{
 await page.goto("/")
 const sidebar=page.locator("[data-sidebar='sidebar']").first()
 await sidebar.getByText("Recursos",{exact:true}).click()
 for(const section of ["Pilotos","Circuitos","Vehículos"]){
  await sidebar.getByText(section,{exact:true}).click()
  const grid=page.locator(".resources-page .shadcn-grid")
  await expect(grid.getByRole("button",{name:/Compartir/}).first()).toBeVisible()
  await grid.getByRole("button",{name:/Detalle de/}).first().click()
  await expect(page.locator(".resource-detail-with-avatar .resource-avatar").first()).toBeVisible()
 }
})

test("Nueva sesión: abrir vehículo sin perder el formulario",async({page})=>{
 await page.goto("/")
 await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Nueva sesión"}).click()
 await page.getByRole("textbox",{name:"Nombre de la sesión"}).fill("Prueba de selección")
 const selector=page.getByRole("region",{name:"Registros de Vehículos disponibles"})
 await selector.getByRole("button",{name:"Abrir"}).first().click()
 await expect(page.locator(".resource-form-card [data-slot=card-title]")).toContainText("Editar · Vehículo")
 await page.locator(".sidebar07-breadcrumb-bar").getByRole("button",{name:"Volver"}).click()
 await expect(page.getByRole("textbox",{name:"Nombre de la sesión"})).toHaveValue("Prueba de selección")
})

test("Preferencias: tema y unidades independientes",async({page})=>{
 await page.goto("/")
 const sidebar=page.locator("[data-sidebar='sidebar']").first()
 await sidebar.getByText("Configuración",{exact:true}).click()
 await sidebar.getByText("Preferencias",{exact:true}).click()
 await expect(page.locator("[data-slot=card-title]").filter({hasText:"Unidades de medida"})).toBeVisible()
 await page.getByRole("combobox",{name:"Tema"}).selectOption("dark")
 await expect(page.locator("html")).toHaveAttribute("data-theme","dark")
 await page.getByRole("combobox",{name:"Velocidad"}).selectOption("mph")
 await expect(page.getByText("62,14 mph")).toBeVisible()
 await page.reload()
 await expect(page.locator("html")).toHaveAttribute("data-theme","dark")
})

test("Mi cuenta: área de estadísticas propia y acciones de seguridad",async({page})=>{
 await page.goto("/")
 const sidebar=page.locator("[data-sidebar='sidebar']").first()
 await sidebar.getByText("Configuración",{exact:true}).click()
 await sidebar.getByText("Mi cuenta",{exact:true}).click()
 await expect(page.locator("[data-slot=card-title]").filter({hasText:"Uso y estadísticas"})).toBeVisible()
 await expect(page.getByRole("img",{name:"Gráfico demostrativo de evolución de actividad"})).toBeVisible()
 await expect(page.getByRole("button",{name:"Restablecer contraseña"})).toBeVisible()
 await expect(page.getByRole("button",{name:"Eliminar cuenta"})).toBeVisible()
})
