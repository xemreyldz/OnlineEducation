import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';

interface CategoryForm {
  categoryID: number;
  name: string;
}

const CreateCourse: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryForm[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5212/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Kategoriler alınamadı:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedVideo = event.target.files?.[0];
    if (selectedVideo) {
      if (selectedVideo.size > MAX_VIDEO_SIZE) {
        setSnackbarMessage("Video boyutu 50 MB'den büyük olamaz!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      setVideo(selectedVideo);
      setPreviewVideo(URL.createObjectURL(selectedVideo));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !description || !selectedCategory || !file || !video) {
      setSnackbarMessage("Tüm alanları doldurunuz");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('video', video);
    formData.append('categoryID', String(selectedCategory));
    formData.append('name', name);
    formData.append('description', description);

    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post('http://localhost:5212/course/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Formu temizle
      setName('');
      setDescription('');
      setSelectedCategory(null);
      setFile(null);
      setVideo(null);
      setPreview(null);
      setPreviewVideo(null);
    } catch (error) {
      console.error('Kurs oluşturulurken hata:', error);
      setSnackbarMessage("Kayıt sırasında bir hata oluştu!");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"

      sx={{
        marginTop: 2,
        paddingX: 3,
        gap: 2,
        flexWrap: { xs: 'wrap', md: 'nowrap' }, // Küçük ekranlar için alt alta yerleşim
      }}
    >
      {/* Form Alanı */}
      <Paper
        elevation={2}
        sx={{
          flex: '1 1 60%', // Esnek boyutlandırma
          minWidth: '300px',
          maxWidth: '600px',
          padding: 4,
        }}
      >
        <Typography variant="h5" textAlign={"center"} gutterBottom>
          Kurs Ekle
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Kurs Adı"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Kategori"
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryID} value={category.categoryID}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginY: 2, backgroundColor: "#163836" }}
          >
            Resim Ekle
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginBottom: 2, backgroundColor: "#163836" }}
          >
            Video Ekle
            <input type="file" hidden accept="video/*" onChange={handleVideoChange} />
          </Button>
          <Button sx={{ backgroundColor: "#163836" }} type="submit" variant="contained" color="primary" fullWidth>
            Kursu Oluştur
          </Button>
        </form>
      </Paper>

      {/* Önizleme Alanı */}
      <Paper
        elevation={3}
        sx={{
          flex: '1 1 35%',
          minWidth: '300px',
          maxWidth: '500px',
          height: '570px',
          padding: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Önizleme
        </Typography>
        {preview && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Seçilen Resim:
            </Typography>
            <img
              src={preview}
              alt="Resim Önizleme"
              style={{
                width: '300px',
                borderRadius: 8,
                border: '1px solid #ddd',
                marginBottom: '16px',
              }}
            />
          </Box>
        )}
        {previewVideo && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Seçilen Video:
            </Typography>
            <video
              src={previewVideo}
              controls
              style={{
                width: '300px',
                borderRadius: 8,
                border: '1px solid #ddd',
              }}
            />
          </Box>
        )}
        {!preview && !previewVideo && (
          <Typography color="textSecondary">
            Henüz bir resim veya video seçilmedi.
          </Typography>
        )}
      </Paper>
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

export default CreateCourse;
