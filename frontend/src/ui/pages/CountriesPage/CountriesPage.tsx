import { useState } from 'react';
import {
    Box, Typography, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { useCountries } from '../../../hooks/useCountries';
import { jwtDecode } from 'jwt-decode';
import type { Country } from '../../../api/types/country';

const CountriesPage = () => {
    const { countries, loading, addCountry, editCountry, deleteCountry } = useCountries();

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newCountryName, setNewCountryName] = useState('');
    const [newCountryContinent, setNewCountryContinent] = useState('');

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);

    const token = sessionStorage.getItem('jwt_token');
    let isAdmin = false;
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            const role = decoded.role || decoded.authorities?.[0] || '';
            isAdmin = role.includes('ADMIN') || role.includes('ROLE_ADMIN');
        } catch (e) {
            console.error("Could not decode token for role check");
        }
    }

    const handleAddSubmit = async () => {
        if (!newCountryName || !newCountryContinent) return;
        const success = await addCountry(newCountryName, newCountryContinent);
        if (success) {
            setOpenAddDialog(false);
            setNewCountryName('');
            setNewCountryContinent('');
        } else {
            alert("Грешка при додавање!");
        }
    };

    const openEditModal = (country: Country) => {
        setEditingCountry(country);
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async () => {
        if (!editingCountry || !editingCountry.name || !editingCountry.continent) return;
        const success = await editCountry(editingCountry.id, editingCountry.name, editingCountry.continent);
        if (success) {
            setOpenEditDialog(false);
            setEditingCountry(null);
        } else {
            alert("Грешка при измена!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Дали сте сигурни дека сакате да ја избришете оваа земја?")) {
            await deleteCountry(id);
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    🌍 Countries
                </Typography>

                {isAdmin && (
                    <Button variant="contained" color="success" onClick={() => setOpenAddDialog(true)}>
                        + Add New Country
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Country Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Continent</TableCell>
                            {isAdmin && <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countries.map((country) => (
                            <TableRow key={country.id} hover>
                                <TableCell>{country.id}</TableCell>
                                <TableCell>{country.name}</TableCell>
                                <TableCell>
                                    <Chip label={country.continent} size="small" variant="outlined" color="primary" />
                                </TableCell>

                                {isAdmin && (
                                    <TableCell align="right">
                                        {/* Копче за EDIT */}
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            onClick={() => openEditModal(country)}
                                        >
                                            Edit
                                        </Button>
                                        {/* Копче за DELETE */}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(country.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ДИАЛОГ ЗА ДОДАВАЊЕ (ADD) */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Country</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Country Name" variant="outlined" fullWidth
                            value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)}
                        />
                        <TextField
                            label="Continent" variant="outlined" fullWidth
                            value={newCountryContinent} onChange={(e) => setNewCountryContinent(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddSubmit} variant="contained" color="success">Save Country</Button>
                </DialogActions>
            </Dialog>

            {/* ДИАЛОГ ЗА ИЗМЕНА (EDIT) */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Country</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Country Name" variant="outlined" fullWidth
                            value={editingCountry?.name || ''}
                            onChange={(e) => setEditingCountry(prev => prev ? {...prev, name: e.target.value} : null)}
                        />
                        <TextField
                            label="Continent" variant="outlined" fullWidth
                            value={editingCountry?.continent || ''}
                            onChange={(e) => setEditingCountry(prev => prev ? {...prev, continent: e.target.value} : null)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEditDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">Update Country</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default CountriesPage;