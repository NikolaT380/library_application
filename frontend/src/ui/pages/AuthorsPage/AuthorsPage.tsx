import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuthors } from '../../../hooks/useAuthors';

const AuthorsPage = () => {
    const { authors, loading } = useAuthors();

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                ✍️ Authors
            </Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Country</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map((author) => (
                            <TableRow key={author.id} hover>
                                <TableCell>{author.id}</TableCell>
                                <TableCell>{author.name}</TableCell>
                                <TableCell>{author.surname}</TableCell>
                                <TableCell>{author.country?.name || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AuthorsPage;