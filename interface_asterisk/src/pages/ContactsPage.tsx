import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Box, Chip, Button 
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/ps-contacts');
      setContacts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Chargement initial + Auto-refresh toutes les 10 secondes
  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 10000); 
    return () => clearInterval(interval);
  }, []);

  // Fonction pour nettoyer l'URI (ex: sip:106@192.168.1.50...) -> 192.168.1.50
  const formatUri = (uri: string) => {
    if (!uri) return 'Inconnu';
    const match = uri.match(/@([^;]+)/); // Récupère ce qu'il y a après le @
    return match ? match[1] : uri;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WifiIcon fontSize="large" /> Appareils en Ligne
        </Typography>
        <Button onClick={fetchContacts} startIcon={<RefreshIcon />}>Actualiser</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#e3f2fd' }}>
              <TableCell><strong>Extension</strong></TableCell>
              <TableCell><strong>Adresse IP (URI)</strong></TableCell>
              <TableCell><strong>Logiciel (User Agent)</strong></TableCell>
              <TableCell><strong>Statut</strong></TableCell>
              <TableCell><strong>Expiration</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">Aucun appareil connecté</TableCell></TableRow>
            ) : (
              contacts.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Chip label={row.endpoint} color="success" variant="outlined" />
                  </TableCell>
                  <TableCell>{formatUri(row.uri)}</TableCell>
                  <TableCell>{row.user_agent || 'Inconnu'}</TableCell>
                  <TableCell>
                    <Chip label="Enregistré" color="success" size="small" />
                  </TableCell>
                  <TableCell>{row.expiration_time} sec</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}