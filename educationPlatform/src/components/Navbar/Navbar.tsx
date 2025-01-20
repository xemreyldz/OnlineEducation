import "./Navbar.css"; // Navbar bileşeni için özel stil dosyasını içe aktarır.
import AppBar from "@mui/material/AppBar"; // Material-UI'dan üst menü (navbar) bileşeni sağlar.
import Box from "@mui/material/Box"; // Material-UI kutu düzenleme bileşeni, düzenlemeyi kolaylaştırır.
import Toolbar from "@mui/material/Toolbar"; // AppBar içinde öğeleri hizalamak için kullanılır.
import { Link } from 'react-router-dom'; // React Router’dan sayfalar arası geçiş için bağlantılar sağlar.
import Container from "@mui/material/Container"; // İçeriği merkezi hizalanmış bir konteynırda sunar.
import Logo from "../../assets/logov1.png"; // Uygulama logosunu dosyadan içe aktarır.
import { Button, FormGroup, FormControlLabel, IconButton, Typography, Divider, ListItemIcon } from "@mui/material"; // Form ve kullanıcı arayüzü bileşenlerini sağlar.

import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles'; // Material-UI’dan temayı yapılandırmak için kullanılır.
import { useTheme } from '../../Theme/ThemeContext'; // Tema durumu ve kontrolü için özel tema kancasını getirir.
import { styled } from '@mui/material/styles'; // Özelleştirilmiş stil bileşenleri oluşturmak için kullanılır.
import Switch from '@mui/material/Switch'; // Tema değiştirmek için açma/kapama düğmesi sağlar.
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Gündüz (aydınlık) tema ikonu.
import BedtimeIcon from '@mui/icons-material/Bedtime'; // Gece (karanlık) tema ikonu.
import { jwtDecode } from 'jwt-decode'; // Kullanıcının JSON Web Token'ini (JWT) çözmek için kullanılır.
import { useEffect, useState } from "react"; // React hookları ile durum ve yaşam döngüsü işlevleri sağlar.
import { useNavigate } from 'react-router-dom'; // Yönlendirme işlemlerini gerçekleştirmek için kullanılır.
import { Menu, MenuItem } from '@mui/material'; // Açılır menü bileşeni sağlar.
import PersonIcon from '@mui/icons-material/Person'; // Kullanıcı simgesi.
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { PiSignInBold } from "react-icons/pi";
import NotificationsIcon from '@mui/icons-material/Notifications'; // Bildirim simgesi
import Badge from '@mui/material/Badge'; // Sayaç için bileşen
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Kontrol paneli ikonu
import SearchBar from "../SearchBar/SearchBar";
import MyCourse from "../MyCourse/MyCourse";
import axios from "axios";

// Switch bileşeni için özel stil ayarları
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  // Switch’in stil ayarları burada yapılabilir.
}));

interface Notification {
  notificationID: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}


// JWT tokeninde bulunan özel payload (yük) türü tanımlama
interface CustomJwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": string;
  userTypes: string
  exp: number;
  nbf: number;
  iss: string;
  aud: string;
}

