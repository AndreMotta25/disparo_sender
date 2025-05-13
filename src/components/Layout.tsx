import { ReactNode, useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Container, 
  Button, 
  useMediaQuery, 
  Theme
} from '@mui/material';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#004aad' }}>
        <Toolbar>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#ffbf2e',
              fontWeight: 700,
              letterSpacing: '0.5px',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            WhatsApp Messenger
          </Typography>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant={isMobile ? "body2" : "body1"} 
                component="div" 
                sx={{ 
                  mr: 2,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {user.name} | {user.unit}
              </Typography>
              
              <Button
                color="inherit"
                startIcon={<LogOut size={18} />}
                onClick={handleLogout}
                onMouseEnter={() => setIsLogoutHovered(true)}
                onMouseLeave={() => setIsLogoutHovered(false)}
                sx={{
                  bgcolor: isLogoutHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'background-color 0.3s',
                }}
              >
                {!isMobile && 'Sair'}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          py: 4 
        }}
      >
        {children}
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          bgcolor: '#f5f5f5',
          textAlign: 'center',
          mt: 'auto'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} WhatsApp Messenger
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;