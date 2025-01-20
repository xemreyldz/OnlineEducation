import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Avatar, CircularProgress, Grid, Paper, Button, TextField, Snackbar, Alert, Autocomplete } from '@mui/material';
import "./InstructorProfile.css";
import specialties from "./Specialty";
import { useTheme } from '../../Theme/ThemeContext';

interface InstructorProfileProps {
    firstName: string;
    lastName: string;
    age: number | null;
    email: string;
    phone: string;
    profileImageUrl: string | null;
    specialty: string | null;
    bio: string | null;
}

const InstructorProfile: React.FC = () => {
    const { darkMode } = useTheme();
    const [instructorData, setInstructorData] = useState<InstructorProfileProps | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [age, setAge] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [specialty, setSpecialty] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchInstructorProfile = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    setError('Token bulunamadı.');
                    return;
                }

                const response = await axios.get('http://localhost:5212/instructor/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setInstructorData(response.data);
                setAge(response.data.age?.toString() || '');
                setBio(response.data.bio || '');
                setSpecialty(response.data.specialty || '');
                setPreviewImage(response.data.profileImageUrl || '');
            } catch (err) {
                setError('Profil bilgileri alınırken bir hata oluştu.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorProfile();
    }, []);

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
        if (!instructorData) return;

        const formData = new FormData();
        formData.append('firstName', instructorData.firstName || '');
        formData.append('lastName', instructorData.lastName || '');
        formData.append('age', age || '');
        formData.append('email', instructorData.email || '');
        formData.append('phone', instructorData.phone || '');
        formData.append('specialty', specialty || '');
        formData.append('bio', bio || '');

        if (selectedImage) {
            formData.append('file', selectedImage);
        }

        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('Token bulunamadı.');
                return;
            }

            const response = await axios.put('http://localhost:5212/instructor/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Yeni token'ı localStorage'a kaydet
            localStorage.setItem('userToken', response.data.token);
            setSnackbarMessage('Profil güncelleme işlemi başarılı!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setInstructorData(response.data);

            if (response.data.profileImageUrl) {
                setPreviewImage(response.data.profileImageUrl);
            }

        } catch (err) {
            console.log("Güncelleme Başarısız ! ", err);
            setSnackbarMessage('Profil güncelleme başarısız!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

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

    if (!instructorData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="textSecondary" variant="h6">
                    Profil verisi bulunamadı.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{backgroundColor:darkMode? "black":"white"}}>
            <Grid container justifyContent="center" >
                <Grid item xs={12} sm={8} md={8} mt={5}>
                    <Paper
                        elevation={8}
                        sx={{
                            padding: 5,
                            borderRadius: 2,
                            bgcolor: "white",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                            width: "900px",

                            display: "flex",
                            flexDirection: "row", // Yan yana düzen
                        }}
                    >
                        {/* Sol Taraf: Profil Resmi */}
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mr={3}>
                            <Avatar
                                src={previewImage || `http://localhost:5212${instructorData.profileImageUrl}`}
                                alt={`${instructorData.firstName} ${instructorData.lastName}`}
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

                        <Box
                            sx={
                                {
                                    borderLeft: "1px solid #1976d2",
                                    marginRight: "20px"

                                }
                            }>

                        </Box>



                        {/* Sağ Taraf: Profil Bilgileri */}
                        <Box flex={1}>
                            <Box component="form" noValidate autoComplete="off">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ad"
                                            fullWidth
                                            variant="outlined"
                                            value={instructorData.firstName}
                                            size="small"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Soyad"
                                            fullWidth
                                            variant="outlined"
                                            value={instructorData.lastName}
                                            size="small"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Yaş"
                                            placeholder='Yaşınızı giriniz.'
                                            fullWidth
                                            variant="outlined"
                                            type="number"
                                            value={age || ""}
                                            onChange={(e) => setAge(e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Autocomplete
                                            options={specialties}
                                            value={specialty}
                                            onChange={(event: React.SyntheticEvent, newValue: string | null) => {
                                                setSpecialty(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Uzmanlık Alanı"
                                                    placeholder="Uzmanlık alanını seçiniz."
                                                    fullWidth
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Telefon"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={instructorData.phone}
                                            size="small"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={instructorData.email}
                                            size="small"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            placeholder='Eğitim geçmişinizi ve deneyimlerinizi buraya yazabilirsiniz'
                                            label="Biyografi"
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                                <div className='button-container'>
                                    <div>
                                        <Box display="flex" justifyContent="center" mt={3}>
                                            <Button variant="contained" onClick={handleSave}>PROFİLİ GÜNCELLE</Button>
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
    );
};

export default InstructorProfile;
