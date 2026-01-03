import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  alpha,
  Grid as Grid, 
  useTheme,
  useMediaQuery,
  Skeleton,
  Fab,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import {
  Receipt,
  TrendingUp,
  CalendarToday,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  FilterList,
  Search,
  Add,
  Delete,
  TrendingDown,
  AccountBalanceWallet
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { host } from '../components/api';
import ExpenseTable from '../components/Table';

// SMOOTH BUBBLES
const ProfessionalBubbles = () => {
  const [bubbles] = useState(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      initialY: Math.random() * 120 - 10,
      size: Math.random() * 150 + 70,
      duration: Math.random() * 20 + 15,
      opacity: Math.random() * 0.2 + 0.1,
      drift: (Math.random() - 0.5) * 30
    }));
  });

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {bubbles.map(bubble => (
        <motion.div
          key={bubble.id}
          initial={{ x: `${bubble.x}vw`, y: `${bubble.initialY}vh`, scale: 1, opacity: bubble.opacity }}
          animate={{
            y: [`${bubble.initialY}vh`, `${bubble.initialY - 120}vh`],
            x: [`${bubble.x}vw`, `${bubble.x + bubble.drift}vw`, `${bubble.x - bubble.drift * 0.5}vw`, `${bubble.x}vw`],
            scale: [1, 1.05, 0.85],
            opacity: [bubble.opacity, bubble.opacity * 0.7, 0]
          }}
          transition={{ 
            duration: bubble.duration, 
            repeat: Infinity, 
            ease: [0.45, 0.05, 0.55, 0.95]
          }}
          style={{
            position: 'absolute',
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${alpha('#8b5cf6', bubble.opacity * 1.5)}, ${alpha('#6366f1', bubble.opacity)})`,
            border: `2px solid ${alpha('#8b5cf6', bubble.opacity * 0.6)}`,
            boxShadow: `inset -20px -20px 40px ${alpha('#fff', 0.5)}, 0 20px 50px ${alpha('#8b5cf6', bubble.opacity * 0.3)}`,
            filter: 'blur(0.5px)',
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </Box>
  );
};

// Delete Dialog
const DeleteDialog = ({ open, onClose, onConfirm, expense }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      component: motion.div,
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
      sx: {
        borderRadius: 3,
        p: 1,
        minWidth: 320,
        backdropFilter: 'blur(20px)',
        bgcolor: alpha('#fff', 0.95)
      }
    }}
  >
    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Delete sx={{ color: 'error.main' }} />
      <Typography variant="h6" fontWeight={600}>Delete Expense?</Typography>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">
        Are you sure you want to delete "{expense?.title}"? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="outlined">Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error" startIcon={<Delete />}>Delete</Button>
    </DialogActions>
  </Dialog>
);

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        component={motion.div}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        sx={{
          p: 1.5,
          border: `1px solid ${alpha('#8b5cf6', 0.2)}`,
          borderRadius: 1.5,
          boxShadow: `0 4px 12px ${alpha('#000', 0.1)}`,
          bgcolor: alpha('#fff', 0.95),
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          {payload[0].payload.name || payload[0].payload.month}
        </Typography>
        <Typography variant="body2" fontWeight={700} color="#8b5cf6">
          ₹{payload[0].value.toLocaleString('en-IN')}
        </Typography>
      </Paper>
    );
  }
  return null;
};

export default function View() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expense, setExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, expense: null });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${host}/view`);
      if (res.data.success) {
        setExpense(res.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (expense) => {
    setDeleteDialog({ open: true, expense });
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete(`${host}/delete/${deleteDialog.expense._id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
        setDeleteDialog({ open: false, expense: null });
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete expense');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const filteredExpenses = useMemo(() => {
    return expense.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expense, searchTerm, filterCategory]);

  // IMPROVED METRICS - More meaningful!
  const totalExpense = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  
  const now = new Date();
  const thisMonth = filteredExpenses.filter(item => {
    const date = new Date(item.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((sum, item) => sum + item.amount, 0);

  const lastMonth = filteredExpenses.filter(item => {
    const date = new Date(item.createdAt);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
  });
  const lastMonthTotal = lastMonth.reduce((sum, item) => sum + item.amount, 0);

  // Calculate trend
  const trend = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : thisMonthTotal > 0 ? 100 : 0;

  // Highest expense
  const highestExpense = filteredExpenses.length > 0 
    ? Math.max(...filteredExpenses.map(e => e.amount))
    : 0;

  const stats = [
    { 
      label: 'Total Expenses', 
      value: `₹${totalExpense.toLocaleString('en-IN')}`, 
      icon: Receipt, 
      color: '#8b5cf6', 
      bgColor: alpha('#8b5cf6', 0.12),
      trend: `${filteredExpenses.length} transactions`,
      trendColor: 'text.secondary'
    },
    { 
      label: 'This Month', 
      value: `₹${thisMonthTotal.toLocaleString('en-IN')}`, 
      icon: AccountBalanceWallet, 
      color: '#6366f1', 
      bgColor: alpha('#6366f1', 0.12),
      trend: `${trend >= 0 ? '+' : ''}${trend}% vs last month`,
      trendColor: trend >= 0 ? 'error.main' : 'success.main',
      trendIcon: trend >= 0 ? TrendingUp : TrendingDown
    },
    { 
      label: 'Highest Expense', 
      value: `₹${highestExpense.toLocaleString('en-IN')}`, 
      icon: TrendingUp, 
      color: '#a78bfa', 
      bgColor: alpha('#a78bfa', 0.12),
      trend: thisMonth.length > 0 ? `${thisMonth.length} this month` : 'No expenses',
      trendColor: 'text.secondary'
    }
  ];

  const categoryData = filteredExpenses.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.category);
    if (existing) {
      existing.value += item.amount;
      existing.count += 1;
    } else {
      acc.push({ name: item.category, value: item.amount, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  const COLORS = ['#8b5cf6', '#6366f1', '#a78bfa', '#c084fc', '#e9d5ff', '#ddd6fe', '#ede9fe'];

  const monthlyData = useMemo(() => {
    const monthMap = {};
    
    filteredExpenses.forEach(item => {
      const date = new Date(item.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          key: monthKey,
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          amount: 0,
          count: 0,
          timestamp: new Date(year, month, 1).getTime()
        };
      }
      
      monthMap[monthKey].amount += item.amount;
      monthMap[monthKey].count += 1;
    });

    return Object.values(monthMap)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-6);
  }, [filteredExpenses]);

  const categories = ['All', ...new Set(expense.map(e => e.category))];

  return (
    <>
      <ProfessionalBubbles />
      <DeleteDialog 
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, expense: null })}
        onConfirm={handleDeleteConfirm}
        expense={deleteDialog.expense}
      />
      
      <Box 
        sx={{ 
          minHeight: '100vh', 
          py: { xs: 2, sm: 4 }, 
          position: 'relative', 
          zIndex: 1
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={{ xs: 2.5, sm: 3 }}>
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Expense Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Professional expense tracking & analytics 📊
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    placeholder="Search expenses..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    }}
                    sx={{ 
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: alpha('#fff', 0.85),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        transition: 'all 0.25s ease',
                        '& fieldset': { borderColor: alpha('#8b5cf6', 0.2) },
                        '&:hover fieldset': { borderColor: alpha('#8b5cf6', 0.3) },
                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                      }
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      startAdornment={<FilterList sx={{ mr: 0.5, fontSize: 18, color: 'text.secondary' }} />}
                      sx={{
                        bgcolor: alpha('#fff', 0.85),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        transition: 'all 0.25s ease',
                        '& fieldset': { borderColor: alpha('#8b5cf6', 0.2) },
                        '&:hover fieldset': { borderColor: alpha('#8b5cf6', 0.3) },
                        '&.Mui-focused fieldset': { borderColor: '#8b5cf6' }
                      }}
                    >
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </motion.div>

            {/* Stats */}
            {loading ? (
              <Grid container spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Grid key={i} size={{ xs: 12, sm: 4 }}>
                    <Skeleton variant="rectangular" height={110} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {stats.map((stat, index) => {
                  const TrendIcon = stat.trendIcon;
                  return (
                    <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: alpha(stat.color, 0.2),
                            backgroundColor: alpha('#fff', 0.85),
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              borderColor: stat.color,
                              boxShadow: `0 8px 24px ${alpha(stat.color, 0.15)}`,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 1.5,
                                backgroundColor: stat.bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <stat.icon sx={{ color: stat.color, fontSize: 26 }} />
                            </Box>
                            <Box flex={1}>
                              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {stat.label}
                              </Typography>
                              <Typography variant="h6" fontWeight={700} color="text.primary">
                                {stat.value}
                              </Typography>
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                {TrendIcon && <TrendIcon sx={{ fontSize: 14, color: stat.trendColor }} />}
                                <Typography variant="caption" color={stat.trendColor}>
                                  {stat.trend}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Paper>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* Charts */}
            {!loading && filteredExpenses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.25, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha('#8b5cf6', 0.15),
                        height: '100%',
                        bgcolor: alpha('#fff', 0.85),
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>Category Distribution</Typography>
                          <Typography variant="caption" color="text.secondary">Spending by category</Typography>
                        </Box>
                        <PieChartIcon sx={{ color: '#8b5cf6' }} />
                      </Stack>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={isMobile ? 80 : 95}
                            fill="#8884d8"
                            dataKey="value"
                            animationDuration={700}
                            animationEasing="ease-out"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: alpha('#8b5cf6', 0.15),
                        height: '100%',
                        bgcolor: alpha('#fff', 0.85),
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>Monthly Spending</Typography>
                          <Typography variant="caption" color="text.secondary">Last 6 months</Typography>
                        </Box>
                        <BarChartIcon sx={{ color: '#8b5cf6' }} />
                      </Stack>
                      <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                        <BarChart data={monthlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha('#8b5cf6', 0.1)} />
                          <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="amount" 
                            fill="#8b5cf6" 
                            radius={[8, 8, 0, 0]}
                            animationDuration={700}
                            animationEasing="ease-out"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </motion.div>
            )}

            {/* TABLE */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <ExpenseTable 
                expenses={filteredExpenses}
                loading={loading}
                onDelete={handleDeleteClick}
                onEdit={handleEdit}
              />
            </motion.div>
          </Stack>
        </Container>

        {/* SUPERB FAB - Enhanced with multiple effects! */}
        <Zoom in={true} timeout={400}>
          <Box
            sx={{
              position: 'fixed',
              bottom: { xs: 20, sm: 28 },
              right: { xs: 20, sm: 28 },
              zIndex: 1000
            }}
          >
            {/* Pulsing ring effect */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                border: '3px solid #8b5cf6',
                pointerEvents: 'none'
              }}
            />

            {/* Glowing shadow pulse */}
            <motion.div
              animate={{ 
                boxShadow: [
                  `0 0 20px ${alpha('#8b5cf6', 0.4)}, 0 0 40px ${alpha('#6366f1', 0.3)}`,
                  `0 0 30px ${alpha('#8b5cf6', 0.6)}, 0 0 60px ${alpha('#6366f1', 0.5)}`,
                  `0 0 20px ${alpha('#8b5cf6', 0.4)}, 0 0 40px ${alpha('#6366f1', 0.3)}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ borderRadius: '50%' }}
            >
              <Fab
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                  color: '#fff',
                  width: { xs: 64, sm: 72 },
                  height: { xs: 64, sm: 72 },
                  boxShadow: `0 8px 32px ${alpha('#8b5cf6', 0.4)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s'
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                    transform: 'scale(1.08) translateY(-2px)',
                    boxShadow: `0 12px 48px ${alpha('#8b5cf6', 0.6)}`,
                    '&::before': {
                      left: '100%'
                    }
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                    boxShadow: `0 4px 16px ${alpha('#8b5cf6', 0.4)}`
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => navigate('/add')}
                component={motion.button}
                whileHover={{ 
                  scale: 1.08,
                  rotate: 90,
                  transition: { type: 'spring', stiffness: 300, damping: 15 }
                }}
                whileTap={{ 
                  scale: 0.9,
                  rotate: 0,
                  transition: { duration: 0.1 }
                }}
              >
                <Add sx={{ fontSize: { xs: 32, sm: 36 } }} />
              </Fab>
            </motion.div>
          </Box>
        </Zoom>
      </Box>
    </>
  );
}
