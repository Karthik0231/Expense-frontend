import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Paper,
  alpha,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Collapse
} from '@mui/material';
import {
  Receipt,
  Restaurant,
  DirectionsCar,
  Movie,
  Lightbulb,
  LocalHospital,
  ShoppingBag,
  School,
  MoreHoriz,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Enhanced Table Row Component
const ExpenseRow = ({ row, index, onDelete, onEdit }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categoryIcons = {
    Food: Restaurant,
    Transport: DirectionsCar,
    Entertainment: Movie,
    Utilities: Lightbulb,
    Healthcare: LocalHospital,
    Shopping: ShoppingBag,
    Education: School,
    Other: MoreHoriz
  };

  const CategoryIcon = categoryIcons[row.category] || MoreHoriz;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isMobile) {
    return (
      <>
        <TableRow
          component={motion.tr}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: alpha('#8b5cf6', 0.06) }
          }}
          onClick={() => setOpen(!open)}
        >
          <TableCell colSpan={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ width: 40, height: 40, bgcolor: alpha('#8b5cf6', 0.12) }}>
                  <CategoryIcon sx={{ fontSize: 20, color: '#8b5cf6' }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{row.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{row.category}</Typography>
                </Box>
              </Stack>
              <Stack alignItems="flex-end" spacing={0.5}>
                <Typography variant="body2" fontWeight={700} color="#8b5cf6">
                  ₹{row.amount.toLocaleString('en-IN')}
                </Typography>
                <IconButton size="small">{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
              </Stack>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell sx={{ p: 0, border: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ p: 2, bgcolor: alpha('#8b5cf6', 0.04) }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                  📅 {formatDate(row.createdAt)}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={(e) => { e.stopPropagation(); onEdit(row._id); }}
                    sx={{ 
                      flex: 1, 
                      borderColor: '#8b5cf6', 
                      color: '#8b5cf6', 
                      '&:hover': { borderColor: '#6366f1', bgcolor: alpha('#8b5cf6', 0.08) } 
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                    sx={{ flex: 1 }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  return (
    <TableRow
      component={motion.tr}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        '&:hover': { backgroundColor: alpha('#8b5cf6', 0.06) },
        transition: 'background-color 0.25s ease'
      }}
    >
      <TableCell>
        <Typography variant="body2" fontWeight={500} color="text.secondary">#{index + 1}</Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 36, height: 36, bgcolor: alpha('#8b5cf6', 0.12) }}>
            <CategoryIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
          </Avatar>
          <Typography variant="body2" fontWeight={600}>{row.title}</Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Chip 
          label={row.category} 
          size="small" 
          sx={{ 
            bgcolor: alpha('#8b5cf6', 0.12), 
            color: '#8b5cf6', 
            fontWeight: 500,
            borderRadius: 1.5
          }} 
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={700} color="#8b5cf6">
          ₹{row.amount.toLocaleString('en-IN')}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">{formatDate(row.createdAt)}</Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(row._id)}
              sx={{ 
                color: '#8b5cf6', 
                '&:hover': { bgcolor: alpha('#8b5cf6', 0.12) },
                transition: 'all 0.2s ease'
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <IconButton
              size="small"
              onClick={() => onDelete(row)}
              sx={{ 
                color: 'error.main', 
                '&:hover': { bgcolor: alpha('#f44336', 0.12) },
                transition: 'all 0.2s ease'
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </motion.div>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

// Main Table Component
export default function ExpenseTable({ expenses, loading, onDelete, onEdit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: alpha('#8b5cf6', 0.15),
        overflow: 'hidden',
        bgcolor: alpha('#fff', 0.75),
        backdropFilter: 'blur(12px)'
      }}
    >
      <Box 
        sx={{ 
          p: 2.5, 
          borderBottom: '1px solid', 
          borderColor: alpha('#8b5cf6', 0.1),
          bgcolor: alpha('#fff', 0.6)
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              All Expenses
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'} found
            </Typography>
          </Box>
        </Stack>
      </Box>
      <TableContainer sx={{ bgcolor: 'transparent' }}>
        <Table>
          {!isMobile && (
            <TableHead sx={{ bgcolor: alpha('#8b5cf6', 0.06) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>No.</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 6} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 6} align="center" sx={{ py: 8 }}>
                  <Box>
                    <Receipt sx={{ fontSize: 64, color: alpha('#8b5cf6', 0.3), mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" mb={1}>
                      No expenses found
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Click the + button to add your first expense
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((row, index) => (
                <ExpenseRow 
                  key={row._id} 
                  row={row} 
                  index={index} 
                  onDelete={onDelete} 
                  onEdit={onEdit} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
