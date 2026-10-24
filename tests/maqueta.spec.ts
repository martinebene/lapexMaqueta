import { test, expect } from "@playwright/test"
test("Sidebar 07 presenta cuatro menús verticales, logo y perfil originales",async({page})=>{
await page.goto("/")
await expect(page.getByRole("heading",{name:"Análisis"})).toBeVisible()
const side=page.locator("[data-sidebar='sidebar']").first()
await expect(side.getByRole("img",{name:/Lapex.ai/})).toBeVisible()
await expect(side.getByRole("img",{name:"Foto de perfil"})).toBeVisible()
for(const name of ["Análisis","Recursos","Datos","Configuración"]){
  await expect(side.getByRole("button",{name:new RegExp(name)}).first()).toBeVisible()
}
await side.getByRole("button",{name:"Recursos"}).click()
for(const name of ["Pilotos","Circuitos","Vehículos","Módulos de análisis"])
  await expect(side.getByRole("button",{name})).toBeVisible()
await side.getByRole("button",{name:"Datos"}).click()
await expect(side.getByRole("button",{name:"Biblioteca de datos"})).toBeVisible()
await expect(side.getByRole("button",{name:"Importar datos"})).toBeVisible()
await side.getByRole("button",{name:"Configuración"}).click()
for(const name of ["Preferencias","Mi cuenta","Ayuda"])
  await expect(side.getByRole("button",{name})).toBeVisible()
})
test("Abrir sesión muestra registros y permite abrir módulo",async({page})=>{
await page.goto("/")
await expect(page.getByRole("table")).toBeVisible()
await page.getByRole("button",{name:"Abrir sesión"}).last().click()
await expect(page.getByRole("heading",{name:"Ensayo de puesta a punto"})).toBeVisible()
await page.getByRole("button",{name:"Mejor vuelta"}).first().click()
await expect(page.getByText("Asistente IA contextual")).toBeVisible()
})
test("Nueva sesión exige contexto datos objetivos y módulo",async({page})=>{
await page.goto("/")
await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Nueva sesión"}).click()
const create=page.getByRole("button",{name:"Crear sesión"})
await expect(create).toBeDisabled()
await page.getByRole("textbox",{name:"Nombre de la sesión"}).fill("Ensayo sidebar 07")
await page.getByRole("radio",{name:"Piloto Demo A"}).check()
await page.getByRole("radio",{name:"Circuito Delta"}).check()
await page.getByRole("radio",{name:"GT-04"}).check()
await page.getByRole("group",{name:"Datos objetivos"}).getByRole("checkbox",{name:"Rodaje · Tanda 02"}).click()
await expect(create).toBeDisabled()
await page.getByRole("group",{name:"Módulos de análisis"}).getByRole("checkbox",{name:"Mejor vuelta"}).click()
await expect(create).toBeEnabled()
await create.click()
await expect(page.getByRole("heading",{name:"Ensayo sidebar 07"})).toBeVisible()
})


test("Menú de usuario abre, cierra y no bloquea la navegación",async({page})=>{
await page.goto("/")
const sidebar=page.locator("[data-sidebar='sidebar']").first()
const logo=sidebar.getByRole("img",{name:/Lapex.ai/})
await expect(logo).toBeVisible()
await expect(logo).toHaveAttribute("src",/lapex-logo.*\.png/)
expect(await logo.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true)
await expect(sidebar.getByRole("img",{name:"Foto de perfil"})).toBeVisible()
const profile=sidebar.getByRole("button",{name:"Menú de usuario"})
await profile.click()
await expect(profile).toHaveAttribute("aria-expanded","true")
const menu=page.getByRole("menu",{name:"Menú de usuario"})
await expect(menu).toBeVisible()
for(const label of ["Uso y estadísticas","Administrar membresía","Cambiar de cuenta","Cerrar sesión"])
  await expect(menu.getByRole("menuitem",{name:label})).toBeVisible()
await menu.getByRole("menuitem",{name:"Uso y estadísticas"}).click()
await expect(page.getByRole("dialog",{name:"Uso y estadísticas"})).toBeVisible()
await page.getByRole("dialog",{name:"Uso y estadísticas"}).getByRole("button",{name:"Cerrar"}).last().click()
await expect(page.getByRole("heading",{name:"Análisis"})).toBeVisible()
await profile.click()
await expect(menu).toBeVisible()
await page.keyboard.press("Escape")
await expect(menu).toBeHidden()
await sidebar.getByRole("button",{name:"Recursos"}).click()
await sidebar.getByRole("button",{name:"Pilotos"}).click()
await expect(page.getByRole("heading",{name:"Pilotos"})).toBeVisible()
})

test("Listados internos conservan scroll propio, fondo y selección contrastada",async({page})=>{
await page.goto("/")
async function check(selector:string){
 const box=page.locator(selector).first()
 await expect(box).toBeVisible()
 const result=await box.evaluate(el=>{
 const header=el.querySelector("thead") as HTMLElement
 const body=el.querySelector("tbody") as HTMLElement
 const h=header.getBoundingClientRect(),b=body.getBoundingClientRect(),outer=el.getBoundingClientRect()
 return {bodyOverflow:getComputedStyle(body).overflowY,outerOverflow:getComputedStyle(el).overflowY,
  headerBottom:h.bottom,bodyTop:b.top,height:b.height,border:getComputedStyle(el).borderTopWidth,outerTop:outer.top}
 })
 expect(result.outerOverflow).toBe("hidden")
 expect(result.bodyOverflow).toBe("scroll")
 expect(result.height).toBeGreaterThan(190)
 expect(result.bodyTop).toBeGreaterThanOrEqual(result.headerBottom-2)
 expect(result.border).not.toBe("0px")
}
await check(".open-session-scroll")
await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Nueva sesión"}).click()
const areas=page.locator(".picker-list")
await expect(areas).toHaveCount(6)
for(let i=0;i<6;i++){
 const area=areas.nth(i)
 const values=await area.evaluate(el=>{
 const top=el.parentElement!.querySelector(".picker-columns")!.getBoundingClientRect()
 const body=el.getBoundingClientRect()
 return {overflow:getComputedStyle(el).overflowY,height:body.height,bodyTop:body.top,headerBottom:top.bottom}
 })
 expect(values.overflow).toBe("scroll")
 expect(values.height).toBeGreaterThan(190)
 expect(values.bodyTop).toBeGreaterThanOrEqual(values.headerBottom-2)
}
const first=areas.first()
const contrast=await first.evaluate(el=>{
 const row=el.querySelector(".picker-row") as HTMLElement
 return {surface:getComputedStyle(el).backgroundColor,row:getComputedStyle(row).backgroundColor}
})
expect(contrast.surface).not.toBe(contrast.row)
await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Recursos"}).click()
await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Pilotos"}).click()
await check(".resource-scroll")
await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Datos"}).click()
await page.locator("[data-sidebar='sidebar']").first().getByRole("button",{name:"Biblioteca de datos"}).click()
await check(".records-scroll")
await expect(page.locator(".demo-banner")).toHaveCount(0)
await expect(page.locator(".sidebar07-hint")).toHaveCount(0)
})
