import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Menu, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Theme/ThemeContext';

// Kurs tipi interface'i
interface Course {
    courseID: number;
    name: string;
}

const MyCourses: React.FC = () => {
     const { darkMode} = useTheme();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  // Veri yükleniyor durumu için
    const [error, setError] = useState<string | null>(null); // Hata durumu için
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);  // Menü açma durumu için
    const navigate = useNavigate();// Yönlendirme için React Router hook'u

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('userToken'); // Token'ı localStorage'dan al
                if (!token) {
                    setError('Kullanıcı girişi yapılmamış.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5212/course/mycourses', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Token'ı Authorization header'ında gönderiyoruz
                    },
                });

                setCourses(response.data);  // API'den gelen kursları state'e kaydet
                setLoading(false);
            } catch (error: any) {
                console.error('Kurslar alınırken hata oluştu', error.response ? error.response.data : error.message);
                setError(error.response ? error.response.data : error.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);  // useEffect boş bağımlılıkla çalışacak, yani component mount olduğunda çalışacak

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);  // Menü açmak için anchor elementini ayarla
    };

    const handleMenuClose = () => {
        setAnchorEl(null);  // Menü kapat
    };
    const handleCourseClick = (courseID: number) => {
        navigate(`/course/${courseID}`);  // Kurs detay sayfasına yönlendir
    };

    return (
        <div>          
            {loading ? (
                <CircularProgress />  // Yükleniyor durumunda dönen bir yükleme simgesi
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <Button sx={{backgroundColor:darkMode ? "white":"#163836"}} onClick={handleMenuClick} variant="contained">
                        ÖĞRENİM İÇERİĞİM
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <MenuItem 
                                    key={course.courseID} 
                                    onClick={() => handleCourseClick(course.courseID)} // Kursa tıklandığında yönlendir
                                >
                                    {course.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Kayıtlı kurs bulunamadı.</MenuItem>
                        )}
                    </Menu>
                </>
            )}
        </div>
    );
};

export default MyCourses;
