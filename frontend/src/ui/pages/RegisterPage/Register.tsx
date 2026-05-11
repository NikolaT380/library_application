import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Alert } from '@mui/material';
import api from '../../../axios/axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Лозинките не се совпаѓаат!");
            return;
        }

        try {
            const response = await api.post('/auth/register', { username, password });

            const token = response.data.token || response.data.jwtToken;

            if (token) {
                sessionStorage.setItem('jwt_token', token);
                navigate('/books');
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.response?.data || "Грешка при регистрација! Можеби корисничкото име веќе постои.");
            console.error(err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                <Typography component="h1" variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Регистрација
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Корисничко име"
                        name="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Лозинка"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Потврди Лозинка"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Регистрирај се
                    </Button>

                    {/* ДОДАДЕНО: Линк кон најава */}
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                        <Typography variant="body2">
                            Веќе имате профил?{' '}
                            <Button variant="text" size="small" onClick={() => navigate('/login')} sx={{ fontWeight: 'bold' }}>
                                Најавете се
                            </Button>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;