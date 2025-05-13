import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  Link,
  CircularProgress,
  Grid
} from '@mui/material';
import { useAuthStore } from '../../store/authStore';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm = ({ onToggleForm }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [unit, setUnit] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { register, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');
    
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    await register(email, password, name, unit);
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
        Cadastro
      </Typography>

      {(error || passwordError) && (
        <Alert 
          severity="error" 
          onClose={() => {
            clearError();
            setPasswordError('');
          }}
          sx={{ mb: 3 }}
        >
          {error || passwordError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome Completo"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unidade"
              variant="outlined"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              disabled={loading}
              placeholder="Ex: São Paulo, Rio de Janeiro"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirmar Senha"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              error={Boolean(passwordError)}
            />
          </Grid>
        </Grid>
        
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Já tem uma conta?{' '}
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
              Faça login aqui
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RegisterForm;