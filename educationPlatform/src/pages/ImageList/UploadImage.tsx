import React, { useState } from 'react';
import axios from 'axios';
import { Form } from 'react-router-dom';

const UploadImage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null); // File tipi eklendi
    const [preview, setPreview] = useState<string | null>(null); // Önizleme için string tip

    // Dosya değişikliği olduğunda çalışır
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]; // Dosya seçimi
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // Dosya önizlemesi
        }
    };

    // Form gönderildiğinde çalışır
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) return alert('Lütfen bir dosya seçin.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5212/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Dosya başarıyla yüklendi!');
            console.log(response.data);
        } catch (error) {
            console.error('Dosya yükleme sırasında hata:', error);
            alert('Dosya yüklenirken bir hata oluştu.');
        }
    };

    return (
        <div>
            <h2>Resim Yükle</h2>
            <Form onSubmit={handleSubmit}>

          
            





                <input title='image' type="file" accept="image/*" onChange={handleFileChange} />
                {preview && <img src={preview} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
                <button type="submit">Yükle</button>
            </Form>
        </div>
    );
};

export default UploadImage;
