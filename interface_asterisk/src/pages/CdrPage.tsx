import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Box, Chip, Button, TextField, MenuItem, Select, 
  FormControl, InputLabel, TablePagination, Collapse 
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CdrPage() {
  const [cdrs, setCdrs] = useState<any[]>([]);
  const [filteredCdrs, setFilteredCdrs] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  
  // États des filtres
  const [filters, setFilters] = useState({
    src: '',
    dst: '',
    disposition: 'all',
    dateStart: '',
    dateEnd: '',
    minDuration: '',
  });

  useEffect(() => {
    loadCdrs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cdrs, filters]);

  const loadCdrs = async () => {
    try {
      const res = await api.get('/cdr?limit=1000');
      setCdrs(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    let filtered = [...cdrs];

    // Filtre par source
    if (filters.src) {
      filtered = filtered.filter(cdr => 
        cdr.src?.toLowerCase().includes(filters.src.toLowerCase())
      );
    }

    // Filtre par destination
    if (filters.dst) {
      filtered = filtered.filter(cdr => 
        cdr.dst?.toLowerCase().includes(filters.dst.toLowerCase())
      );
    }

    // Filtre par disposition
    if (filters.disposition !== 'all') {
      filtered = filtered.filter(cdr => cdr.disposition === filters.disposition);
    }

    // Filtre par date de début
    if (filters.dateStart) {
      const startDate = new Date(filters.dateStart);
      filtered = filtered.filter(cdr => new Date(cdr.start) >= startDate);
    }

    // Filtre par date de fin
    if (filters.dateEnd) {
      const endDate = new Date(filters.dateEnd);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(cdr => new Date(cdr.start) <= endDate);
    }

    // Filtre par durée minimale
    if (filters.minDuration) {
      const minDur = parseInt(filters.minDuration);
      filtered = filtered.filter(cdr => cdr.billsec >= minDur);
    }

    setFilteredCdrs(filtered);
    setPage(0);
  };

  const resetFilters = () => {
    setFilters({
      src: '',
      dst: '',
      disposition: 'all',
      dateStart: '',
      dateEnd: '',
      minDuration: '',
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Source', 'Destination', 'Durée (s)', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredCdrs.map(row => [
        new Date(row.start).toLocaleString(),
        row.src,
        row.dst,
        row.billsec,
        row.disposition
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cdr_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const displayedCdrs = filteredCdrs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== '' && v !== 'all'
  ).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="large" /> Historique des Appels
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => setShowFilters(!showFilters)}
            sx={{ position: 'relative' }}
            startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showFilters ? 'Masquer Filtres' : 'Afficher Filtres'}
            {activeFiltersCount > 0 && (
              <Chip 
                label={activeFiltersCount} 
                size="small" 
                color="primary" 
                sx={{ position: 'absolute', top: -8, right: -8, minWidth: 20, height: 20 }}
              />
            )}
          </Button>
          <Button variant="outlined" onClick={loadCdrs} startIcon={<RefreshIcon />}>
            Actualiser
          </Button>
          <Button variant="contained" onClick={exportToCSV} startIcon={<FileDownloadIcon />}>
            Exporter CSV
          </Button>
        </Box>
      </Box>

      {/* Panneau de Filtres */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f7fa' }}>
          <Typography variant="h6" mb={2} fontWeight={600}>
            🔍 Filtres Avancés
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Source (Appelant)"
                value={filters.src}
                onChange={(e) => setFilters({ ...filters, src: e.target.value })}
                placeholder="Ex: 101"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Destination"
                value={filters.dst}
                onChange={(e) => setFilters({ ...filters, dst: e.target.value })}
                placeholder="Ex: 102"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={filters.disposition}
                  onChange={(e) => setFilters({ ...filters, disposition: e.target.value })}
                  label="Statut"
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="ANSWERED">Répondu</MenuItem>
                  <MenuItem value="NO ANSWER">Sans réponse</MenuItem>
                  <MenuItem value="BUSY">Occupé</MenuItem>
                  <MenuItem value="FAILED">Échoué</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Date Début"
                type="date"
                value={filters.dateStart}
                onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Date Fin"
                type="date"
                value={filters.dateEnd}
                onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label="Durée Min (s)"
                type="number"
                value={filters.minDuration}
                onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
                placeholder="Ex: 30"
                size="small"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {filteredCdrs.length} résultat{filteredCdrs.length > 1 ? 's' : ''} trouvé{filteredCdrs.length > 1 ? 's' : ''}
            </Typography>
          </Box>
        </Paper>
      </Collapse>

      {/* Tableau */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa' }}>
              <TableCell><strong>Date & Heure</strong></TableCell>
              <TableCell><strong>Source</strong></TableCell>
              <TableCell><strong>→</strong></TableCell>
              <TableCell><strong>Destination</strong></TableCell>
              <TableCell align="center"><strong>Durée</strong></TableCell>
              <TableCell align="center"><strong>Statut</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCdrs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Aucun appel trouvé avec ces critères
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedCdrs.map((row) => (
                <TableRow 
                  key={row.uniqueid}
                  sx={{ 
                    '&:hover': { bgcolor: '#f5f7fa' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date(row.start).toLocaleDateString('fr-FR')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(row.start).toLocaleTimeString('fr-FR')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.src} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">➡️</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.dst} 
                      size="small" 
                      variant="outlined" 
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={500}>
                      {Math.floor(row.billsec / 60)}:{String(row.billsec % 60).padStart(2, '0')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({row.billsec}s)
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.disposition} 
                      color={row.disposition === 'ANSWERED' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredCdrs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </TableContainer>
    </Box>
  );
}