import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    TextField,
    MenuItem,
    Pagination,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Collapse,
    Tooltip
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { useBooks } from '../../../hooks/useBooks';
import type { Book } from '../../../hooks/useBooks';
import { useAuthors } from '../../../hooks/useAuthors';
import { jwtDecode } from 'jwt-decode';
import { useBooksViewPreference } from '../../../hooks/useBooksViewPreference';

const CATEGORIES = ['NOVEL', 'THRILLER', 'HISTORY', 'FANTASY', 'BIOGRAPHY', 'CLASSICS', 'DRAMA'];

const BooksPage = () => {
    const { books, loading: loadingBooks, totalPages, fetchBooks, addBook, editBook, deleteBook, rentBook } = useBooks();
    const { authors, loading: loadingAuthors } = useAuthors();
    const { viewMode, loadingPreference, fetchViewMode, updateViewMode } = useBooksViewPreference();

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

    const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
    const [lockedExpandedCardId, setLockedExpandedCardId] = useState<number | null>(null);

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
            console.error('Could not decode token for role check');
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

    useEffect(() => {
        if (isLoggedIn) {
            void fetchViewMode();
        }
    }, [isLoggedIn, fetchViewMode]);

    const handleClearFilters = () => {
        setFilterName('');
        setFilterCategory('');
        setFilterAuthorId('');
        setFilterState('');
        setFilterHasAvailable('');
        setPage(1);
    };

    const handleViewChange = async (
        _: React.MouseEvent<HTMLElement>,
        nextView: 'ROW' | 'CARD' | null
    ) => {
        if (!nextView) return;
        await updateViewMode(nextView);
    };

    const handleAddSubmit = async () => {
        if (!newName || !newCategory || newAuthorId === '' || newAuthorId === undefined || newCopies === '' || newCopies < 0) {
            alert('Ве молиме пополнете ги сите полиња правилно.');
            return;
        }

        const success = await addBook(newName, newCategory, Number(newAuthorId), Number(newCopies));
        if (success) {
            setOpenAddDialog(false);
            setNewName('');
            setNewCategory('');
            setNewAuthorId('');
            setNewCopies(1);
            loadData();
        } else {
            alert('Грешка при додавање!');
        }
    };

    const handleEditSubmit = async () => {
        if (!editingBook || !editingBook.name || !editingBook.category || editingBook.authorId === undefined || editingBook.availableCopies < 0) {
            return;
        }

        const success = await editBook(
            editingBook.id,
            editingBook.name,
            editingBook.category,
            Number(editingBook.authorId),
            Number(editingBook.availableCopies),
            editingBook.state
        );

        if (success) {
            setOpenEditDialog(false);
            setEditingBook(null);
            setSelectedBook(null);
            loadData();
        } else {
            alert('Грешка при измена!');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Дали сте сигурни дека сакате да ја избришете оваа книга?')) {
            const success = await deleteBook(id);
            if (success) {
                setSelectedBook(null);
                loadData();
            } else {
                alert('Грешка при бришење! (Напомена: Книгата може да се избрише само ако нејзината состојба е BAD)');
            }
        }
    };

    const handleRent = async (id: number, availableCopies: number, state?: string) => {
        if (availableCopies <= 0 || (state !== 'GOOD' && state !== undefined)) return;

        const success = await rentBook(id);
        if (success) {
            alert('Успешно изнајмена книга!');
            setSelectedBook(null);
            loadData();
        } else {
            alert('Грешка при изнајмување.');
        }
    };

    const isBookAvailable = (book: Book) =>
        book.availableCopies > 0 && (book.state === 'GOOD' || !book.state);

    const isCardExpanded = (bookId: number) =>
        hoveredCardId === bookId || lockedExpandedCardId === bookId;

    const toggleExpandedCard = (bookId: number) => {
        setLockedExpandedCardId((prev) => (prev === bookId ? null : bookId));
    };

    if ((loadingAuthors && !books.length) || (isLoggedIn && loadingPreference)) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    📖 Books Inventory
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Choose books display mode">
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={handleViewChange}
                            size="small"
                            color="primary"
                        >
                            <ToggleButton value="ROW">
                                <ViewListIcon sx={{ mr: 1 }} />
                                Row
                            </ToggleButton>
                            <ToggleButton value="CARD">
                                <ViewModuleIcon sx={{ mr: 1 }} />
                                Card
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Tooltip>

                    {isAdmin && (
                        <Button variant="contained" color="success" onClick={() => setOpenAddDialog(true)}>
                            + Add New Book
                        </Button>
                    )}
                </Box>
            </Box>

            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={2}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <TextField
                        sx={{ minWidth: 200, flex: 2 }}
                        label="Search by Book Title..."
                        variant="outlined"
                        value={filterName}
                        onChange={(e) => {
                            setFilterName(e.target.value);
                            setPage(1);
                        }}
                        size="small"
                    />

                    <TextField
                        sx={{ minWidth: 150, flex: 1 }}
                        select
                        label="Category"
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value);
                            setPage(1);
                        }}
                        size="small"
                    >
                        <MenuItem value=""><em>All Categories</em></MenuItem>
                        {CATEGORIES.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        sx={{ minWidth: 150, flex: 1 }}
                        select
                        label="Author"
                        value={filterAuthorId}
                        onChange={(e) => {
                            setFilterAuthorId(e.target.value === '' ? '' : Number(e.target.value));
                            setPage(1);
                        }}
                        size="small"
                    >
                        <MenuItem value=""><em>All Authors</em></MenuItem>
                        {authors.map((author) => (
                            <MenuItem key={author.id} value={author.id}>
                                {author.name} {author.surname}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        sx={{ minWidth: 150, flex: 1 }}
                        select
                        label="State"
                        value={filterState}
                        onChange={(e) => {
                            setFilterState(e.target.value);
                            setPage(1);
                        }}
                        size="small"
                    >
                        <MenuItem value=""><em>All States</em></MenuItem>
                        <MenuItem value="GOOD">GOOD</MenuItem>
                        <MenuItem value="BAD">BAD</MenuItem>
                    </TextField>

                    <TextField
                        sx={{ minWidth: 150, flex: 1 }}
                        select
                        label="Availability"
                        value={filterHasAvailable}
                        onChange={(e) => {
                            setFilterHasAvailable(e.target.value);
                            setPage(1);
                        }}
                        size="small"
                    >
                        <MenuItem value=""><em>All</em></MenuItem>
                        <MenuItem value="true">Available</MenuItem>
                        <MenuItem value="false">Out of Stock</MenuItem>
                    </TextField>

                    <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ minWidth: 120, height: '40px' }}
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                </Box>
            </Paper>

            {loadingBooks ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {viewMode === 'ROW' ? (
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfd 100%)',
                                border: '1px solid rgba(25, 118, 210, 0.12)',
                                overflow: 'hidden'
                            }}
                        >
                            <Table
                                sx={{
                                    borderCollapse: 'separate',
                                    borderSpacing: '0 10px',
                                    px: 1,
                                    '& .MuiTableCell-root': {
                                        borderBottom: 'none'
                                    }
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: 'rgba(25, 118, 210, 0.88)',
                                                fontSize: '0.92rem',
                                                pl: 3
                                            }}
                                        >
                                            Name
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: 'rgba(25, 118, 210, 0.88)',
                                                fontSize: '0.92rem'
                                            }}
                                        >
                                            Category
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                color: 'rgba(25, 118, 210, 0.88)',
                                                fontSize: '0.92rem'
                                            }}
                                        >
                                            Author
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'rgba(25, 118, 210, 0.88)',
                                                fontSize: '0.92rem'
                                            }}
                                        >
                                            Copies
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontWeight: 800,
                                                color: 'rgba(25, 118, 210, 0.88)',
                                                fontSize: '0.92rem',
                                                pr: 3
                                            }}
                                        >
                                            State
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {books.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                                No books found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        books.map((book) => (
                                            <TableRow
                                                key={book.id}
                                                hover
                                                onClick={() => setSelectedBook(book)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '& td': {
                                                        bgcolor: '#ffffff',
                                                        transition: 'all 0.22s ease',
                                                        borderTop: '1px solid rgba(25, 118, 210, 0.10)',
                                                        borderBottom: '1px solid rgba(25, 118, 210, 0.10)'
                                                    },
                                                    '& td:first-of-type': {
                                                        borderTopLeftRadius: 14,
                                                        borderBottomLeftRadius: 14,
                                                        borderLeft: '1px solid rgba(25, 118, 210, 0.10)',
                                                        pl: 3
                                                    },
                                                    '& td:last-of-type': {
                                                        borderTopRightRadius: 14,
                                                        borderBottomRightRadius: 14,
                                                        borderRight: '1px solid rgba(25, 118, 210, 0.10)',
                                                        pr: 3
                                                    },
                                                    '&:hover td': {
                                                        bgcolor: '#eef6ff',
                                                        borderTop: '1px solid rgba(25, 118, 210, 0.18)',
                                                        borderBottom: '1px solid rgba(25, 118, 210, 0.18)'
                                                    },
                                                    '&:hover td:first-of-type': {
                                                        borderLeft: '1px solid rgba(25, 118, 210, 0.18)'
                                                    },
                                                    '&:hover td:last-of-type': {
                                                        borderRight: '1px solid rgba(25, 118, 210, 0.18)'
                                                    },
                                                    '&:hover': {
                                                        filter: 'drop-shadow(0 10px 18px rgba(25,118,210,0.12))'
                                                    }
                                                }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                                        <Box
                                                            sx={{
                                                                width: 34,
                                                                height: 34,
                                                                minWidth: 34,
                                                                borderRadius: '10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: 'rgba(25, 118, 210, 0.10)',
                                                                color: 'primary.main'
                                                            }}
                                                        >
                                                            <MenuBookRoundedIcon sx={{ fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontWeight: 700 }}>
                                                            {book.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={book.category}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                                        <BorderColorRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                                                        <Typography>{book.authorName}</Typography>
                                                    </Box>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Chip
                                                        label={book.availableCopies}
                                                        color={(book.availableCopies > 0 ? 'success' : 'error') as 'success' | 'error'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Chip
                                                        label={book.state || 'GOOD'}
                                                        color={(book.state === 'GOOD' || !book.state ? 'primary' : 'warning') as 'primary' | 'warning'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    lg: 'repeat(3, minmax(0, 1fr))'
                                },
                                gap: 2,
                                alignItems: 'start'
                            }}
                        >
                            {books.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                                    <Typography>No books found.</Typography>
                                </Paper>
                            ) : (
                                books.map((book) => {
                                    const expanded = isCardExpanded(book.id);
                                    const hovered = hoveredCardId === book.id;

                                    return (
                                        <Box
                                            key={book.id}
                                            sx={{
                                                alignSelf: 'start',
                                                minHeight: 0
                                            }}
                                        >
                                            <Paper
                                                elevation={0}
                                                onMouseEnter={() => setHoveredCardId(book.id)}
                                                onMouseLeave={() => {
                                                    setHoveredCardId((prev) => (prev === book.id ? null : prev));
                                                }}
                                                sx={{
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    border: '1px solid',
                                                    borderColor: hovered || expanded ? 'primary.light' : 'rgba(0,0,0,0.08)',
                                                    background: hovered || expanded
                                                        ? 'linear-gradient(135deg, #ffffff 0%, #f5faff 100%)'
                                                        : 'linear-gradient(135deg, #ffffff 0%, #fbfbfb 100%)',
                                                    boxShadow: hovered || expanded
                                                        ? '0 12px 30px rgba(25, 118, 210, 0.14)'
                                                        : '0 6px 18px rgba(0,0,0,0.06)',
                                                    transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
                                                    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease'
                                                }}
                                            >
                                                <Box
                                                    onClick={() => setSelectedBook(book)}
                                                    sx={{
                                                        p: 2.25,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1.5
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                                                        <Box sx={{ display: 'flex', gap: 1.3, alignItems: 'flex-start', minWidth: 0 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 38,
                                                                    height: 38,
                                                                    minWidth: 38,
                                                                    borderRadius: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                                    color: 'primary.main',
                                                                    transition: 'all 220ms ease',
                                                                    transform: hovered ? 'scale(1.05)' : 'scale(1)'
                                                                }}
                                                            >
                                                                <MenuBookRoundedIcon fontSize="small" />
                                                            </Box>

                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography
                                                                    variant="h6"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        lineHeight: 1.2,
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        wordBreak: 'break-word'
                                                                    }}
                                                                >
                                                                    {book.name}
                                                                </Typography>

                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 0.7,
                                                                        mt: 0.8,
                                                                        color: 'text.secondary'
                                                                    }}
                                                                >
                                                                    <BorderColorRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            lineHeight: 1.2,
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: 1,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            overflow: 'hidden'
                                                                        }}
                                                                    >
                                                                        {book.authorName}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        <Tooltip title={lockedExpandedCardId === book.id ? 'Collapse' : 'Expand'}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpandedCard(book.id);
                                                                }}
                                                                sx={{
                                                                    width: 38,
                                                                    height: 38,
                                                                    minWidth: 38,
                                                                    border: '1px solid',
                                                                    borderColor: expanded ? 'primary.main' : 'rgba(0,0,0,0.08)',
                                                                    bgcolor: expanded ? 'rgba(25,118,210,0.08)' : 'rgba(255,255,255,0.8)',
                                                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                    transition: 'all 220ms ease',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(25,118,210,0.12)',
                                                                        borderColor: 'primary.main'
                                                                    }
                                                                }}
                                                            >
                                                                <KeyboardArrowDownRoundedIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        <Chip label={book.category} size="small" color="primary" variant="outlined" />
                                                        <Chip
                                                            label={book.state || 'GOOD'}
                                                            size="small"
                                                            color={(book.state === 'GOOD' || !book.state ? 'success' : 'warning') as 'success' | 'warning'}
                                                        />
                                                        <Chip
                                                            label={`${book.availableCopies} copies`}
                                                            size="small"
                                                            color={(book.availableCopies > 0 ? 'success' : 'error') as 'success' | 'error'}
                                                            variant="outlined"
                                                        />
                                                    </Box>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: isBookAvailable(book) ? 'success.main' : 'error.main'
                                                        }}
                                                    >
                                                        {isBookAvailable(book) ? '✅ Available now' : '❌ Currently unavailable'}
                                                    </Typography>
                                                </Box>

                                                <Collapse
                                                    in={expanded}
                                                    timeout={260}
                                                    collapsedSize={0}
                                                    unmountOnExit
                                                >
                                                    <Box
                                                        sx={{
                                                            px: 2.25,
                                                            pb: 2.25,
                                                            pt: 0.8,
                                                            background: 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(245,247,250,1) 100%)',
                                                            borderTop: '1px solid',
                                                            borderColor: 'rgba(0,0,0,0.06)'
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                            {isLoggedIn && (
                                                                <Button
                                                                    variant="contained"
                                                                    color="info"
                                                                    size="small"
                                                                    disabled={!isBookAvailable(book)}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        void handleRent(book.id, book.availableCopies, book.state);
                                                                    }}
                                                                >
                                                                    Rent Book
                                                                </Button>
                                                            )}

                                                            {isAdmin && (
                                                                <>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="primary"
                                                                        size="small"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingBook(book);
                                                                            setOpenEditDialog(true);
                                                                        }}
                                                                    >
                                                                        Edit
                                                                    </Button>

                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        size="small"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            void handleDelete(book.id);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </>
                                                            )}

                                                            <Button
                                                                variant="text"
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedBook(book);
                                                                }}
                                                            >
                                                                Open Details
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                            </Paper>
                                        </Box>
                                    );
                                })
                            )}
                        </Box>
                    )}

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

            <Dialog open={selectedBook !== null} onClose={() => setSelectedBook(null)} maxWidth="sm" fullWidth>
                {selectedBook && (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>
                            📖 {selectedBook.name}
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Author:</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>{selectedBook.authorName}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography color="text.secondary">Category:</Typography>
                                    <Chip label={selectedBook.category} color="primary" size="small" />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography color="text.secondary">State:</Typography>
                                    <Chip
                                        label={selectedBook.state || 'GOOD'}
                                        color={(selectedBook.state === 'GOOD' || !selectedBook.state ? 'success' : 'warning') as 'success' | 'warning'}
                                        size="small"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography color="text.secondary">Available Copies:</Typography>
                                    <Chip
                                        label={selectedBook.availableCopies}
                                        color={(selectedBook.availableCopies > 0 ? 'success' : 'error') as 'success' | 'error'}
                                        variant="outlined"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography color="text.secondary">Availability:</Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            color: isBookAvailable(selectedBook) ? 'green' : 'red'
                                        }}
                                    >
                                        {isBookAvailable(selectedBook) ? '✅ Available' : '❌ Not available'}
                                    </Typography>
                                </Box>
                            </Box>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                {isLoggedIn && (
                                    <Button
                                        variant="contained"
                                        color="info"
                                        size="small"
                                        sx={{ mr: 1 }}
                                        disabled={!isBookAvailable(selectedBook)}
                                        onClick={() => handleRent(selectedBook.id, selectedBook.availableCopies, selectedBook.state)}
                                    >
                                        Rent Book
                                    </Button>
                                )}

                                {isAdmin && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            onClick={() => {
                                                setEditingBook(selectedBook);
                                                setOpenEditDialog(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(selectedBook.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </Box>

                            <Button onClick={() => setSelectedBook(null)} variant="outlined" color="inherit">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <TextField
                            select
                            label="Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            fullWidth
                        >
                            {CATEGORIES.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Author"
                            value={newAuthorId}
                            onChange={(e) => setNewAuthorId(e.target.value === '' ? '' : Number(e.target.value))}
                            fullWidth
                        >
                            {authors.map((author) => (
                                <MenuItem key={author.id} value={author.id}>{author.name} {author.surname}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Available Copies"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={newCopies}
                            onChange={(e) => setNewCopies(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenAddDialog(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleAddSubmit} variant="contained" color="success">Save Book</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Book</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            value={editingBook?.name || ''}
                            onChange={(e) => setEditingBook((prev) => prev ? { ...prev, name: e.target.value } : null)}
                        />
                        <TextField
                            select
                            label="Category"
                            value={editingBook?.category || ''}
                            onChange={(e) => setEditingBook((prev) => prev ? { ...prev, category: e.target.value } : null)}
                            fullWidth
                        >
                            {CATEGORIES.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Author"
                            value={editingBook?.authorId || ''}
                            onChange={(e) => setEditingBook((prev) => prev ? { ...prev, authorId: Number(e.target.value) } : null)}
                            fullWidth
                        >
                            {authors.map((author) => (
                                <MenuItem key={author.id} value={author.id}>{author.name} {author.surname}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="State"
                            value={editingBook?.state || 'GOOD'}
                            onChange={(e) => setEditingBook((prev) => prev ? { ...prev, state: e.target.value } : null)}
                            fullWidth
                        >
                            <MenuItem value="GOOD">GOOD</MenuItem>
                            <MenuItem value="BAD">BAD</MenuItem>
                        </TextField>
                        <TextField
                            label="Available Copies"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={editingBook?.availableCopies !== undefined ? editingBook.availableCopies : ''}
                            onChange={(e) =>
                                setEditingBook((prev) =>
                                    prev ? { ...prev, availableCopies: e.target.value === '' ? 0 : Number(e.target.value) } : null
                                )
                            }
                        />
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