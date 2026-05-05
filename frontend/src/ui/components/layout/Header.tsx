import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/login');
    };

    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                        📚 Library App
                    </Typography>
                    <Button color="inherit" component={Link} to="/books">Books</Button>
                    <Button color="inherit" component={Link} to="/authors">Authors</Button>
                    <Button color="inherit" component={Link} to="/countries">Countries</Button>
                    <Button color="inherit" onClick={handleLogout}>Одјава</Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;