import { test, expect } from "@playwright/test"

const base = "http://127.0.0.1:4174/lapexMaqueta/storybook"

test("Storybook: catálogo navegable, historias registradas y assets propios",async({page})=>{
  const misses:string[]=[]
  page.on("response",r=>{
    if(r.status()===404 && /\.(js|css|woff|png|svg)(\?|$)/.test(r.url()))misses.push(r.url())
  })
  const pageResponse=await page.goto(base+"/")
  expect(pageResponse?.ok()).toBe(true)
  await expect(page.locator("iframe#storybook-preview-iframe")).toBeAttached()
  const index=await page.request.get(base+"/index.json")
  expect(index.ok()).toBe(true)
  const json=await index.json()
  const entries=Object.values(json.entries??json.stories??{}) as {id:string,title:string,type?:string}[]
  expect(entries.filter(e=>e.type==="story").length).toBeGreaterThanOrEqual(25)
  expect(entries.some(e=>e.title==="Tablas/ShadcnGrid")).toBe(true)
  expect(misses).toEqual([])
})

test("Storybook: botón real con estilos Nova cargados desde /storybook/",async({page})=>{
  const missing:string[]=[]
  page.on("response",r=>{
    if(r.status()===404 && /\.(js|css|woff|png|svg)(\?|$)/.test(r.url()))missing.push(r.url())
  })
  await page.goto(base+"/iframe.html?id=controles-boton--primario&viewMode=story")
  const button=page.getByRole("button",{name:"Guardar cambios"})
  await expect(button).toBeVisible()
  const styles=await button.evaluate(el=>({
    background:getComputedStyle(el).backgroundColor,
    foreground:getComputedStyle(el).color,
    primary:getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
    styleNova:!!el.closest(".style-nova"),
  }))
  expect(styles.styleNova).toBe(true)
  expect(styles.primary).toBe("#087f88")
  expect(styles.background).not.toBe("rgba(0, 0, 0, 0)")
  expect(missing).toEqual([])
})

test("Storybook: buscador usa un borde único y permite escribir",async({page})=>{
  await page.goto(base+"/iframe.html?id=controles-entrada-de-texto--buscador&viewMode=story")
  const input=page.getByRole("textbox",{name:"Buscar registros"})
  await expect(input).toBeVisible()
  const border=await input.evaluate(el=>({
    input:getComputedStyle(el).borderTopWidth,
    frame:getComputedStyle(el.closest('[data-slot="input-group"]')!).borderTopWidth,
  }))
  expect(parseFloat(border.input)).toBeLessThan(.5)
  expect(parseFloat(border.frame)).toBeGreaterThan(.5)
  await input.fill("Piloto")
  await expect(input).toHaveValue("Piloto")
})

test("Storybook: tabla real con filtros y agrupación interactivos",async({page})=>{
  await page.goto(base+"/iframe.html?id=tablas-shadcngrid--con-filtro-y-agrupacion&viewMode=story")
  const group=page.getByRole("combobox",{name:"Agrupar Registros de prueba"})
  await expect(group).toBeVisible()
  await group.selectOption("track")
  await expect(page.getByRole("button",{name:"Contraer grupo Sin circuito"})).toBeVisible()
  await page.getByRole("textbox",{name:"Buscar en Registros de prueba"}).fill("Tanda 02")
  await expect(page.locator("tbody").getByText("Rodaje · Tanda 02",{exact:true}).first()).toBeVisible()
})
