import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './ui/components/layout/Layout';
import HomePage from './ui/pages/HomePage/HomePage';
import BooksPage from './ui/pages/BooksPage/BooksPage';
import AuthorsPage from './ui/pages/AuthorsPage/AuthorsPage';
import CountriesPage from './ui/pages/CountriesPage/CountriesPage';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './ui/pages/LoginPage/Login';
import Register from './ui/pages/RegisterPage/Register';
import ProtectedRoute from './ui/components/ProtectedRoute';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        background: { default: '#f5f5f5' }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* ЈАВНИ РУТИ ЗА АВТЕНТИКАЦИЈА */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> {/* ДОДАДЕНО */}

                    {/* Layout за сите страници */}
                    <Route path="/" element={<Layout />}>
                        {/* Јавна рута - почетна страница */}
                        <Route index element={<HomePage />} />

                        {/* Заштитени рути - Достапни за сите најавени корисници */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="books" element={<BooksPage />} />
                            <Route path="authors" element={<AuthorsPage />} />
                            <Route path="countries" element={<CountriesPage />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;