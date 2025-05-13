import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme,
  useMediaQuery,
  TablePagination,
  Stack
} from '@mui/material';
import { 
  Search, 
  Filter,
  RefreshCw,
  ListRestart
} from 'lucide-react';
import { useContactsStore } from '../../store/contactsStore';
import { getUniqueTurnOptions } from '../../utils/csvParser';

const ContactsList = () => {
  const { 
    contacts, 
    filteredContacts, 
    setSearchTerm, 
    setSelectedFilter,
    selectedFilter,
    toggleSelectAll,
    toggleContactSelection,
    clearContacts,
    showAllContacts
  } = useContactsStore();
  
  const [turnOptions, setTurnOptions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    if (contacts.length > 0) {
      const options = getUniqueTurnOptions(contacts);
      setTurnOptions(options);
    }
  }, [contacts]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    setPage(0); // Reset to first page when filtering
  };
  
  const handleShowAllContacts = () => {
    showAllContacts();
    setPage(0); // Reset to first page when showing all
  };
  
  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    toggleSelectAll(checked);
  };
  
  const handleSelectContact = (index: number, checked: boolean) => {
    toggleContactSelection(index, checked);
  };
  
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleClearContacts = () => {
    clearContacts();
    setSelectAll(false);
    setPage(0);
  };
  
  // Calculate pagination
  const paginatedContacts = filteredContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  if (contacts.length === 0) {
    return null;
  }
  console.log(contacts);
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap',
        gap: 2,
        mb: 2 
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            color: '#004aad',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Filter size={20} /> Contatos Carregados ({filteredContacts.length} de {contacts.length})
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ListRestart size={16} />}
            onClick={handleShowAllContacts}
          >
            Mostrar Todos
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<RefreshCw size={16} />}
            onClick={handleClearContacts}
          >
            Limpar Dados
          </Button>
        </Stack>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar por nome, email, telefone, bairro ou turno..."
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Filter size={16} /> Filtrar por turno:
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1 
          }}
        >
          {turnOptions.map((option) => (
            <Chip
              key={option}
              label={option}
              clickable
              color={selectedFilter === option ? 'primary' : 'default'}
              onClick={() => handleFilterClick(option)}
              sx={{ 
                bgcolor: selectedFilter === option ? '#004aad' : 'grey.200',
                color: selectedFilter === option ? 'white' : 'text.primary',
                fontWeight: selectedFilter === option ? 600 : 400,
                '&:hover': {
                  bgcolor: selectedFilter === option ? '#003c8a' : 'grey.300',
                },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAllChange}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Selecionar todos os contatos visíveis ({filteredContacts.length})
            </Typography>
          }
        />
      </Box>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Nome</TableCell>
              {!isMobile && (
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Telefone</TableCell>
              )}
              {!isMobile && (
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Idade</TableCell>
              )}
              {!isTablet && (
                <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Email</TableCell>
              )}
              <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Turno</TableCell>
              <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedContacts.map((contact, index) => (
              <TableRow 
                key={index}
                hover
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(0, 74, 173, 0.05)',
                  },
                  bgcolor: contact.selected ? 'rgba(0, 74, 173, 0.1)' : 'transparent',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={contact.selected}
                    onChange={(e) => handleSelectContact(
                      page * rowsPerPage + index, 
                      e.target.checked
                    )}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact.nome_completo}</TableCell>
                {!isMobile && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact.número_de_telefone}</TableCell>
                )}
                {!isMobile && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact.idade}</TableCell>
                )}
                {!isTablet && (
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{contact.email}</TableCell>
                )}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Chip 
                    label={contact.você_deseja_participar_em_qual_turno}
                    size="small"
                    sx={{ 
                      bgcolor: '#ffbf2e',
                      color: '#333',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.messageSent ? "Enviado" : "Pendente"}
                    size="small"
                    color={contact.messageSent ? "success" : "default"}
                    sx={{ 
                      fontWeight: 500
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredContacts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
};

export default ContactsList;