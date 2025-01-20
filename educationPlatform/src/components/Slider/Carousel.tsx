import React, { useEffect, useState } from 'react'
import "./Carousel.css"
interface CarouselProps {
    images: string[];
  }


const Carousel:React.FC<CarouselProps> = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      };
       // Bir önceki resme geçiş fonksiyonu
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };
     // Resimlerin otomatik geçişini sağlamak için useEffect kullanıyoruz
  useEffect(() => {
    const interval = setInterval(nextSlide, 7000); // Her 3 saniyede bir geçiş yapar
    return () => clearInterval(interval); // Bileşen unmount olduğunda interval'i temizler
  }, [currentIndex]);
  return (
    <div className="carousel">
      <button className="prev" onClick={prevSlide}>‹</button>
      <div className="carousel-slide">
        {images.map((image:string, index:number) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={index === currentIndex ? 'active' : 'inactive'}
          />
        ))}
      </div>
      <button className="next" onClick={nextSlide}>›</button>
    </div>
  )
}

export default Carousel