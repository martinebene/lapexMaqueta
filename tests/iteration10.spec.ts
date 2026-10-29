import { test, expect } from "@playwright/test"

// Las preferencias del prototipo son locales. Las pruebas no usan API ni BD.
async function openPreferences(page:import("@playwright/test").Page){
 await page.goto("/")
 const sidebar=page.locator("[data-sidebar='sidebar']").first()
 await sidebar.getByText("Configuración",{exact:true}).click()
 await sidebar.getByText("Preferencias",{exact:true}).click()
}

test("Unidades: nuevas magnitudes y alternativas configurables",async({page})=>{
 await openPreferences(page)
 const choices:Record<string,string[]>={
  "Ángulo":["°","rad"],
  "Fuerza":["N","kN"],
  "Régimen / frecuencia de giro":["rpm","Hz"],
  "Tiempo / duración":["s","ms","min","h"],
  "Masa / peso":["kg","lb","g"],
  "Potencia":["CV","hp","kW","W"],
  "Presión":["bar","psi","kPa","Pa"],
  "Distancias cortas":["m","ft","cm"],
  "Temperatura":["°C","°F","K"],
  "Volumen / capacidad":["L","gal (EE. UU.)","mL"],
  "Rigidez de resorte":["N/mm","lbf/in"],
 }
 for(const [label,options] of Object.entries(choices)){
  const combo=page.getByRole("combobox",{name:label})
  await expect(combo).toBeVisible()
  for(const option of options){
   await expect(combo.locator("option").filter({hasText:option}).first()).toBeAttached()
  }
 }
 await page.getByRole("combobox",{name:"Ángulo"}).selectOption("rad")
 await expect(page.getByText("Ejemplo: 1,57 rad")).toBeVisible()
 await page.getByRole("combobox",{name:"Fuerza",exact:true}).selectOption("kN")
 await expect(page.getByText("Ejemplo: 1,25 kN")).toBeVisible()
 await page.getByRole("combobox",{name:"Régimen / frecuencia de giro"}).selectOption("Hz")
 await expect(page.getByText("Ejemplo: 100 Hz")).toBeVisible()
 await page.getByRole("combobox",{name:"Tiempo / duración"}).selectOption("h")
 await expect(page.getByText("Ejemplo: 1 h")).toBeVisible()
 await page.reload()
 const sidebar=page.locator("[data-sidebar='sidebar']").first()
 await sidebar.getByText("Configuración",{exact:true}).click()
 await sidebar.getByText("Preferencias",{exact:true}).click()
 // Persisten los valores, sin transformar ni sobrescribir mediciones del producto.
 await expect(page.getByRole("combobox",{name:"Ángulo"})).toHaveValue("rad")
 await expect(page.getByRole("combobox",{name:"Tiempo / duración"})).toHaveValue("h")
})

test("Unidades: conversiones distintas de masa/longitud y decimales",async({page})=>{
 await openPreferences(page)
 const pairs=[
  {label:"Temperatura",unit:"K",example:"295,15 K"},
  {label:"Presión",unit:"Pa",example:"210.000 Pa"},
  {label:"Potencia",unit:"W",example:"88.259,85 W"},
  {label:"Masa / peso",unit:"g",example:"900.000 g"},
  {label:"Distancias cortas",unit:"cm",example:"2.500 cm"},
  {label:"Volumen / capacidad",unit:"mL",example:"50.000 mL"},
  {label:"Rigidez de resorte",unit:"lbf/in",example:"456,81 lbf/in"},
  {label:"Aceleración",unit:"m/s²",example:"11,77 m/s²"},
  {label:"Torque",unit:"lb·ft",example:"177,01 lb·ft"},
 ]
 for(const pair of pairs){
  await page.getByRole("combobox",{name:pair.label}).selectOption(pair.unit)
  await expect(page.getByText("Ejemplo: "+pair.example)).toBeVisible()
 }
})

test("Unidades: la antigua preferencia lb/in se migra a lbf/in",async({page})=>{
 await page.goto("/")
 await page.evaluate(()=>localStorage.setItem("lapex-preferences",JSON.stringify({spring:"lb/in",pressure:"desconocida"})))
 await page.reload()
 const sidebar=page.locator("[data-sidebar='sidebar']").first()
 await sidebar.getByText("Configuración",{exact:true}).click()
 await sidebar.getByText("Preferencias",{exact:true}).click()
 await expect(page.getByRole("combobox",{name:"Rigidez de resorte"})).toHaveValue("lbf/in")
 await expect(page.getByText("Ejemplo: 456,81 lbf/in")).toBeVisible()
 await expect(page.getByRole("combobox",{name:"Presión"})).toHaveValue("bar")
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem("lapex-preferences")||"{}").spring)).toBe("lbf/in")
})
