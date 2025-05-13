import { useState, useEffect } from 'react';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MessageSquareMore } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuthStore } from '../store/authStore';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          bgcolor: '#004aad',
          py: 3,
          display: 'flex',
          justifyContent: 'center',
          boxShadow: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <MessageSquareMore
              size={isMobile ? 32 : 42}
              color="#ffbf2e"
              strokeWidth={1.5}
            />
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#ffbf2e',
                textAlign: 'center',
              }}
            >
              WhatsApp Messenger
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: 600,
            }}
          >
            Plataforma para envio de mensagens em massa via WhatsApp
          </Typography>

          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          bgcolor: '#f0f0f0',
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} WhatsApp Messenger - Todos os direitos reservados
        </Typography>
      </Box>
    </Box>
  );
};

export default Auth;