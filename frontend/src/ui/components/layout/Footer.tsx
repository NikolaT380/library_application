import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box sx={{ bgcolor: 'text.secondary', color: 'white', p: 3, mt: 'auto', textAlign: 'center' }}>
            <Typography variant="body2">
                © {new Date().getFullYear()} Library Application
            </Typography>
        </Box>
    );
};

export default Footer;