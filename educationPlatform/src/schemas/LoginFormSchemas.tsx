import * as yup from "yup";
export const LoginFormSchemas = yup.object().shape({
    email: yup.string()
        .required("Email gereklidir")
        .email("Geçerli mail adresi giriniz"),
    password: yup.string()
        .required("Şifreniz gereklidir")
        .min(6, "Şifreniz en az 6 karekterli olmalıdır!"),

})
export default LoginFormSchemas;