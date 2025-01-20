import { Box } from '@mui/material';
import { useTheme } from '../../Theme/ThemeContext'; // Tema bağlamını kullanma
import "./Home.css"
import PageContainer from '../../container/PageContainer';
import Category from '../../components/Category/Category';
import Carousel from '../../components/Slider/Carousel';
import sosyalMedya from "../../images/sosyalmedyabanner.jpg"
import bannerTwo from "../../images/bnner.jpg"
import mobileBanner from "../../images/mobile-banner.jpg"
import egitimBanner from "../../images/egitimBanner.jpg";
import HomeCourse from '../HomeCourse/HomeCourse';
import { useState } from 'react';

const Home: React.FC = () => {
  const { darkMode } = useTheme(); // Tema durumunu al
  const images = [
    bannerTwo,
    sosyalMedya,
    mobileBanner,
    egitimBanner
  ];

  // Kategori ID'sini state olarak tutuyoruz
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Kategori seçildiğinde çağrılacak fonksiyon
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);  // Seçilen kategori ID'sini güncelliyoruz
  };

  return (
    <div>
      <Box sx={{ backgroundColor: darkMode ? 'black' : 'white', color: darkMode ? 'white' : 'black'}}>
        <PageContainer>
          <div>
            {/* Category bileşenine, kategori seçildiğinde tetiklenecek fonksiyonu gönderiyoruz */}
            <Category onCategorySelect={handleCategorySelect} />
            <Carousel images={images} />
          </div>
          <div>
            {/* Seçilen kategori ID'sini HomeCourse bileşenine gönderiyoruz */}
            <HomeCourse selectedCategoryId={selectedCategoryId} />
          </div>
        </PageContainer>
      </Box>
    </div>
  );
};

export default Home;
