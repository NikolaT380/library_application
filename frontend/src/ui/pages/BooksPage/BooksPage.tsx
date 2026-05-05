import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useBooks } from '../../../hooks/useBooks';

const BooksPage = () => {
    const { books, loading } = useBooks();

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4, fontWeight: 'bold' }}>                📖 Books Inventory
            </Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Available Copies</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>State</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book.id} hover>
                                <TableCell>{book.name}</TableCell>
                                <TableCell>{book.category}</TableCell>
                                <TableCell>{book.authorName}</TableCell>
                                <TableCell align="center">
                                    <Chip label={book.availableCopies} color={(book.availableCopies > 0 ? "success" : "error") as "success" | "error"} variant="outlined" />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip label={book.state} color={(book.state === 'GOOD' ? 'primary' : 'warning') as "primary" | "warning"} size="small" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BooksPage;