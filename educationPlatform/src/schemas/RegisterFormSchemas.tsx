
import * as yup from "yup";

export const RegisterFormSchemas = yup.object().shape({
  firstName: yup.string().required("Adınız gereklidir").min(3,"en az 3 harf girmelisiniz"),
  lastName: yup.string().required("Soyadınız gereklidir"),
  email: yup.string()
    .required("Email gereklidir")
    .email("Geçerli mail adresi giriniz"),
  password: yup.string()
    .required("Şifreniz gereklidir")
    .min(6, "Şifreniz en az 6 karekterli olmalıdır!"),
  phone: yup.string()
    .required("Telefon numaranız gereklidir")
    .min(13, "Geçerli telefon numarası giriniz")
    .max(13, "Geçerli telefon numarası giriniz"),
  termsAccepted: yup.bool().oneOf([true], 'Kullanım koşullarını kabul etmelisiniz.'),
  platformUsage: yup.string().required("Lütfen bir seçenek seçin."),

});

export default RegisterFormSchemas;