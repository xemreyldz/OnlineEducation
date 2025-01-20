import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "../../Theme/ThemeContext";

// Root stil bileşenini tanımlıyoruz
const Root = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
});

const FormContainer = styled(Card)({
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
});

const CardTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "#003366",
  textAlign: "center",
  marginBottom: "20px",
});

const Form = styled("form")({
  padding: "20px",
});

const SubmitButton = styled(Button)({
  backgroundColor: "#163836",
  color: "#fff",
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  fontWeight: "600",
  "&:hover": {
    backgroundColor: "#163846",
  },
});

const Message = styled(Typography)({
  marginTop: "20px",
  textAlign: "center",
  color: "#59C207",
  fontWeight: "500",
});

const ForgotPassword: React.FC = () => {
  const { darkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5212/user/forgot-password", {
        email,
        newPassword,
      });
      setMessage(response.data);
    } catch (error) {
      console.log(error);
      setMessage("Şifre sıfırlama başarısız oldu!");
    }
  };

  return (
    <Root sx={{ background: darkMode ? "black" : "white" }}>
      <FormContainer>
        <CardContent sx={{ background: darkMode ? "#171717" : "white" }}>
          <CardTitle>Şifremi Unuttum</CardTitle>
          <Form onSubmit={handleSubmit}>
            <TextField
              sx={{
                '& .MuiInputBase-root': {
                  color: darkMode ? 'white' : 'black',  // Input text color
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
              label="E-posta"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              sx={{
                '& .MuiInputBase-root': {
                  color: darkMode ? 'white' : 'black',  // Input text color
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
              label="Yeni Şifre"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <SubmitButton type="submit" variant="contained">
              Şifreyi Sıfırla
            </SubmitButton>
          </Form>
          {message && <Message variant="body2">{message}</Message>}
        </CardContent>
      </FormContainer>
    </Root>
  );
};

export default ForgotPassword;
