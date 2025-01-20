import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../Theme/ThemeContext';
import './Category.css';

interface Category {
  categoryID: number;
  name: string;
  url: string;
}

interface CategoryProps {
  onCategorySelect: (categoryId: number) => void;
}

const Category: React.FC<CategoryProps> = ({ onCategorySelect }) => {
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5212/category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(err => {
        console.error('Hata:', err.response ? err.response.data : err.message);
      });
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    onCategorySelect(categoryId); // Kategori ID'sini parent bileşene gönder
  };

  return (
    <div >
      <ul className="category-list">
        {categories.map((category) => (
          <li
            key={category.categoryID}
            className="category-item" style={{ backgroundColor: darkMode ? 'black' : '#163836',}}
            onClick={() => handleCategoryClick(category.categoryID)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
