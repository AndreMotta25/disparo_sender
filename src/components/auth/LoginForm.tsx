import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Link,
  CircularProgress
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm = ({ onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Paper 
      elevation={4}
      sx={{ 
        p: 4, 
        width: '100%', 
        maxWidth: 500,
        borderRadius: 2,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 3, 
          fontWeight: 700, 
          color: '#004aad',
          textAlign: 'center' 
        }}
      >
        Login
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          onClose={clearError}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoFocus
        />
        
        <TextField
          fullWidth
          label="Senha"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: '#004aad',
            color: 'white',
            '&:hover': {
              bgcolor: '#003c8a'
            },
            height: 48
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Não tem uma conta?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onToggleForm}
              sx={{
                color: '#004aad',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Cadastre-se aqui
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm;