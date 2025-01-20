import React, { useEffect, useState } from 'react'
import "./StudentProfile.css"
import axios from "axios";
import { Alert, Avatar, Box, Button, CircularProgress, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { useTheme } from '../../Theme/ThemeContext';

interface StudentProfileProps {
    firstName: string;
    lastName: string;
    age: number | null;
    email: string;
    phone: string;
    profileImageUrl: string | null;
    school: string | null;
}

const StudentProfile: React.FC = () => {
    const { darkMode } = useTheme();
    const [studentData, setStudentData] = useState<StudentProfileProps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [age, setAge] = useState<string>('');
    const [school, setSchool] = useState<string>('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const token = localStorage.getItem("userToken");

                if (!token) {
                    setError("Token bulunamadı");
                    return;
                }

                const response = await axios.get('http://localhost:5212/student/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
                setStudentData(response.data);
                setAge(response.data.age?.toString() || "");
                setSchool(response.data.school || "");
                setPreviewImage(response.data.profileImageUrl || "");

            }
            catch (error) {
                setError("Profil bilgileri alınırken bir hata oluştu")
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchStudentProfile()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!studentData) return;

        const formData = new FormData();
        formData.append("firstName", studentData.firstName || "");
        formData.append("lastName", studentData.lastName || "");
        formData.append("age", age || "");
        formData.append("email", studentData.email || "");
        formData.append("phone", studentData.phone || "");
        formData.append("school", school || "");

        if (selectedImage) {
            formData.append("file", selectedImage);
        }

        try {
            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("Token bulunamadı");
                return;
            }

            const response = await axios.put('http://localhost:5212/student/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            localStorage.setItem('userToken', response.data.token);
            setSnackbarMessage('Profil güncelleme işlemi başarılı!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setStudentData(response.data);

            if (response.data.profileImageUrl) {
                setPreviewImage(response.data.profileImageUrl);
            }

        } catch (err) {
            console.log("güncelleme Başarısız", err);
            setSnackbarMessage('Profil güncelleme başarısız!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }

    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f7fc">
                <CircularProgress />
            </Box>
        );
    }


    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!studentData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="textSecondary" variant="h6">
                    Profil verisi bulunamadı.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ background: darkMode ? "black" : "white", height: "100vh", color: darkMode ? "white" : "black" }}>
    <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={8} mt={5}>
            <Paper
                elevation={8}
                sx={{
                    padding: 5,
                    borderRadius: 2,
                    backgroundColor: darkMode ? "#736F6F" : "white",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    width: "900px",
                    display: "flex",
                    flexDirection: "row", // Yan yana düzen
                }}
            >
                {/* Sol Taraf: Profil Resmi */}
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mr={3}>
                    <Avatar
                        src={previewImage || `http://localhost:5212${studentData.profileImageUrl}`}
                        alt={`${studentData.firstName} ${studentData.lastName}`}
                        sx={{
                            width: 180,
                            height: 180,
                            marginBottom: 3,
                            border: "2px solid #003366",
                        }}
                    />
                    <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
                        Profil Fotoğrafı Yükle
                        <input hidden type="file" onChange={handleImageChange} />
                    </Button>
                </Box>

                <Box sx={{ borderLeft: "1px solid #1976d2", marginRight: "20px" }} />

                {/* Sağ Taraf: Profil Bilgileri */}
                <Box flex={1}>
                    <Box component="form" noValidate autoComplete="off">
                        <Grid container spacing={2} sx={{ color: darkMode ? "white" : "black" }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    sx={{
                                        '& .MuiInputBase-root': {
                                          color: darkMode ? 'white' : 'black',  // Input text color
                                        },
                                        '& .MuiFormLabel-root': {
                                          color: darkMode ? 'white' : 'black',  // Label text color
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'white' : '#003366',  // Border color
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
                                        }
                                      }}
                                    label="Ad"
                                    fullWidth
                                    variant="outlined"
                                    value={studentData.firstName}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                     sx={{
                                        '& .MuiInputBase-root': {
                                          color: darkMode ? 'white' : 'black',  // Input text color
                                        },
                                        '& .MuiFormLabel-root': {
                                          color: darkMode ? 'white' : 'black',  // Label text color
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'white' : '#003366',  // Border color
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
                                        }
                                      }}
                                    label="Soyad"
                                    fullWidth
                                    variant="outlined"
                                    value={studentData.lastName}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                   sx={{
                                    '& .MuiInputBase-root': {
                                      color: darkMode ? 'white' : 'black',  // Input text color
                                    },
                                    '& .MuiFormLabel-root': {
                                      color: darkMode ? 'white' : 'black',  // Label text color
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: darkMode ? 'white' : '#003366',  // Border color
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
                                    }
                                  }}
                                    label="Yaş"
                                    placeholder="Yaşınızı giriniz."
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={age || ""}
                                    onChange={(e) => setAge(e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                   sx={{
                                    '& .MuiInputBase-root': {
                                      color: darkMode ? 'white' : 'black',  // Input text color
                                    },
                                    '& .MuiFormLabel-root': {
                                      color: darkMode ? 'white' : 'black',  // Label text color
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: darkMode ? 'white' : '#003366',  // Border color
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
                                    }
                                  }}
                                    label="Okul"
                                    fullWidth
                                    variant="outlined"
                                    value={school || ""}
                                    onChange={(e) => setSchool(e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        '& .MuiInputBase-root': {
                                          color: darkMode ? 'white' : 'black',  // Input text color
                                        },
                                        '& .MuiFormLabel-root': {
                                          color: darkMode ? 'white' : 'black',  // Label text color
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'white' : '#003366',  // Border color
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
                                        }
                                      }}
                                    label="Telefon"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={studentData.phone}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{
                                        '& .MuiInputBase-root': {
                                          color: darkMode ? 'white' : 'black',  // Input text color
                                        },
                                        '& .MuiFormLabel-root': {
                                          color: darkMode ? 'white' : 'black',  // Label text color
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'white' : '#003366',  // Border color
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
                                        }
                                      }}
                                    label="Email"
                                    fullWidth
                                    variant="outlined"
                                    defaultValue={studentData.email}
                                    size="small"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <div className="button-container">
                            <div>
                                <Box display="flex" justifyContent="center" mt={3}>
                                    <Button variant="contained" onClick={handleSave}>
                                        PROFİLİ GÜNCELLE
                                    </Button>
                                </Box>
                            </div>
                            <div>
                                <Box display="flex" justifyContent="center" mt={3}>
                                    <Button variant="contained">ŞİFRE DEĞİŞTİR</Button>
                                </Box>
                            </div>
                        </div>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    </Grid>

    {/* Snackbar */}
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
    )
}

export default StudentProfile