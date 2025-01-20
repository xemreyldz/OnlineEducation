import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Mystudents.css';

interface Student {
  studentID: number;
  firstName: string;
  lastName: string;
  courseName: string;
  enrollmentDate:string;
}

const Mystudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
          const response = await axios.get("http://localhost:5212/instructor/mystudents", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setStudents(response.data); // Öğrencilerin listesini state'e set et
        }
      } catch (error) {
        setError("Hata oluştu, lütfen tekrar deneyin.");
        console.log(error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="students-container">
      {error && <div className="error">{error}</div>} {/* Hata mesajını göstermek için */}

      <table className="students-table">
        <thead>
          <tr>
            <th>Adı</th>
            <th>Soyadı</th>
            <th>Kayıtlı Olduğu Kurs</th>
            <th>Kursa Kayıt Tarihi</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentID}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.courseName}</td> {/* 'Name' yerine 'courseName' */}
              <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td> {/* Kayıt tarihini formatlıyoruz */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mystudents;
