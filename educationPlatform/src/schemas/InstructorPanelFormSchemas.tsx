import * as yup from "yup";
export const InstructorPanelFormSchemas = yup.object().shape({
    age: yup.number()
        .positive("yaşınız negatif olamaz")
        .min(18, "En az 18 yaşında olmalısınız")
        .max(100, "En fazla 100 yaşında olmalısınız"),
    bio: yup.string()
        .max(500, "en fazla 500 karakter girmelisiniz"),
    phone: yup.string()
        .required("telefon numarası zorunludur")






})
export default InstructorPanelFormSchemas