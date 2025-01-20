import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./Dashboard.css"
import useTheme from '@mui/material/styles/useTheme';

interface Stats {
    totalCourses: number;
    totalStudents: number;
}
const Dashboard: React.FC = () => {
    const { darkMode } = useTheme();
    const [stats, setStats] = useState<Stats | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("userToken");
                setLoading(true);
                const response = await axios.get<Stats>("http://localhost:5212/instructor/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(response.data);
            } catch (err) {
                setError('Verileri alırken bir hata oluştu.');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (

        <div className="dashboard"  >
            <h1>Dashboard</h1>
            <div className="stats">
                <div className="stat-card">
                    <h2>Kurslarım</h2>
                    <p>{stats?.totalCourses}</p>
                </div>
                <div className="stat-card">
                    <h2>Öğrencilerim</h2>
                    <p>{stats?.totalStudents}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
