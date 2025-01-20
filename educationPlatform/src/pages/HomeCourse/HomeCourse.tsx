import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Alert, Avatar } from '@mui/material';  // Avatar'ı MUI'den import ediyoruz
import './HomeCourse.css';  // Stil dosyasını import ediyoruz

interface Course {
    courseID: number;
    name: string;
    description: string;
    imageUrl: string;
    instructorName: string;
    instructorSurname: string;
    profileImage: string;
    averageRating?: number;
}

interface HomeCourseProps {
    selectedCategoryId: number | null; // Kategori ID'si props olarak alıyoruz
}

const HomeCourse: React.FC<HomeCourseProps> = ({ selectedCategoryId }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [noCoursesMessage, setNoCoursesMessage] = useState<string>(''); // Kurs bulunmadığında gösterilecek mesaj
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setCourses([]);  // Kursları önce sıfırlıyoruz

            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    setError('Token bulunamadı, lütfen giriş yapınız.');
                    return;
                }

                // Eğer kategori seçilmemişse, tüm kursları çekiyoruz
                let url = 'http://localhost:5212/course/all';
                if (selectedCategoryId !== null) {
                    url = `http://localhost:5212/course/all?categoryId=${selectedCategoryId}`; // Kategoriye göre filtreliyoruz
                }

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 404) {
                    setNoCoursesMessage('Bu kategoriye ait kurs bulunmamaktadır.');
                } else {
                    setCourses(response.data);
                    setNoCoursesMessage(''); // Kurslar bulunduğunda mesajı temizliyoruz
                }
            } catch (err: unknown) {  // 'unknown' türü kullanılarak hataya güvenli şekilde yaklaşılır
                if (axios.isAxiosError(err) && err.response?.status === 404) { // 404 hatası kontrolü
                    setNoCoursesMessage('Bu kategoriye ait kurs bulunmamaktadır.');
                } else {
                    setError('Kurslar yüklenirken bir hata oluştu.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [selectedCategoryId]); // selectedCategoryId değiştiğinde, yeniden veri çekeceğiz

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="course-list">
           
            {noCoursesMessage && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: '100%' }}>
                <Alert severity="warning" sx={{ textAlign: "center", marginBottom: '20px' }}>
                  {noCoursesMessage}
                </Alert>
              </div>
               
            )}  {/* Kurs bulunmadığında mesaj göster */}
            {courses.map((course) => (
                <div key={course.courseID} className="course-card" onClick={() => navigate(`/course/${course.courseID}`)}>
                    {/* Kurs resmi */}
                    <img className="course-image" src={`http://localhost:5212${course.imageUrl}`} alt={course.name} />
                    
                    {/* Kurs detayları */}
                    <div className="course-details">
                        <h3>{course.name}</h3>
                       
                    </div>

                    {/* Eğitmenin profil resmi Avatar ile gösteriliyor */}
                    <div className="course-instructor">
                        <Avatar 
                            src={`http://localhost:5212${course.profileImage}`} 
                            alt={`${course.instructorName} ${course.instructorSurname}`} 
                            sx={{ width: 28, height: 28 }} // Boyutlandırma
                        />
                        <p style={{marginLeft:"5px", fontFamily:"monserrat",fontSize:"16px",fontWeight:"bold"}}>{course.instructorName} {course.instructorSurname}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomeCourse;
