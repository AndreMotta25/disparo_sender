import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
  Chip
} from '@mui/material';
import { 
  Send, 
  MessageSquare,
  Eye
} from 'lucide-react';
import { useMessagingStore } from '../../store/messagingStore';
import { useContactsStore } from '../../store/contactsStore';

const MessageSender = () => {
  const { message, setMessage, sendMessages, sending, success, error, resetStatus } = useMessagingStore();
  const { getSelectedContacts } = useContactsStore();
  const [showPreview, setShowPreview] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const selectedContacts = getSelectedContacts();
  const hasSelectedContacts = selectedContacts.length > 0;
  
  useEffect(() => {
    // Reset status after 5 seconds when success or error
    if (success !== null || error !== null) {
      const timer = setTimeout(() => {
        resetStatus();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success, error, resetStatus]);
  
  const handleSendMessage = async () => {
    await sendMessages(selectedContacts);
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  // Replace placeholders in preview
  const getPreviewMessage = () => {
    if (!message || selectedContacts.length === 0) return message;
    
    // Sample contact for preview
    const contact = selectedContacts[0];
    
    let previewMsg = message;
    previewMsg = previewMsg.replace(/\{nome\}/gi, contact.nome_completo);
    previewMsg = previewMsg.replace(/\{telefone\}/gi, contact.número_de_telefone);
    previewMsg = previewMsg.replace(/\{email\}/gi, contact.email);
    previewMsg = previewMsg.replace(/\{turno\}/gi, contact.você_deseja_participar_em_qual_turno);
    
    return previewMsg;
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        mt: 4
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 600, 
          color: '#004aad',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <MessageSquare size={24} /> Enviar Mensagem
      </Typography>
      
      {(success === true) && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }}
          onClose={resetStatus}
        >
          Mensagens enviadas com sucesso!
        </Alert>
      )}
      
      {(error) && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={resetStatus}
        >
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          Mensagem personalizada
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="Digite sua mensagem... Use {nome}, {telefone}, {email} ou {turno} para personalizar."
          value={message}
          onChange={handleMessageChange}
          disabled={sending}
        />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2
        }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Eye size={18} />}
            onClick={togglePreview}
            disabled={!message.trim() || sending}
          >
            {showPreview ? "Ocultar" : "Visualizar"} Preview
          </Button>
          
          <Box>
            <Chip
              label={`${selectedContacts.length} contatos selecionados`}
              color={hasSelectedContacts ? "primary" : "default"}
              sx={{ 
                mr: 1,
                bgcolor: hasSelectedContacts ? 'rgba(0, 74, 173, 0.1)' : 'grey.200',
              }}
            />
          </Box>
        </Box>
      </Box>
      
      {showPreview && message && (
        <Box sx={{ mb: 3 }}>
          <Divider sx={{ my: 2 }} />
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: '#004aad'
            }}
          >
            <Eye size={18} /> Preview da Mensagem:
          </Typography>
          
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(255, 191, 46, 0.1)',
              border: '1px solid',
              borderColor: 'rgba(255, 191, 46, 0.3)',
              borderRadius: 1
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {getPreviewMessage()}
            </Typography>
          </Paper>
        </Box>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <Button
          variant="contained"
          color="primary"
          size={isMobile ? "medium" : "large"}
          startIcon={sending ? undefined : <Send size={18} />}
          onClick={handleSendMessage}
          disabled={!message.trim() || !hasSelectedContacts || sending}
          sx={{
            bgcolor: '#004aad',
            minWidth: isMobile ? 'auto' : 200,
            '&:hover': {
              bgcolor: '#003c8a'
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 74, 173, 0.3)',
            }
          }}
        >
          {sending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Enviar Mensagens'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default MessageSender;