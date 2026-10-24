import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import es from "./i18n/es.json"
void i18n.use(initReactI18next).init({lng:"es",fallbackLng:"es",resources:{es:{translation:es}},interpolation:{escapeValue:false},react:{useSuspense:false},returnNull:false})
export default i18n
