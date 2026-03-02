import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, 
  ListItemButton, ListItemText, Box, CssBaseline, 
  Divider, IconButton, Menu, MenuItem
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { useState } from 'react';

const drawerWidth = 260;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Dashboard', path: '/' },
    { text: 'Extensions SIP', path: '/extensions' },
    { text: 'Appareils en ligne', path: '/contacts' },
    { text: 'Historique CDR', path: '/cdr' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barre du haut avec style amélioré */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <PhoneIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Asterisk Admin Panel
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Admin
            </Typography>
            <IconButton onClick={handleMenu} color="inherit" size="small">
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                A
              </Box>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                Mon profil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Latéral avec design amélioré */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5, px: 1.5 }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                      },
                    },
                  }}
                >
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      fontSize: '0.95rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ px: 2, py: 2, mx: 1.5, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2', display: 'block', mb: 0.5 }}>
              Serveur Asterisk
            </Typography>
            <Typography variant="body2" sx={{ color: '#1565c0', fontSize: '0.85rem', mb: 1 }}>
              192.168.88.250
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                bgcolor: '#4caf50',
                animation: 'pulse 2s infinite'
              }} />
              <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                En ligne
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Contenu principal avec animations */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          backgroundColor: 'background.default', 
          minHeight: '100vh',
          transition: 'all 0.3s ease',
          '@keyframes pulse': {
            '0%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.6, transform: 'scale(1.1)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        }}
      >
        <Toolbar />
        <Box sx={{ 
          animation: 'fadeIn 0.5s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}