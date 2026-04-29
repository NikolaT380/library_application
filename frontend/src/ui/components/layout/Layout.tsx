import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <Header />

            {}
            <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
                <Outlet />
            </Container>

            <Footer />
        </Box>
    );
};

export default Layout;