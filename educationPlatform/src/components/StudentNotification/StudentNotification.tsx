import { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Grid, Divider, Box, Avatar } from '@mui/material';
import axios from 'axios';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

interface Notification {
  notificationID: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const StudentNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get('http://localhost:5212/instructor/allnotifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Bildirimler getirilemedi:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Tüm Bildirimler
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {notifications.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Henüz bildiriminiz yok.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {notifications.map((notif) => (
            <Grid item xs={12} md={6} key={notif.notificationID}>
              <Card
                sx={{
                  backgroundColor: notif.isRead ? '#f0f0f0' : '#ffffff',
                  boxShadow: notif.isRead ? 'none' : '0px 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: notif.isRead ? 'grey.300' : 'primary.main', mr: 2 }}>
                      <NotificationsActiveIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {notif.message}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StudentNotification;
