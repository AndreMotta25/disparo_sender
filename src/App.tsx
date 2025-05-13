import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Create custom Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#004aad',
      light: '#3671c1',
      dark: '#00347a',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffbf2e',
      light: '#ffcc58',
      dark: '#dc9c00',
      contrastText: '#000',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  const { user } = useAuthStore();

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Fetch user data from users_juv table
        const { data: userData, error } = await supabase
          .from('users_juv')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (!error && userData) {
          useAuthStore.setState({
            user: {
              id: data.session.user.id,
              email: data.session.user.email!,
              name: userData.name,
              unit: userData.unit,
              created_at: userData.created_at,
            }
          });
        }
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // User data should be set by login/register functions
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.setState({ user: null });
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;