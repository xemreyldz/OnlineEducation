import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../../Theme/ThemeContext';

interface Notification {
  notificationID: number;
  message: string;
  createdAt: string;
}

const Notification: React.FC = () => {
  const {darkMode} = useTheme();
  const [message, setMessage] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editingNotificationId, setEditingNotificationId] = useState<number | null>(null);
  const [editedMessage, setEditedMessage] = useState<string>('');
  const token = localStorage.getItem('userToken');

  // Bildirimleri çek
  useEffect(() => {
    if (token) {
      fetchNotifications();
    } else {
      alert("Oturum süresi doldu, lütfen giriş yapın.");
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5212/instructor/getnotifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Bildirimler alınamadı:', error);
      alert('Bildirimler yüklenemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      alert('Lütfen bir mesaj girin!');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5212/instructor/send',
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Bildirim başarıyla gönderildi!');
      setMessage('');
      fetchNotifications();
    } catch (error) {
      console.error('Bildirim gönderilemedi:', error);
      alert('Bir hata oluştu, tekrar deneyin.');
    }
  };

  const handleEdit = (notificationId: number, currentMessage: string) => {
    setEditingNotificationId(notificationId);
    setEditedMessage(currentMessage);
  };

  const handleSaveEdit = async () => {
    if (!editedMessage.trim()) {
      alert('Lütfen geçerli bir mesaj girin!');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5212/instructor/update/${editingNotificationId}`,
        { message: editedMessage }, // Backend'in beklediği formata uygun şekilde mesaj
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Bildirim başarıyla güncellendi!');
      setEditingNotificationId(null);
      setEditedMessage('');
      fetchNotifications();
    } catch (error) {
      console.error('Bildirim güncellenemedi:', error);
      alert('Bir hata oluştu, tekrar deneyin.');
    }
  };

  const handleDelete = async (notificationId: number) => {
    if (notificationId === undefined || notificationId === null) {
      alert("Geçersiz bildirim ID'si!");
      return;
    }

    try {
      console.log('Deleting notification with ID:', notificationId); // Kontrol amaçlı ekleyin
      await axios.delete(
        `http://localhost:5212/instructor/delete/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Bildirim başarıyla silindi!');
      fetchNotifications(); // Güncellenmiş bildirimleri almak için
    } catch (error) {
      console.error('Bildirim silinemedi:', error);
      alert('Bir hata oluştu, tekrar deneyin.');
    }
  };


  return (
    <div style={{ padding: '2rem' , backgroundColor: darkMode ?"black":"white",color:darkMode? "white":"black"}}>
      <Typography variant="h4" gutterBottom>
        Bildirim Gönder
      </Typography>

      <TextField
        sx={{
          '& .MuiInputBase-root': {
            color: darkMode ? 'white' : 'white',  // Input text color
          },
          '& .MuiFormLabel-root': {
            color: darkMode ? 'white' : 'black',  // Label text color
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? 'white' : '#003366',  // Border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? 'lightgray' : '#003366',  // Border color on hover
          }
        }}
        label="Bildirim Mesajı"
        fullWidth
        margin="normal"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button variant="contained" color="primary" onClick={handleSendNotification}>
        Gönder
      </Button>

      <Typography variant="h5" style={{ marginTop: '2rem' }}>
        Geçmiş Bildirimler
      </Typography>

      <hr style={{marginTop:10}} />

      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.notificationID}>
            {editingNotificationId === notification.notificationID ? (
              <>
                <TextField
              
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Button sx={{marginLeft:2,marginRight:2}} onClick={handleSaveEdit} variant="contained" color="success">
                  Kaydet
                </Button>
                <Button  onClick={() => setEditingNotificationId(null)} color='error' variant="contained">
                  Vazgeç
                </Button>
              </>
            ) : (
              <>
                <ListItemText
                  primary={notification.message}
                  secondary={`Gönderim Tarihi: ${new Date(notification.createdAt).toLocaleString()}`}
                />
                <IconButton onClick={() => handleEdit(notification.notificationID, notification.message)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(notification.notificationID)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Notification;
