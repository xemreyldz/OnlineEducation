import { useState } from 'react';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage, FormikHelpers, FieldProps } from "formik";
import BadgeIcon from '@mui/icons-material/Badge';
import { RegisterFormSchemas } from "../../schemas/RegisterFormSchemas"
import { TextField, Button, Box, InputAdornment, Snackbar, Alert, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Checkbox, FormHelperText, Typography, Divider } from "@mui/material";
import { useTheme } from '../../Theme/ThemeContext';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import PhoneInput from 'react-phone-number-input';
import "./Register.css"
import 'react-phone-number-input/style.css';


interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    platformUsage: "" | "student" | "instructor";
    termsAccepted: boolean;



}

const Register = () => {
    const { darkMode } = useTheme();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
    const [showPassword, setShowPassword] = useState(false);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleRegister = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
        try {

            const response = await axios.post('http://localhost:5212/user/register', {
                FirstName: values.firstName,
                LastName: values.lastName,
                Email: values.email,
                Phone: values.phone,
                Password: values.password,
                platformUsage: values.platformUsage,






            });
            console.log("Gönderilen Veriler:", values);
            console.log("Başarılı Yanıt:", response.data);
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            resetForm();

        }
        catch (error) {
            console.error("Kayıt hatası:", error);
            setSnackbarMessage("Kayıt sırasında bir hata oluştu!");
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false)
        }

    }

    return (
        <div>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    phone: "",
                    platformUsage: "",
                    termsAccepted: false,

                }}
                validationSchema={RegisterFormSchemas}
                onSubmit={handleRegister}
            >
                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} style={{
                        backgroundColor: darkMode ? "black" : "white", color: darkMode ? "white" : "black"
                        , display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <div className="register-form" style={{ backgroundColor: darkMode ? "#95959595" : "white" }}>
                            <Typography variant="h5" textAlign="center" marginBottom={3} sx={{ color: darkMode ? 'white' : 'black' }}>
                                Her Yolda Yeni Başlangıç!
                            </Typography>
                            {/* Ad ve Soyad Alanları */}
                            <Box display="flex" mb={2} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" >
                                <Box flex={1} mr={1} mb={{ xs: 1, sm: 0 }}>
                                    <Field
                                        as={TextField}
                                        label="Ad"
                                        variant="outlined"
                                        id="firstName"
                                        name="firstName"
                                        fullWidth
                                        value={values.firstName}
                                        onChange={handleChange}
                                        helperText={
                                            <ErrorMessage
                                                name="firstName"
                                                render={(msg) => <span style={{ color: 'red' }}>{msg}</span>}
                                            />
                                        }
                                        InputLabelProps={{
                                            style: { color: darkMode ? "white" : "black" }, // Etiket rengi
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle sx={{ color: darkMode ? "white" : "#757575" }} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                color: darkMode ? 'white' : 'black',
                                                backgroundColor: darkMode ? '#222' : 'white',
                                            },
                                        }}
                                    />

                                </Box>

                                <Box flex={1}>
                                    <Field
                                        as={TextField}
                                        label="Soyad"
                                        variant="outlined"
                                        id="lastName"
                                        name="lastName"
                                        fullWidth
                                        helperText={
                                            <ErrorMessage
                                                name="lastName"
                                                render={(msg) => <span style={{ color: 'red' }}>{msg}</span>}
                                            />
                                        }
                                        value={values.lastName}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            style: { color: darkMode ? "white" : "black" },

                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BadgeIcon sx={{ color: darkMode ? "white" : "#757575" }} />
                                                </InputAdornment>
                                            ),
                                            style: {
                                                color: darkMode ? 'white' : 'black',
                                                backgroundColor: darkMode ? '#222' : 'white',
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>

                            {/* Eposta ve Şifre Alanı */}

                            <Box flex={1} mr={1} mb={{ xs: 1, sm: 0 }}>
                                <Field
                                    as={TextField}
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    id="email"
                                    name="email"
                                    fullWidth
                                    helperText={
                                        <ErrorMessage
                                            name="email"
                                            render={(msg) => <span style={{ color: 'red' }}>{msg}</span>}
                                        />
                                    }
                                    value={values.email}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        style: { color: darkMode ? "white" : "black" }, // Etiket rengi
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: darkMode ? "white" : "#757575" }} />
                                            </InputAdornment>
                                        ),
                                        style: {
                                            color: darkMode ? 'white' : 'black',
                                            backgroundColor: darkMode ? '#222' : 'white',
                                        },
                                    }}
                                />

                            </Box>



                            <Box flex={1}>
                                <Field
                                    as={TextField}
                                    label="Şifre"
                                    variant="outlined"
                                    type={showPassword ? "text" : "password"} // Şifreyi göster/gizle
                                    id="password"
                                    name="password"
                                    fullWidth
                                    helperText={
                                        <ErrorMessage
                                            name="password"
                                            render={(msg) => <span style={{ color: 'red' }}>{msg}</span>}
                                        />
                                    }
                                    value={values.password}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        style: { color: darkMode ? "white" : "black" }, // Etiket rengi
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: darkMode ? "white" : "#757575" }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    onClick={() => setShowPassword(!showPassword)} // Butona tıklandığında şifre görünürlüğünü değiştir
                                                    style={{ padding: 0, color: darkMode ? "white" : "#757575" }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />} {/* İkonu değiştir */}
                                                </Button>
                                            </InputAdornment>
                                        ),
                                        style: {
                                            color: darkMode ? 'white' : 'black',
                                            backgroundColor: darkMode ? '#222' : 'white',
                                        },
                                    }}
                                />
                            </Box>
                            {/* Telefon     */}
                            <Box display="flex" mb={2} flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" >
                                <Box flex={2}>
                                    <Field name="phone">
                                        {({ field, form }: FieldProps) => (
                                            <div className={darkMode ? 'dark-mode' : 'light-mode'}>
                                                <PhoneInput
                                                    {...field}
                                                    defaultCountry="TR"
                                                    onChange={(value: string | undefined) => form.setFieldValue('phone', value || '')}
                                                    international
                                                    countryCallingCodeEditable={false}
                                                    style={{
                                                        width: '100%',
                                                        height: '55px', // Yüksekliği eşitlemek için
                                                        fontSize: '20px',
                                                        paddingLeft: '14px',
                                                        borderRadius: '5px',
                                                        border: `1px solid ${darkMode ? 'black' : "#dadada"}`,
                                                        color: darkMode ? "white" : "black",
                                                        backgroundColor: darkMode ? "#222222 " : "white"
                                                    }}
                                                />
                                                {/* Hata mesajını burada manuel olarak stilize ediyoruz */}
                                                <div style={{ color: 'red', fontSize: '14px', marginTop: "5px", textAlign: "left", marginLeft: "10px" }}>
                                                    <ErrorMessage name="phone" />
                                                </div>
                                            </div>
                                        )}
                                    </Field>
                                </Box>
                            </Box>

                            {/* Platform  */}
                            <Box mb={2}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel
                                        htmlFor="platformUsage"
                                        sx={{ color: darkMode ? "white" : "black" }}
                                    >
                                        Platformu kullanım amacınız nedir?
                                    </InputLabel>
                                    <Field
                                        as={Select}
                                        label="Platformu Ne İçin Kullanacaksınız?"
                                        id="platformUsage"
                                        name="platformUsage"
                                        fullWidth

                                        value={values.platformUsage}
                                        onChange={handleChange}
                                        inputProps={{
                                            sx: {
                                                textAlign: 'left',  // Texti sola hizala
                                                color: darkMode ? "white" : "black",
                                                backgroundColor: darkMode ? "#222222" : "white",
                                            },
                                        }}
                                        labelId="platformUsage"
                                    >
                                        <MenuItem value="student">Yeni beceriler öğrenmek için</MenuItem>
                                        <MenuItem value="instructor">Başka kişilere öğretmek için</MenuItem>
                                    </Field>
                                    <ErrorMessage
                                        name="platformUsage"
                                        render={(msg) => (
                                            <FormHelperText sx={{ color: "red" }}>{msg}</FormHelperText>
                                        )}
                                    />
                                </FormControl>
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />

                            {/* Kullanım Koşulları Onayı */}
                            <Box mb={2} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <div>
                                    <FormControlLabel
                                        control={
                                            <Field
                                                as={Checkbox}
                                                name="termsAccepted"
                                                color="primary"
                                            />
                                        }
                                        label="Kullanım koşullarını kabul ediyorum"
                                    />
                                </div>
                                <ErrorMessage
                                    name="termsAccepted"
                                    render={(msg) => (
                                        <div style={{ color: 'red', fontSize: '14px', marginTop: "5px", marginLeft: "30px" }}>
                                            {msg}
                                        </div>
                                    )}
                                />
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2, color: darkMode ? "white" : "black", backgroundColor: darkMode ? "black" : "#163836" }}
                            >
                                {isSubmitting ? 'Lütfen Bekleyin...' : 'KAYIT OL'}
                            </Button>
                        </div>
                    </Form>

                )}

            </Formik>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default Register;
