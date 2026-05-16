import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider,
    TextField, MenuItem, Pagination
} from '@mui/material';
import { useBooks } from '../../../hooks/useBooks';
import type { Book } from '../../../hooks/useBooks';
import { useAuthors } from '../../../hooks/useAuthors';
import { jwtDecode } from 'jwt-decode';

const CATEGORIES = ['NOVEL', 'THRILLER', 'HISTORY', 'FANTASY', 'BIOGRAPHY', 'CLASSICS', 'DRAMA'];

const BooksPage = () => {
    const { books, loading: loadingBooks, totalPages, fetchBooks, addBook, editBook, deleteBook, rentBook } = useBooks();
    const { authors, loading: loadingAuthors } = useAuthors();

    const [page, setPage] = useState<number>(1);
    const [filterName, setFilterName] = useState<string>('');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterAuthorId, setFilterAuthorId] = useState<number | ''>('');
    const [filterState, setFilterState] = useState<string>('');
    const [filterHasAvailable, setFilterHasAvailable] = useState<string>('');

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newAuthorId, setNewAuthorId] = useState<number | ''>('');
    const [newCopies, setNewCopies] = useState<number | ''>(1);

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const token = sessionStorage.getItem('jwt_token');
    let isAdmin = false;
    let isLoggedIn = false;
    if (token) {
        isLoggedIn = true;
        try {
            const decoded: any = jwtDecode(token);
            const role = decoded.role || decoded.authorities?.[0] || '';
            isAdmin = role.includes('ADMIN') || role.includes('ROLE_ADMIN');
        } catch (e) {
            console.error("Could not decode token for role check");
        }
    }

    const loadData = useCallback(() => {
        const params: any = {
            page: page - 1,
            size: 10
        };
        if (filterName) params.name = filterName;
        if (filterCategory) params.category = filterCategory;
        if (filterAuthorId !== '') params.authorId = filterAuthorId;
        if (filterState) params.state = filterState;
        if (filterHasAvailable === 'true') params.hasAvailable = true;
        if (filterHasAvailable === 'false') params.hasAvailable = false;

        void fetchBooks(params);
    }, [page, filterName, filterCategory, filterAuthorId, filterState, filterHasAvailable, fetchBooks]);

    useEffect(() => {
       void loadData();
    }, [loadData]);

    const handleClearFilters = () => {
        setFilterName('');
        setFilterCategory('');
        setFilterAuthorId('');
        setFilterState('');
        setFilterHasAvailable('');
        setPage(1);
    };

    const handleAddSubmit = async () => {
        if (!newName || !newCategory || newAuthorId === '' || newAuthorId === undefined || newCopies === '' || newCopies < 0) {
            alert("Ве молиме пополнете ги сите полиња правилно.");
            return;
        }
        const success = await addBook(newName, newCategory, Number(newAuthorId), Number(newCopies));
        if (success) {
            setOpenAddDialog(false);
            setNewName(''); setNewCategory(''); setNewAuthorId(''); setNewCopies(1);
            loadData();
        } else {
            alert("Грешка при додавање!");
        }
    };

    const handleEditSubmit = async () => {
        if (!editingBook || !editingBook.name || !editingBook.category || editingBook.authorId === undefined || editingBook.availableCopies < 0) return;

        const success = await editBook(
            editingBook.id, editingBook.name, editingBook.category,
            Number(editingBook.authorId), Number(editingBook.availableCopies), editingBook.state
        );

        if (success) {
            setOpenEditDialog(false);
            setEditingBook(null);
            setSelectedBook(null);
            loadData();
        } else {
            alert("Грешка при измена!");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Дали сте сигурни дека сакате да ја избришете оваа книга?")) {
            const success = await deleteBook(id);
            if (success) {
                setSelectedBook(null);
                loadData();
            } else {
                alert("Грешка при бришење! (Напомена: Книгата може да се избрише само ако нејзината состојба е BAD)");
            }
        }
    };

    const handleRent = async (id: number, availableCopies: number, state?: string) => {
        if (availableCopies <= 0 || (state !== 'GOOD' && state !== undefined)) return;

        const success = await rentBook(id);
        if (success) {
            alert("Успешно изнајмена книга!");
            setSelectedBook(null);
            loadData();
        } else {
            alert("Грешка при изнајмување.");
        }
    };

    if (loadingAuthors && !books.length) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    📖 Books Inventory
                </Typography>
                {isAdmin && (
                    <Button variant="contained" color="success" onClick={() => setOpenAddDialog(true)}>
                        + Add New Book
                    </Button>
                )}
            </Box>

            {/* ФИЛТРИ СО SEARCH BAR */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={2}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>

                    {/* НОВО: SEARCH BAR ПО НАСЛОВ */}
                    <TextField
                        sx={{ minWidth: 200, flex: 2 }}
                        label="Search by Book Title..."
                        variant="outlined"
                        value={filterName}
                        onChange={(e) => {setFilterName(e.target.value); setPage(1);}}
                        size="small"
                    />

                    <TextField sx={{ minWidth: 150, flex: 1 }} select label="Category" value={filterCategory} onChange={(e) => {setFilterCategory(e.target.value); setPage(1);}} size="small">
                        <MenuItem value=""><em>All Categories</em></MenuItem>
                        {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                    </TextField>

                    <TextField sx={{ minWidth: 150, flex: 1 }} select label="Author" value={filterAuthorId} onChange={(e) => {setFilterAuthorId(e.target.value === '' ? '' : Number(e.target.value)); setPage(1);}} size="small">
                        <MenuItem value=""><em>All Authors</em></MenuItem>
                        {authors.map(author => <MenuItem key={author.id} value={author.id}>{author.name} {author.surname}</MenuItem>)}
                    </TextField>

                    <TextField sx={{ minWidth: 150, flex: 1 }} select label="State" value={filterState} onChange={(e) => {setFilterState(e.target.value); setPage(1);}} size="small">
                        <MenuItem value=""><em>All States</em></MenuItem>
                        <MenuItem value="GOOD">GOOD</MenuItem>
                        <MenuItem value="BAD">BAD</MenuItem>
                    </TextField>

                    <TextField sx={{ minWidth: 150, flex: 1 }} select label="Availability" value={filterHasAvailable} onChange={(e) => {setFilterHasAvailable(e.target.value); setPage(1);}} size="small">
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="true">Available</MenuItem>
                        <MenuItem value="false">Out of Stock</MenuItem>
                    </TextField>

                    <Button variant="outlined" color="secondary" sx={{ minWidth: 120, height: '40px' }} onClick={handleClearFilters}>
                        Clear Filters
                    </Button>
                </Box>
            </Paper>

            {loadingBooks ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
            ) : (
                <>
                    <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Copies</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>State</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {books.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">No books found.</TableCell>
                                    </TableRow>
                                ) : (
                                    books.map((book) => (
                                        <TableRow key={book.id} hover onClick={() => setSelectedBook(book)} sx={{ cursor: 'pointer' }}>
                                            <TableCell>{book.name}</TableCell>
                                            <TableCell>{book.category}</TableCell>
                                            <TableCell>{book.authorName}</TableCell>
                                            <TableCell align="center">
                                                <Chip label={book.availableCopies} color={(book.availableCopies > 0 ? "success" : "error") as "success" | "error"} variant="outlined" />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip label={book.state || 'GOOD'} color={(book.state === 'GOOD' || !book.state ? 'primary' : 'warning') as "primary" | "warning"} size="small" />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ПАГИНАЦИЈА */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}

            {/* ДИАЛОГ ЗА ДЕТАЛИ И АКЦИИ */}
            <Dialog open={selectedBook !== null} onClose={() => setSelectedBook(null)} maxWidth="sm" fullWidth>
                {selectedBook && (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>📖 {selectedBook.name}</DialogTitle>
                        <Divider />
                        <DialogContent sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Author:</Typography><Typography sx={{ fontWeight: 'bold' }}>{selectedBook.authorName}</Typography></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Category:</Typography><Chip label={selectedBook.category} color="primary" size="small" /></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography color="text.secondary">State:</Typography><Chip label={selectedBook.state || 'GOOD'} color={(selectedBook.state === 'GOOD' || !selectedBook.state ? 'success' : 'warning') as "success" | "warning"} size="small" /></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography color="text.secondary">Available Copies:</Typography><Chip label={selectedBook.availableCopies} color={(selectedBook.availableCopies > 0 ? 'success' : 'error') as "success" | "error"} variant="outlined" /></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography color="text.secondary">Availability:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', color: (selectedBook.availableCopies > 0 && (selectedBook.state === 'GOOD' || !selectedBook.state)) ? 'green' : 'red' }}>
                                        {(selectedBook.availableCopies > 0 && (selectedBook.state === 'GOOD' || !selectedBook.state)) ? '✅ Available' : '❌ Not available'}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                {isLoggedIn && (
                                    <Button variant="contained" color="info" size="small" sx={{ mr: 1 }} disabled={selectedBook.availableCopies <= 0 || (selectedBook.state !== 'GOOD' && selectedBook.state !== undefined)} onClick={() => handleRent(selectedBook.id, selectedBook.availableCopies, selectedBook.state)}>Rent Book</Button>
                                )}
                                {isAdmin && (
                                    <>
                                        <Button variant="outlined" color="primary" size="small" sx={{ mr: 1 }} onClick={() => { setEditingBook(selectedBook); setOpenEditDialog(true); }}>Edit</Button>
                                        <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(selectedBook.id)}>Delete</Button>
                                    </>
                                )}
                            </Box>
                            <Button onClick={() => setSelectedBook(null)} variant="outlined" color="inherit">Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* ДИАЛОГ ЗА ДОДАВАЊЕ */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField label="Title" variant="outlined" fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} />
                        <TextField select label="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} fullWidth>{CATEGORIES.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}</TextField>
                        <TextField select label="Author" value={newAuthorId} onChange={(e) => setNewAuthorId(e.target.value === '' ? '' : Number(e.target.value))} fullWidth>{authors.map((author) => (<MenuItem key={author.id} value={author.id}>{author.name} {author.surname}</MenuItem>))}</TextField>
                        <TextField label="Available Copies" type="number" variant="outlined" fullWidth value={newCopies} onChange={(e) => setNewCopies(e.target.value === '' ? '' : Number(e.target.value))} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddSubmit} variant="contained" color="success">Save Book</Button>
                </DialogActions>
            </Dialog>

            {/* ДИАЛОГ ЗА ИЗМЕНА */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField label="Title" variant="outlined" fullWidth value={editingBook?.name || ''} onChange={(e) => setEditingBook(prev => prev ? {...prev, name: e.target.value} : null)} />
                        <TextField select label="Category" value={editingBook?.category || ''} onChange={(e) => setEditingBook(prev => prev ? {...prev, category: e.target.value} : null)} fullWidth>{CATEGORIES.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}</TextField>
                        <TextField select label="Author" value={editingBook?.authorId || ''} onChange={(e) => setEditingBook(prev => prev ? {...prev, authorId: Number(e.target.value)} : null)} fullWidth>{authors.map((author) => (<MenuItem key={author.id} value={author.id}>{author.name} {author.surname}</MenuItem>))}</TextField>
                        <TextField select label="State" value={editingBook?.state || 'GOOD'} onChange={(e) => setEditingBook(prev => prev ? {...prev, state: e.target.value} : null)} fullWidth>
                            <MenuItem value="GOOD">GOOD</MenuItem>
                            <MenuItem value="BAD">BAD</MenuItem>
                        </TextField>
                        <TextField label="Available Copies" type="number" variant="outlined" fullWidth value={editingBook?.availableCopies !== undefined ? editingBook.availableCopies : ''} onChange={(e) => setEditingBook(prev => prev ? {...prev, availableCopies: e.target.value === '' ? 0 : Number(e.target.value)} : null)} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEditDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">Update Book</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BooksPage;