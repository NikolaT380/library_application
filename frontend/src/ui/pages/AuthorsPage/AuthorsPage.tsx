import { useState } from 'react';
import {
    Box, Typography, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { useAuthors } from '../../../hooks/useAuthors';
import { useCountries } from '../../../hooks/useCountries';
import { jwtDecode } from 'jwt-decode';
import type { Author } from '../../../api/types/author';

const AuthorsPage = () => {
    const { authors, loading: loadingAuthors, addAuthor, editAuthor, deleteAuthor } = useAuthors();
    const { countries, loading: loadingCountries } = useCountries();

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newName, setNewName] = useState('');
    const [newSurname, setNewSurname] = useState('');
    const [newCountryId, setNewCountryId] = useState<number | ''>('');

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState<{id: number, name: string, surname: string, countryId: number | ''} | null>(null);

    const token = localStorage.getItem('jwt_token');
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
        if (!newName || !newSurname || newCountryId === '') return;
        const success = await addAuthor(newName, newSurname, newCountryId as number);
        if (success) {
            setOpenAddDialog(false);
            setNewName('');
            setNewSurname('');
            setNewCountryId('');
        } else {
            alert("Грешка при додавање!");
        }
    };

    const openEditModal = (author: Author) => {
        setEditingAuthor({
            id: author.id,
            name: author.name,
            surname: author.surname,
            countryId: author.country ? author.country.id : ''
        });
        setOpenEditDialog(true);
    };

    const handleEditSubmit = async () => {
        if (!editingAuthor || !editingAuthor.name || !editingAuthor.surname || editingAuthor.countryId === '') return;
        const success = await editAuthor(editingAuthor.id, editingAuthor.name, editingAuthor.surname, editingAuthor.countryId as number);
        if (success) {
            setOpenEditDialog(false);
            setEditingAuthor(null);
        } else {
            alert("Грешка при измена!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Дали сте сигурни дека сакате да го избришете овој автор?")) {
            await deleteAuthor(id);
        }
    };

    if (loadingAuthors || loadingCountries) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    ✍️ Authors
                </Typography>

                {isAdmin && (
                    <Button variant="contained" color="success" onClick={() => setOpenAddDialog(true)}>
                        + Add New Author
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Country</TableCell>
                            {isAdmin && <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map((author) => (
                            <TableRow key={author.id} hover>
                                <TableCell>{author.id}</TableCell>
                                <TableCell>{author.name}</TableCell>
                                <TableCell>{author.surname}</TableCell>
                                <TableCell>{author.country?.name || 'N/A'}</TableCell>

                                {isAdmin && (
                                    <TableCell align="right">
                                        <Button variant="outlined" color="primary" size="small" sx={{ mr: 1 }} onClick={() => openEditModal(author)}>
                                            Edit
                                        </Button>
                                        <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(author.id)}>
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
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Author</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="First Name" variant="outlined" fullWidth
                            value={newName} onChange={(e) => setNewName(e.target.value)}
                        />
                        <TextField
                            label="Last Name" variant="outlined" fullWidth
                            value={newSurname} onChange={(e) => setNewSurname(e.target.value)}
                        />
                        <TextField
                            select
                            label="Country"
                            value={newCountryId}
                            onChange={(e) => setNewCountryId(Number(e.target.value))}
                            fullWidth
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddSubmit} variant="contained" color="success">Save Author</Button>
                </DialogActions>
            </Dialog>

            {/* ДИАЛОГ ЗА ИЗМЕНА (EDIT) */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Author</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="First Name" variant="outlined" fullWidth
                            value={editingAuthor?.name || ''}
                            onChange={(e) => setEditingAuthor(prev => prev ? {...prev, name: e.target.value} : null)}
                        />
                        <TextField
                            label="Last Name" variant="outlined" fullWidth
                            value={editingAuthor?.surname || ''}
                            onChange={(e) => setEditingAuthor(prev => prev ? {...prev, surname: e.target.value} : null)}
                        />
                        <TextField
                            select
                            label="Country"
                            value={editingAuthor?.countryId || ''}
                            onChange={(e) => setEditingAuthor(prev => prev ? {...prev, countryId: Number(e.target.value)} : null)}
                            fullWidth
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEditDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">Update Author</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default AuthorsPage;