import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
            <Paper elevation={3} sx={{ p: 6, textAlign: 'center', borderRadius: 4, maxWidth: 600 }}>
                <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                    Welcome to Library App
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Manage your books, authors, and countries easily using our modern dashboard.
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" size="large" component={Link} to="/books">
                        View Books
                    </Button>
                    <Button variant="outlined" size="large" component={Link} to="/authors">
                        View Authors
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default HomePage;