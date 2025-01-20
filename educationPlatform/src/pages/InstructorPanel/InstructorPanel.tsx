import React from 'react'
import Sidebar from '../../components/SideBar/SideBar'
import { Outlet } from 'react-router-dom'; // Outlet dinamik içerik için
import "./InstructorPanel.css";
import { useTheme } from '../../Theme/ThemeContext';

const InstructorPanel: React.FC = () => {
    const { darkMode } = useTheme();
    return (
        <div className="instructor-panel">
            <Sidebar />
            <div className="content" style={{backgroundColor: darkMode ? "black":"white"}}>
                <Outlet /> {/* Dinamik içerik buraya gelecek */}
            </div>

        </div>
    )
}

export default InstructorPanel