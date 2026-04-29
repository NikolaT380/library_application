import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper, Alert } from '@mui/material';

import api from '../../../axios/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setError('');


        api.post('/auth/login', {
            username: username,
            password: password
        })
            .then((response) => {

                localStorage.setItem('jwt_token', response.data.token);


                navigate('/books');


                window.location.reload();
            })
            .catch((err) => {

                setError("Погрешно корисничко име или лозинка!");
                console.error(err);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Најава
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Логирај се
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;