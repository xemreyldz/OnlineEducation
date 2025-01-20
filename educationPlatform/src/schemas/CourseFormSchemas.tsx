import * as yup from "yup";
export const CourseFormSchemas = yup.object().shape({
    Name: yup.string()
    .max(100, "Kurs adı en fazla 100 karakter olabilir")
    .required("Kurs adı zorunludur"),
  Description: yup.string().max(500, "Açıklama en fazla 500 karakter olabilir"),
  CategoryID: yup.number()
    .required("Kategori seçimi zorunludur")
    .positive("Geçerli bir kategori seçin")
    .min(1, "Kategori seçimi zorunludur"),


})
export default CourseFormSchemas;