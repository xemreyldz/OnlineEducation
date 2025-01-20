import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Avatar } from "@mui/material";
import Profile from "../../images/default.png"; // Profil resmi
import "./SideBar.css"
import { jwtDecode } from 'jwt-decode';
import { IoIosNotifications } from "react-icons/io";
import { FcFeedback } from "react-icons/fc";
import { PiStudent } from "react-icons/pi";
import { MdOutlineOndemandVideo } from "react-icons/md";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useTheme } from "../../Theme/ThemeContext";
import { Dashboard } from "@mui/icons-material";



interface Profile {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
    "profileImageUrl": string;
}

const Sidebar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null); // Kullanıcı adı durumu
    const [surname, setSurname] = useState<string | null>(null);
    const { darkMode, toggleDarkMode } = useTheme();
    const [profile ,setProfile] = useState<string | null>(null); // Tema durumu ve değiştirme işlevini alır.

    useEffect(() => {
        const userToken = localStorage.getItem('userToken'); // Token localStorage’dan alır.
        if (userToken) {
            try {
                const data: Profile = jwtDecode(userToken);
                setUsername(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
                setSurname(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]);
                setProfile(data["profileImageUrl"]);



            } catch (error) {
                console.error("Token decoding", error);
            }
        }

    }, [])
    return (
        <div className="sidebar" style={{ backgroundColor: darkMode ? "#171717" : "#163836", color: darkMode ? "white" : "black" }}>
            <div className="profile-section" > {/* Profil kısmı için yeni bir div */}
                <Avatar
                    src={`http://localhost:5212${profile}` } // Profil resmi
                    alt="User Profile"
                    sx={{ width: 80, height: 80 }} // Avatar boyutu
                />
                <h3>{username} {surname}</h3> {/* Kullanıcı adı */}
            </div>
            <ul>

                <li>
                    <Link to="/instructor-panel/profile">
                        <AccountBoxIcon />  Profilim
                    </Link>
                </li>
                <li>
                    <Link to="/instructor-panel/courses">
                        <MdOutlineOndemandVideo size={24} /> Kurslarım
                    </Link>
                </li>
                 <li>
                    <Link to="/instructor-panel">
                        <Dashboard /> Dashboard
                    </Link>
                </li> 

                <li>
                    <Link to="/instructor-panel/create-course">
                        <LibraryAddIcon /> Kurs Ekle
                    </Link>
                </li>
                <li>
                    <Link to="/instructor-panel/mystudents">
                        <PiStudent size={25} /> Öğrencilerim
                    </Link>
                </li>
                <li>
                    <Link to="/instructor-panel/notification">
                        <IoIosNotifications size={26} /> Duyurular
                    </Link>
                </li>
                <li>
                    <Link to="/instructor-panel/comments">
                        <FcFeedback size={26} /> Değerlendirmeler
                    </Link>
                </li>


            </ul>
        </div>
    );
};

export default Sidebar;