// Navbar bileşeni tanımlaması
const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme(); // Tema durumu ve değiştirme işlevini alır.
  const [username, setUsername] = useState<string | null>(null); // Kullanıcı adı durumu
  const [surname, setSurname] = useState<string | null>(null); // Kullanıcı soyadı durumu
  const [userTypes, setUserTypes] = useState<string | null>(null); //
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Menü açılış konumunu belirlemek için kullanılır.
  // Bildirim menüsünün açılıp kapanma durumunu kontrol etmek için state
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Hata durumu
  const navigate = useNavigate(); // Sayfa yönlendirme işlemleri için.
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Async fonksiyon oluşturuluyor
    const fetchNotificationCount = async () => {
      try {
        const token = localStorage.getItem('userToken');
        // Bildirim sayısını çekme işlemi
        // Eğer token varsa, header'a ekleyelim
        const response = await axios.get('http://localhost:5212/instructor/allnotifications', {
          headers: {
            Authorization: `Bearer ${token}`, // Token'ı Authorization başlığında gönderiyoruz
          },
        });
        setNotificationCount(response.data.length); // Gelen bildirim sayısını set et
      } catch (error) {
        console.error('Bildirimleri çekerken hata:', error);
        setError('Bildirim sayısını alırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false); // Yükleme işlemi bitince loading durumunu güncelle
      }
    };

    fetchNotificationCount(); // Async fonksiyonu çağırıyoruz
  }, []); // Sadece component mount olduğunda çalışacak

  // Bildirim menüsüne tıklandığında bildirimleri almak
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get('http://localhost:5212/instructor/allnotifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Bildirimleri çekerken bir hata oluştu:', error);
        setError('Bildirimleri alırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Bileşen yüklendiğinde kullanıcı tokenini çözme ve kontrol etme işlemleri
  useEffect(() => {
    const userToken = localStorage.getItem('userToken'); // Token localStorage’dan alır.

    if (userToken) {
      try {
        const data: CustomJwtPayload = jwtDecode(userToken); // Token’i çözerek kullanıcı bilgilerini alır.
        setUsername(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
        setSurname(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]);
        setUserTypes(data.userTypes);
        console.log(data);
        // Token süresini kontrol etme işlevi
        const checkTokenExpiration = () => {
          const currentTime = Date.now() / 1000; // Şimdiki zamanı saniye cinsinden alır.
          if (data.exp < currentTime) {
            handleLogout(); // Süresi dolduysa çıkış yapar.
          }
        };

        // Token süresini periyodik kontrol eder
        const intervalId = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(intervalId); // Bileşen kapanırken interval’i temizler.

      } catch (error) {
        console.error("Token decoding failed:", error); // Token çözümlenemezse hatayı yazdırır.
      }
    } else {
      setUsername(null); // Kullanıcı yoksa ad ve soyadı sıfırlar.
      setSurname(null);
      setUserTypes(null);
    }
  }, [localStorage.getItem('userToken')]); // Token güncellendiğinde çalışır.

  // Kullanıcı menüsünü açma işlevi
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Kullanıcı menüsünü kapatma işlevi
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Çıkış yapma işlevi
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Token’i kaldırır.
    setUsername(null); // Kullanıcıyı sıfırlar.
    navigate('/login'); // Login sayfasına yönlendirir.
    setAnchorEl(null); // Menü kapatılır.
  };
  // Bildirim menüsünü açma
  const NotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Bildirim menüsünü kapatma
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = async (notificationID: number) => {
    try {
      const token = localStorage.getItem("userToken");

      // Bildirim okundu olarak güncellendiğinde bildirimi güncelle
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((notif) =>
          notif.notificationID === notificationID ? { ...notif, isRead: true } : notif
        );

        // Okunmamış bildirim sayısını güncelle
        const unreadCount = updatedNotifications.filter((notif) => !notif.isRead).length;
        setNotificationCount(unreadCount);

        return updatedNotifications;
      });

      // Bildirim okundu durumunu sunucuda güncelle
      await axios.post(
        'http://localhost:5212/instructor/updateNotificationStatus',
        { notificationID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Bildirim durumu güncellenemedi:", error);
    }
  };
  useEffect(() => {
    // İlk yüklemede okunmamış bildirimleri say
    const unreadCount = notifications.filter((notif) => !notif.isRead).length;
    setNotificationCount(unreadCount);
  }, [notifications]);





  // Tema ayarları
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Tema modunu belirler.
      background: {
        default: darkMode ? '#000000' : '#ffffff', // Varsayılan arka plan rengi
        paper: darkMode ? '#000000' : '#ffffff', // Kartlar için arka plan rengi
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <AppBar position="static" sx={{ backgroundColor: darkMode ? 'black' : '#F5F5F5' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* WebLogo */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              <Link to="/">
                <Box component="img" src={Logo} alt="Logo" sx={{ width: 100, height: 105 }} />
              </Link>
            </Box>

            {/* Ortada Arama Çubuğu */}
            {username && userTypes === "student" && (
              <SearchBar />
            )}


            {/* Sağ tarafa sabitlenen kullanıcı ve tema ayarları */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>


              {/* Eğitimlerim menüsü */}
              {username && userTypes === "student" && ( // 2, öğrenci rolü
                <MyCourse />
              )}


              {/* Kullanıcı giriş durumu */}
              {username ? (
                <div>
                  {userTypes === "instructor" ? (
                    // Sadece Oturumu Kapat butonu gösterilir
                    <div>
                      {/* Kontrol Paneli Butonu */}
                      <Link to="/instructor-panel"> {/* Link ile yönlendirme */}
                        <Button
                          sx={{
                            color: darkMode ? 'black' : 'white',
                            backgroundColor: darkMode ? "white" : "#163836",
                          }}
                          startIcon={<AdminPanelSettingsIcon sx={{ marginBottom: "4px", marginLeft: "6px" }} />}
                        >
                          KONTROL PANELİ
                        </Button>
                      </Link>
                      <Button
                        sx={{
                          color: darkMode ? 'black' : 'white',
                          backgroundColor: darkMode ? "white" : "#163836", marginLeft: "10px"
                        }}
                        onClick={handleLogout}
                      >
                        <LogoutIcon sx={{ marginRight: "5px" }} />
                        Oturumu Kapat
                      </Button>
                    </div>
                  ) : (
                    // Diğer kullanıcı türleri için menü gösterilir
                    <Button
                      sx={{
                        color: darkMode ? 'black' : 'white',
                        backgroundColor: darkMode ? "white" : "#163836",
                      }}
                      startIcon={<PersonIcon sx={{ marginBottom: "4px", marginLeft: "6px" }} />}
                      onClick={handleClick}
                    >
                      {username} {surname}
                    </Button>
                  )}

                  {/* Kullanıcı menüsü (Instructor kullanıcı tipi için görünmez) */}
                  {userTypes !== "instructor" && (
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                      <MenuItem onClick={() => navigate('/profile')}>
                        <ManageAccountsIcon sx={{ marginRight: "5px" }} />
                        Profilim
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ marginRight: "5px" }} />
                        Oturumu Kapat
                      </MenuItem>
                    </Menu>
                  )}
                </div>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* Giriş Yap Butonu */}
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button
                      startIcon={<PiSignInBold />}
                      variant="contained"
                      sx={{ backgroundColor: darkMode ? '#ffffff' : '#163836' }}
                    >
                      GİRİŞ YAP
                    </Button>
                  </Link>
                </Box>
              )}

              {/* Bildirim Butonu */}
              {username && userTypes === "student" && (
                <Box sx={{ position: 'relative' }}>
                  <IconButton onClick={NotificationClick} aria-label="notifications">
                    <Badge
                      badgeContent={notificationCount}
                      color="error"
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem', minWidth: '20px', height: '20px' } }}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  <Menu
                    anchorEl={notificationAnchorEl}
                    open={Boolean(notificationAnchorEl)}
                    onClose={handleNotificationClose}
                    PaperProps={{
                      style: { maxHeight: 400, width: '320px', padding: '10px' },
                      elevation: 5,
                    }}
                  >
                    <Typography variant="h6" sx={{ padding: '8px 16px', fontWeight: 'bold' }}>
                      Bildirimler
                    </Typography>
                    <Divider />
                    {notifications.length === 0 ? (
                      <MenuItem disabled>
                        <Typography variant="body2" color="textSecondary">
                          Henüz bildiriminiz yok.
                        </Typography>
                      </MenuItem>
                    ) : (
                      // Bildirimleri tarihe göre sıralayıp ilk 3'ü dilimle
                      notifications
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 3)
                        .map((notification: Notification) => (
                          <MenuItem
                            key={notification.notificationID}
                            onClick={() => handleNotificationClick(notification.notificationID)}
                            sx={{ backgroundColor: notification.isRead ? '#f0f0f0' : '#ffffff' }}
                          >
                            <strong>{notification.message}</strong>
                            <br />
                            <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                          </MenuItem>
                        ))
                    )}
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        handleNotificationClose(); // Menü kapansın
                        navigate('/student-notifications'); // Sayfaya yönlendir
                      }}
                      sx={{ justifyContent: 'center' }}
                    >
                      <Typography variant="body2" color="primary">
                        Tüm Bildirimleri Göster
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              )}


              {/* Tema Değiştirici Switch */}
              <FormGroup>
                <FormControlLabel
                  control={<MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} />}
                  label={darkMode ? <BedtimeIcon sx={{ color: '#ffffff' }} /> : <WbSunnyIcon sx={{ color: '#000000' }} />}
                />
              </FormGroup>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </MUIThemeProvider>
  );
};

export default Navbar;
