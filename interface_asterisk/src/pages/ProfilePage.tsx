import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock, Save } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Formulaire de changement de login
  const [newUsername, setNewUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loadingUsername, setLoadingUsername] = useState(false);
  
  // Formulaire de changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameMessage(null);
    
    if (!newUsername.trim()) {
      setUsernameMessage({ type: 'error', text: 'Le nouveau login est requis' });
      return;
    }

    if (newUsername.length < 3) {
      setUsernameMessage({ type: 'error', text: 'Le login doit contenir au moins 3 caractères' });
      return;
    }

    setLoadingUsername(true);

    try {
      await api.put('/auth/update-username', { newUsername });
      setUsernameMessage({ type: 'success', text: 'Login modifié avec succès' });
      setNewUsername('');
    } catch (error: any) {
      setUsernameMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la modification du login' 
      });
    } finally {
      setLoadingUsername(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Tous les champs sont requis' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setLoadingPassword(true);

    try {
      await api.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erreur lors de la modification du mot de passe' 
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Person sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" fontWeight={700}>
          Mon Profil
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Changement de login */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> Changer le Login
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleChangeUsername}>
              <TextField
                fullWidth
                label="Nouveau Login"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                margin="normal"
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              {usernameMessage && (
                <Alert severity={usernameMessage.type} sx={{ mt: 2 }}>
                  {usernameMessage.text}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loadingUsername}
                startIcon={<Save />}
                sx={{ mt: 3 }}
              >
                {loadingUsername ? 'Modification...' : 'Modifier le Login'}
              </Button>
            </form>
          </Paper>

          {/* Changement de mot de passe */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Lock /> Changer le Mot de Passe
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <form onSubmit={handleChangePassword}>
              <TextField
                fullWidth
                type={showCurrentPassword ? 'text' : 'password'}
                label="Mot de Passe Actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                type={showNewPassword ? 'text' : 'password'}
                label="Nouveau Mot de Passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirmer le Mot de Passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {passwordMessage && (
                <Alert severity={passwordMessage.type} sx={{ mt: 2 }}>
                  {passwordMessage.text}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loadingPassword}
                startIcon={<Save />}
                sx={{ mt: 3 }}
              >
                {loadingPassword ? 'Modification...' : 'Modifier le Mot de Passe'}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
