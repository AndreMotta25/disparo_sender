import { useEffect } from 'react';
import { Box, Typography, Divider, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MessageSquareMore } from 'lucide-react';
import Layout from '../components/Layout';
import CSVUploader from '../components/messaging/CSVUploader';
import ContactsList from '../components/messaging/ContactsList';
import MessageSender from '../components/messaging/MessageSender';
import { useAuthStore } from '../store/authStore';
import { useContactsStore } from '../store/contactsStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { contacts } = useContactsStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          <MessageSquareMore
            size={isMobile ? 28 : 32}
            color="#004aad"
            strokeWidth={1.5}
          />
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#004aad',
            }}
          >
            Painel de Mensagens
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Carregue sua planilha CSV, selecione os contatos e envie mensagens personalizadas
        </Typography>

        <Divider sx={{ mb: 4 }} />
      </Box>

      <CSVUploader />
      <ContactsList />
      {contacts.length > 0 && <MessageSender />}
    </Layout>
  );
};

export default Dashboard;