import React, { useState } from 'react';
import { TextField, Button, Box, InputAdornment, Snackbar, Alert, Divider, Typography, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import axios from 'axios';
import LoginFormSchemas from '../../schemas/LoginFormSchemas';
import { useTheme } from '../../Theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


interface FormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { darkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = async (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    try {
      const response = await axios.post('http://localhost:5212/user/login', {
        Email: values.email,
        Password: values.password,


      });

      console.log('Başarılı Yanıt:', response.data);
      localStorage.setItem("userToken", response.data.token)
      console.log("userToken:", response.data.token);

      const token = response.data.token;
      localStorage.setItem("userToken", token);



      // JWT'den userTypes bilgisi çözümleme
      const decodedToken = jwtDecode<{ userTypes: string }>(token);
      setTimeout(() => {
        if (decodedToken.userTypes === 'instructor') {
          console.log('Eğitmen paneline yönlendirme...');
          navigate('/instructor-panel');
        } else {
          console.log('Ana sayfaya yönlendirme...');
          navigate('/');
        }
      }, 0);


      setSnackbarMessage('Giriş başarılı!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/');
      resetForm();


    } catch (error) {
      console.error('Giriş hatası:', error);
      setSnackbarMessage('Kullanıcı adı veya şifre hatalı !');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box  className="login-container" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' ,backgroundColor: darkMode ? 'black' : 'white' }}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginFormSchemas}
        onSubmit={handleLogin}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: darkMode ? '#575757' : 'white',
              color: darkMode ? 'white' : 'black',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <Typography variant="h5" textAlign="center" marginBottom={3} sx={{ color: darkMode ? 'white' : 'black' }}>
              Giriş Yap
            </Typography>
            <Box mb={2}>
              <Field
                as={TextField}
                label="E-posta"
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
                  style: { color: darkMode ? 'white' : 'black' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: darkMode ? 'white' : '#757575' }} />
                    </InputAdornment>
                  ),
                  style: {
                    color: darkMode ? 'white' : 'black',
                    backgroundColor: darkMode ? '#222' : 'white',
                  },
                }}
              />
            </Box>

            <Box mb={2}>
              <Field
                as={TextField}
                label="Şifre"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
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
                  style: { color: darkMode ? 'white' : 'black' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: darkMode ? 'white' : '#757575' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ padding: 0, color: darkMode ? 'white' : '#757575' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              variant="contained"
              color="primary"
              sx={{ marginTop: 2, backgroundColor: darkMode ? 'white' : '#163836', color: darkMode ? 'black' : 'white'}}
            >
              {isSubmitting ? 'Lütfen Bekleyin...' : 'Oturum Aç'}
            </Button>

            <Divider sx={{ my: 4 }} />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Link href="/forgot-password" underline="hover" sx={{ fontSize: '0.9rem', color: darkMode ? 'white' : '#757575' }}>
                Şifremi Unuttum
              </Link>
              <Link href="/register" underline="hover" sx={{ fontSize: '0.9rem', color: darkMode ? 'white' : '#757575', textDecoration: "none" }}>
                Hesabın yok mu? Kayıt Ol
              </Link>
            </Box>



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
    </Box>
  );
};

export default Login;
