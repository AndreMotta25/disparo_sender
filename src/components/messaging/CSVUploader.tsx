import { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Upload, FileUp, FilePlus2 } from 'lucide-react';
import { parseCSV } from '../../utils/csvParser';
import { useContactsStore } from '../../store/contactsStore';

const CSVUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setContacts } = useContactsStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is a CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV válido.');
      setFileName(null);
      return;
    }

    setFileName(file.name);
    setError(null);
    setLoading(true);

    try {
      const contacts = await parseCSV(file);
      setContacts(contacts);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        border: '2px dashed',
        borderColor: error ? 'error.main' : '#ddd',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#004aad',
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
      onClick={handleClick}
    >
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <CircularProgress sx={{ color: '#004aad', mb: 2 }} />
          <Typography variant="body1">Processando arquivo...</Typography>
        </Box>
      ) : fileName ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%'
        }}>
          <FileUp 
            size={48} 
            color="#004aad" 
            strokeWidth={1.5} 
            style={{ marginBottom: 16 }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#004aad',
              fontWeight: 600
            }}
          >
            Arquivo carregado
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 1,
              color: 'text.secondary',
              wordBreak: 'break-all',
              textAlign: 'center'
            }}
          >
            {fileName}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilePlus2 size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              handleClick();
            }}
            sx={{ mt: 2 }}
          >
            Selecionar outro arquivo
          </Button>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          width: '100%'
        }}>
          <Upload 
            size={isMobile ? 36 : 48} 
            color="#004aad" 
            strokeWidth={1.5} 
            style={{ marginBottom: 16 }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#004aad',
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Clique para selecionar uma planilha CSV
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1,
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: '80%'
            }}
          >
            Formato suportado: CSV do Google Sheets com colunas específicas
          </Typography>
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2, width: '100%' }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default CSVUploader;