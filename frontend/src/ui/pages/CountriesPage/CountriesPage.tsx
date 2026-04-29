import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useCountries } from '../../../hooks/useCountries';

const CountriesPage = () => {
    const { countries, loading } = useCountries();

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                🌍 Countries
            </Typography>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Country Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Continent</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {countries.map((country) => (
                            <TableRow key={country.id} hover>
                                <TableCell>{country.id}</TableCell>
                                <TableCell>{country.name}</TableCell>
                                <TableCell>
                                    <Chip label={country.continent} size="small" variant="outlined" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CountriesPage;