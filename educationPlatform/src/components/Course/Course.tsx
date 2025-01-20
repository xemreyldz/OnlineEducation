import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Course.css";
import { Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; // İkonlar
import { useNavigate } from "react-router-dom";


interface Course {
  courseID: number;
  name: string;
  description: string;
  imageUrl: string;
  instructorName: string;
  instructorSurname: string;
}

const Course = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          setError("Token bulunamadı, lütfen giriş yapınız.");
          setIsLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:5212/course", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log(response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Kurslar yüklenirken bir hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseID: number) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError("Token bulunamadı, lütfen giriş yapınız.");
        return;
      }

      // API'ye DELETE isteği gönderiliyor
      await axios.delete(`http://localhost:5212/course/${courseID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setCourses(courses.filter((course) => course.courseID !== courseID));

    } catch (error) {
      console.log("Kurs silinirken bir hata oluştu", error);
      setError("Kurs silinirken bir hata oluştu");
    }
  }

  const goToEditCourse = (courseID: number) => {
    navigate(`/instructor-panel/edit-course/${courseID}`);
  }





  if (isLoading) {
    return <div className="loading">{error}</div>;
  }

  return (
    <div className="course-page">
      {courses.length === 0 ? (
        <div className="no-courses">Kayıtlı kurs yok</div>
      ) : (
        <div className="course-container">
          {courses.map((course) => (
            <div key={course.courseID} className="course-card">
              <div className="image-wrapper">
                <img
                  src={`http://localhost:5212${course.imageUrl}`}
                  alt={course.name}
                  className="course-image"
                />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.name}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-buttons"
                  style={{
                    display: "flex",
                    justifyContent: "space-around", // Butonları eşit aralıklı düzenler
                    marginTop: "auto",
                  }}
                >
                  <Button onClick={() => goToEditCourse(course.courseID)} startIcon={<Edit />} variant="contained" color="primary">
                    DÜZENLE
                  </Button>
                  <Button onClick={() => handleDeleteCourse(course.courseID)} startIcon={<Delete />} variant="contained" color="error">
                    SİL
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default Course;
