import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, CircularProgress, Typography, TextField, Alert, Container, Button } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";

interface Course {
    courseID: number;
    name: string;
    description: string;
    imageUrl: string;
}

const EditCourse = () => {
    const { courseID } = useParams<{ courseID: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    useEffect(() => {
        if (courseID) {
            fetchCourseData(courseID);
        }
    }, [courseID]);

    const fetchCourseData = async (courseID: string) => {
        try {
            const response = await axios.get(`http://localhost:5212/course/get/${courseID}`);
            setCourse(response.data);
            formik.setValues({
                name: response.data.name,
                description: response.data.description,
            });
            setPreviewUrl(`http://localhost:5212${response.data.imageUrl}`);
        } catch (error) {
            console.error("Kurs bilgisi alınamadı:", error);
            setError("Kurs bilgisi alınırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Kurs adı zorunludur."),
        description: Yup.string().required("Açıklama zorunludur."),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("description", values.description);
                if (imageFile) {
                    formData.append("image", imageFile);
                }

                await axios.put(`http://localhost:5212/course/${courseID}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                alert("Kurs başarıyla güncellendi!");
            } catch (error) {
                console.error("Kurs güncellenemedi:", error);
                setError("Kurs güncellenirken bir hata oluştu.");
            }
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Kurs Düzenle
            </Typography>
            {course && (
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }} onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        label="Kurs Adı"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Açıklama"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" component="label">
                            Görsel Yükle
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Box>
                    {previewUrl && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="subtitle1">Görsel Önizleme:</Typography>
                            <img
                                src={previewUrl}
                                alt="Görsel Önizleme"
                                style={{ width: "300px", height: "200px", objectFit: "cover" }}
                            />
                        </Box>
                    )}
                    <Box textAlign="center" sx={{ mt: 3 }}>
                        <Button variant="contained" color="primary" type="submit">
                            Kaydet
                        </Button>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default EditCourse;
