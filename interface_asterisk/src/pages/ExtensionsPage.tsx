import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Typography, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';

export default function ExtensionsPage() {
  const [extensions, setExtensions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  
  // Formulaire d'ajout
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 1. Charger la liste depuis le backend
  const fetchExtensions = async () => {
    try {
      const res = await api.get('/ps-endpoints');
      setExtensions(res.data);
    } catch (err) {
      console.error("Erreur chargement", err);
    }
  };

  useEffect(() => { fetchExtensions(); }, []);

  // 2. Créer un compte (Orchestrateur)
  const handleCreate = async () => {
    try {
      await api.post('/new-endpoint', {
        username,
        password,
        context: 'from-internal'
      });
      setOpen(false);
      setUsername('');
      setPassword('');
      fetchExtensions(); // Rafraichir la liste
    } catch (err) {
      alert("Erreur lors de la création");
    }
  };

  // 3. Supprimer un compte (Orchestrateur)
  const handleDelete = async (username: string) => {
    if(!window.confirm(`Supprimer l'extension ${username} ?`)) return;
    try {
      await api.delete(`/new-endpoint/${username}`);
      fetchExtensions();
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PhoneIcon fontSize="large" /> Extensions SIP
        </Typography>
        <Box>
            <Button onClick={fetchExtensions} sx={{ mr: 1 }} startIcon={<RefreshIcon />}>Actualiser</Button>
            <Button variant="contained" onClick={() => setOpen(true)} startIcon={<AddIcon />}>Nouvelle</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#eee' }}>
              <TableCell><strong>Extension (ID)</strong></TableCell>
              <TableCell><strong>Auth ID</strong></TableCell>
              <TableCell><strong>Contexte</strong></TableCell>
              <TableCell><strong>Codecs</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extensions.map((row) => (
              <TableRow key={row.id}>
                <TableCell><Chip label={row.id} color="primary" variant="outlined" /></TableCell>
                <TableCell>{row.auth}</TableCell>
                <TableCell>{row.context}</TableCell>
                <TableCell>{row.allow}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {extensions.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center">Aucune donnée</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Fenêtre Modale d'ajout */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter une extension</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Numéro (ex: 110)" fullWidth
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense" label="Mot de passe" type="password" fullWidth
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleCreate} variant="contained">Créer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}