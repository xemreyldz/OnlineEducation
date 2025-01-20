import React, { ReactNode } from 'react';
import  Container  from '@mui/material/Container';
import "./PageContainer.css"

interface PageContainerProps {
  children: ReactNode; // 'children' için tip tanımı
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <Container maxWidth="lg">{children}</Container>
  );
};

export default PageContainer;
