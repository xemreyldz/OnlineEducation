import React, { useState } from 'react';
import { Box, Button, InputAdornment, TextField, CircularProgress, Menu, MenuItem, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../../Theme/ThemeContext';

interface Course {
    courseID: number;
    name: string;
    imageUrl: string;
}

const SearchBar: React.FC = () => {
     const { darkMode } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const fetchCourses = async () => {
        if (searchTerm.trim() === '') {
            setAlertMessage('Lütfen bir arama terimi giriniz.');
            return;
        }

        if (searchTerm.length >= 3) {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5212/course/searchCourses?searchTerm=${searchTerm}`);
                setCourses(response.data);

                // Eğer sonuçlar geldiyse menüyü aç
                if (response.data.length > 0) {
                    setAnchorEl(document.getElementById('search-input'));
                }
                if (response.data.length === 0) {
                    // Sonuç yoksa uyarı mesajı göster
                    setAlertMessage('Bu isimle kurs bulunamadı.');
                }
            } catch (error) {
                console.error('Kurs verileri çekilemedi:', error);
                setAlertMessage('Kurs verileri yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        } else {
            setAlertMessage('Arama yapmak için en az 3 karakter yazmalısınız.');
        }
    };

    const handleKeyDown =(e:React.KeyboardEvent) => {
        if (e.key ==="Enter"){
            fetchCourses();

        }
    }


    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div >
            <Box sx={{ mx: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
                <TextField
                    id="search-input"
                    variant="outlined"
                    placeholder="Dilediğiniz şeyi arayınız..."
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                border: 'none',
                            },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    sx={{ ml: 2 ,backgroundColor:darkMode ? "white" : "#163836" }}
                    onClick={fetchCourses}
                >
                    Ara
                </Button>
            </Box>

            {loading && <CircularProgress sx={{ mt: 2 }} />}

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
            >
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <MenuItem key={course.courseID} onClick={handleClose}>
                            <Link to={`/course/${course.courseID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img
                                        height={50}
                                        width={50}
                                        title="course"
                                        src={`http://localhost:5212${course.imageUrl}`}
                                        alt={course.name}
                                    />
                                    <div style={{ marginLeft: '5px' }}>{course.name}</div>
                                </div>
                            </Link>
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>
                        Bu isimle kurs bulunamadı.
                    </MenuItem>
                )}
            </Menu>

            <Snackbar
                open={!!alertMessage}
                autoHideDuration={3000}
                onClose={() => setAlertMessage(null)}
                message={alertMessage}
            />
        </div>
    );
};

export default SearchBar;
