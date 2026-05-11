import { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box,
    IconButton, Menu, MenuItem, Avatar, Tooltip, Divider
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { jwtDecode } from 'jwt-decode';
import type { MouseEvent } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = sessionStorage.getItem('jwt_token');

    let username = 'User';
    let userInitial = 'U';
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            username = decoded.sub || decoded.username || 'User';
            userInitial = username.charAt(0).toUpperCase();
        } catch (e) {
            console.error("Грешка при декодирање на токен", e);
        }
    }

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = () => {
        handleCloseUserMenu();
        sessionStorage.removeItem('jwt_token');
        navigate('/login');
    };

    const pages = [
        { name: 'Books', path: '/books' },
        { name: 'Authors', path: '/authors' },
        { name: 'Countries', path: '/countries' }
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #1976d2 0%, #115293 100%)', boxShadow: 3 }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>

                    {/* ЛОГО ЗА ДЕСКТОП */}
                    <AutoStoriesIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 4,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 800,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LIBRARY
                    </Typography>

                    {/* ХАМБУРГЕР МЕНИ ЗА МОБИЛЕН */}
                    {token && (
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton size="large" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.name}
                                        onClick={() => { handleCloseNavMenu(); navigate(page.path); }}
                                        selected={isActive(page.path)}
                                    >
                                        <Typography sx={{ textAlign: 'center', fontWeight: isActive(page.path) ? 'bold' : 'normal' }}>
                                            {page.name}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}

                    {/* ЛОГО ЗА МОБИЛЕН */}
                    <AutoStoriesIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LIBRARY
                    </Typography>

                    {/* ГЛАВНО МЕНИ ЗА ДЕСКТОП */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {token && pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => navigate(page.path)}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    fontWeight: isActive(page.path) ? 'bold' : 'medium',
                                    bgcolor: isActive(page.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* ДЕСНА СТРАНА: ЛОГИН КОПЧЕ ИЛИ ПРОФИЛ МЕНИ */}
                    <Box sx={{ flexGrow: 0 }}>
                        {token ? (
                            <>
                                <Tooltip title="Опции за профилот">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: '2px solid rgba(255,255,255,0.5)' }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 'bold' }}>{userInitial}</Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem disabled sx={{ opacity: '1 !important' }}>
                                        <Typography sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                                            Hello, {username}
                                        </Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout}>
                                        <Typography sx={{ textAlign: 'center', color: 'error.main', fontWeight: 'bold' }}>
                                            Одјави се
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    color="inherit"
                                    onClick={() => navigate('/login')}
                                    sx={{ fontWeight: 'bold', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                                >
                                    Најава
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    Регистрација
                                </Button>
                            </Box>
                        )}
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;