import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Card, CardContent, Typography, Divider } from "@mui/material";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface Comment {
    commentID: number;
    content: string;
    createdAt: string;
    userName: string; // Yorum yapan kişinin adı
    userProfileImage: string; // Kullanıcının profil fotoğrafı
    userFirstName: string; // Kullanıcının adı
    userLastName: string; // Kullanıcının soyadı
}

interface CommentListProps {
    courseID: number; // Kurs ID'si, course detay bileşeninden alınacak
}

const CommentList: React.FC<CommentListProps> = ({ courseID }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem("userToken");
                if (!token) {
                    setError("Token bulunamadı, lütfen giriş yapınız.");
                    return;
                }

                const response = await axios.get(`http://localhost:5212/course/comments/${courseID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setComments(response.data);
            } catch (err) {
                console.error("Yorumlar yüklenirken bir hata oluştu:", err);
                setError("Bu kursa daha önce yorum yapılmadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [courseID]);

    if (loading) return <div className="loading">Yorumlar yükleniyor...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="comment-list">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <Card key={comment.commentID} sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                        <CardContent>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                    src={`http://localhost:5212${comment.userProfileImage}`}
                                    alt={`${comment.userFirstName} ${comment.userLastName}`}
                                    sx={{ width: 40, height: 40, marginRight: 2 }}
                                />
                                <div>
                                    <Typography variant="h6" component="div">
                                        {comment.userFirstName} {comment.userLastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </Typography>
                                </div>
                            </div>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1">{comment.content}</Typography>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Stack sx={{ width: '100%' }} spacing={2}>            
                <Alert severity="warning">This is a warning Alert.</Alert>
              </Stack>
            )}
        </div>
    );
};

export default CommentList;
