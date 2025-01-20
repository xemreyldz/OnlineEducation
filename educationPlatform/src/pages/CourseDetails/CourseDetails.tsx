import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Avatar, Button, Rating, Snackbar, TextField } from "@mui/material";
import { useParams } from 'react-router-dom';
import CommentList from "../CommentList/CommentList";
import "./CourseDetails.css";
import { jwtDecode } from 'jwt-decode';

interface CourseDetail {
  courseID: number;
  name: string;
  description: string;
  imageUrl: string;
  instructorName: string;
  instructorSurname: string;
  profileImage: string;
  videoPath: string;
  averageRating?: number;
  instructorSpecailty: string;
}

interface JwtUser {
  userTypes: string
}

const CourseDetails: React.FC = () => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string>("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("Token bulunamadı, lütfen giriş yapınız.");
          return;
        }

        const decodedToken = jwtDecode<JwtUser>(token); // any yerine uygun bir tip de kullanabilirsiniz.
        setIsStudent(decodedToken.userTypes === 'student')

        const courseResponse = await axios.get(`http://localhost:5212/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourse(courseResponse.data);
        if (courseResponse.data.averageRating) {
          setUserRating(courseResponse.data.averageRating);
        }
      } catch (err) {
        console.error("Kurs detayları yüklenirken bir hata oluştu:", err);
        setError("Kurs detayları yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleRatingChange = async (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue === null) return;
    setUserRating(newValue);
    const token = localStorage.getItem("userToken");
    if (token && course) {
      try {
        await axios.post(`http://localhost:5212/course/rate`, {
          courseID: course.courseID,
          rating: newValue,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Rating gönderilirken bir hata oluştu:", err);
      }
    }
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!comment) {
      setCommentError("Lütfen yorumunuzu girin.");
      return;
    }

    setCommentError("");

    const token = localStorage.getItem("userToken");
    if (token && course) {
      try {
        await axios.post(`http://localhost:5212/course/add-comment`, {
          courseID: course.courseID,
          content: comment,
          feedbackID: null,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComment("");
        alert("Yorumunuz başarıyla eklendi.");
      } catch (err) {
        console.error("Yorum gönderilirken bir hata oluştu:", err);
        setCommentError("Yorum eklenirken bir hata oluştu.");
      }
    }
  };

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      const token = localStorage.getItem("userToken");
      if (!token || !course) return;

      try {
        const response = await axios.get(
          `http://localhost:5212/course/is-enrolled?courseID=${course.courseID}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsEnrolled(response.data);
      } catch (error) {
        console.error("Kayıt durumu kontrol edilirken hata oluştu:", error);
      }
    };
    checkEnrollmentStatus();
  }, [course]);

  const handleEnroll = async () => {
    const token = localStorage.getItem("userToken");
    if (!token || !course) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5212/course/enroll`,
        {
          courseID: course.courseID,
          feedback: ""
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(response.data);
      setSnackbarMessage('Kurs kayıt işleminiz başarılı');
      setSnackbarSeverity('success');
      setSnackbarOpen(true); // Yanıt verisini log'layabilir veya kullanabilirsiniz
      setIsEnrolled(true);
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!course) {
    return <div>Kurs bilgileri bulunamadı.</div>;
  }

  return (
    <div className="course-details-container">
      <div className="left-panel">
        <video
          src={`http://localhost:5212${course?.videoPath}`}
          controls
          className="course-video"
        >
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
        <div className="instructor-info">
          <Avatar
            src={`http://localhost:5212${course?.profileImage}`}
            alt={`${course?.instructorName} ${course?.instructorSurname}`}
            className="instructor-image"
          />
          <p className="instructor-name">
            {course?.instructorName} {course?.instructorSurname}
            <span className="instructor-specialty">
              {course?.instructorSpecailty}
            </span>
          </p>
          <div className="rating-container">
            <Rating
              name="instructor-rating"
              value={userRating}
              onChange={handleRatingChange}
              precision={0.5}
            />
          </div>
        </div>
      </div>

      <div className="right-panel">
        <h1 className="course-title">{course?.name}</h1>
        <p className="course-description">{course?.description}</p>
        {isEnrolled ? (
          <>
            <span className="enrolled-message">Kayıt Oldunuz</span>
            <div className="comment-section">
              <TextField
                label="Yorumunuzu yazın"
                multiline
                rows={4}
                value={comment}
                onChange={handleCommentChange}
                variant="outlined"
                fullWidth
              />
              {commentError && <p className="error-message">{commentError}</p>}
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                onClick={handleCommentSubmit}
              >
                Yorum Ekle
              </Button>
            </div>
            <div className="comment-list">
              <CommentList courseID={course.courseID} />
            </div>
          </>
        ) : (
          isStudent && (
            <Button
              variant="contained"
              className="enroll-button"
              onClick={handleEnroll}
            >
              Kayıt Ol
            </Button>
          )
        )}
      </div>
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

export default CourseDetails;


