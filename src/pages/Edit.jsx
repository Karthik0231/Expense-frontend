import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Stack,
  InputAdornment,
  alpha,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Title as TitleIcon,
  CurrencyRupee,
  Save,
  Restaurant,
  DirectionsCar,
  Movie,
  Lightbulb,
  LocalHospital,
  ShoppingBag,
  School,
  MoreHoriz,
  CheckCircleOutline,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { host } from '../components/api';
import { toast } from 'react-toastify';

// INSTANT visible bubbles
const ProfessionalBubbles = () => {
  const [bubbles] = useState(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      initialY: Math.random() * 120 - 10,
      size: Math.random() * 180 + 80,
      duration: Math.random() * 25 + 20,
      opacity: Math.random() * 0.25 + 0.15,
      drift: (Math.random() - 0.5) * 40
    }));
  });

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {bubbles.map(bubble => (
        <motion.div
          key={bubble.id}
          initial={{
            x: `${bubble.x}vw`,
            y: `${bubble.initialY}vh`,
            scale: 1,
            opacity: bubble.opacity
          }}
          animate={{
            y: [`${bubble.initialY}vh`, `${bubble.initialY - 125}vh`],
            x: [
              `${bubble.x}vw`,
              `${bubble.x + bubble.drift}vw`,
              `${bubble.x - bubble.drift * 0.5}vw`,
              `${bubble.x}vw`
            ],
            scale: [1, 1, 0.8],
            opacity: [bubble.opacity, bubble.opacity, 0]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.85, 1],
            repeatDelay: 0
          }}
          style={{
            position: 'absolute',
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, 
              ${alpha('#8b5cf6', bubble.opacity * 1.8)}, 
              ${alpha('#6366f1', bubble.opacity * 1.2)},
              ${alpha('#8b5cf6', bubble.opacity * 0.6)})`,
            border: `2px solid ${alpha('#8b5cf6', bubble.opacity * 0.8)}`,
            boxShadow: `
              inset -25px -25px 50px ${alpha('#fff', 0.6)},
              inset 25px 25px 50px ${alpha('#8b5cf6', 0.2)},
              0 25px 60px ${alpha('#8b5cf6', bubble.opacity * 0.4)}
            `,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </Box>
  );
};

// Particle burst
const ParticleBurst = ({ x, y, onComplete }) => {
  const particles = Array.from({ length: 16 });

  return (
    <Box sx={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map((_, i) => {
        const angle = (Math.PI * 2 * i) / particles.length;
        return (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0],
              x: Math.cos(angle) * 120,
              y: Math.sin(angle) * 120
            }}
            transition={{
              duration: 1.2,
              ease: [0.19, 1, 0.22, 1],
              times: [0, 0.4, 1]
            }}
            onAnimationComplete={i === 0 ? onComplete : undefined}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              boxShadow: `0 2px 12px ${alpha('#8b5cf6', 0.5)}`
            }}
          />
        );
      })}
    </Box>
  );
};

// Success animation
const SuccessAnimation = ({ show }) => {
  const confetti = Array.from({ length: 60 });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha('#fff', 0.98),
            backdropFilter: 'blur(20px)'
          }}
        >
          {confetti.map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: '50vw', y: '50vh', scale: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}vw`,
                y: '120vh',
                scale: 1,
                rotate: Math.random() * 1080,
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: [0.19, 1, 0.22, 1],
                delay: Math.random() * 0.4,
                times: [0, 0.7, 1]
              }}
              style={{
                position: 'absolute',
                width: Math.random() * 12 + 6,
                height: Math.random() * 12 + 6,
                backgroundColor: ['#8b5cf6', '#6366f1', '#a78bfa'][i % 3],
                borderRadius: Math.random() > 0.5 ? '50%' : '20%',
                boxShadow: `0 2px 8px ${alpha('#8b5cf6', 0.3)}`
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.7, repeat: 2, delay: 0.3 }}
              >
                <Box
                  sx={{
                    width: 110,
                    height: 110,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha('#8b5cf6', 0.15)}, ${alpha('#6366f1', 0.2)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    mx: 'auto',
                    border: `3px solid ${alpha('#8b5cf6', 0.2)}`
                  }}
                >
                  <CheckCircleOutline sx={{ fontSize: 65, color: '#8b5cf6' }} />
                </Box>
              </motion.div>
              {/* <Typography variant="h3" fontWeight={700} color="#8b5cf6" mb={1}>
                Updated! 🎉
              </Typography> */}
              <Typography variant="body1" color="text.secondary">
                Expense updated successfully
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clickParticles, setClickParticles] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const categories = [
    { value: 'Food', label: 'Food', icon: Restaurant },
    { value: 'Transport', label: 'Transport', icon: DirectionsCar },
    { value: 'Entertainment', label: 'Entertainment', icon: Movie },
    { value: 'Utilities', label: 'Utilities', icon: Lightbulb },
    { value: 'Healthcare', label: 'Healthcare', icon: LocalHospital },
    { value: 'Shopping', label: 'Shopping', icon: ShoppingBag },
    { value: 'Education', label: 'Education', icon: School },
    { value: 'Other', label: 'Other', icon: MoreHoriz }
  ];

  useEffect(() => {
    const singleData = async () => {
      try {
        const res = await axios.get(`${host}/singleView/${id}`);
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to load expense data');
      } finally {
        setIsLoading(false);
      }
    };

    singleData();
  }, [id]);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 3) return 'Minimum 3 characters';
        if (value.length > 50) return 'Maximum 50 characters';
        return '';
      case 'amount':
        if (!value) return 'Amount is required';
        if (isNaN(value) || Number(value) <= 0) return 'Enter valid amount';
        if (Number(value) > 10000000) return 'Amount too large';
        return '';
      case 'category':
        if (!value) return 'Select category';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setFocusedField(null);
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleFocus = (fieldName) => setFocusedField(fieldName);

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched({ title: true, amount: true, category: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix errors');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.put(`${host}/update/${id}`, {
        ...formData,
        amount: Number(formData.amount)
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowSuccess(true);
        setTimeout(() => navigate('/'), 2800);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to update');
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.amount &&
      formData.category &&
      Object.values(errors).every((error) => !error)
    );
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  const handleFormClick = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT') return;
    const newParticle = { x: e.clientX, y: e.clientY, id: Date.now() };
    setClickParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setClickParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1200);
  };

  if (isLoading) {
    return (
      <>
        <ProfessionalBubbles />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={60} sx={{ color: '#8b5cf6', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Loading expense data...
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </>
    );
  }

  return (
    <>
      <ProfessionalBubbles />
      <SuccessAnimation show={showSuccess} />
      
      {clickParticles.map(particle => (
        <ParticleBurst key={particle.id} x={particle.x} y={particle.y} onComplete={() => {}} />
      ))}

      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 4, sm: 6 },
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={handleFormClick}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Stack spacing={4}>
              {/* Header */}
              <Box>
                <motion.div
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <IconButton
                    onClick={() => navigate('/')}
                    sx={{
                      mb: 3,
                      color: '#8b5cf6',
                      backgroundColor: alpha('#8b5cf6', 0.1),
                      backdropFilter: 'blur(10px)',
                      boxShadow: `0 4px 16px ${alpha('#8b5cf6', 0.2)}`,
                      transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                      '&:hover': {
                        backgroundColor: alpha('#8b5cf6', 0.15),
                        boxShadow: `0 6px 24px ${alpha('#8b5cf6', 0.3)}`
                      }
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <EditIcon sx={{ fontSize: 36, color: '#8b5cf6' }} />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      Edit Expense
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Update your expense details 
                  </Typography>
                </motion.div>
              </Box>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <Paper
                  component="form"
                  onSubmit={handleSubmit}
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    backgroundColor: alpha('#ffffff', 0.9),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#8b5cf6', 0.15),
                    boxShadow: `0 12px 40px ${alpha('#8b5cf6', 0.12)}`,
                    transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                    '&:hover': {
                      borderColor: alpha('#8b5cf6', 0.25),
                      boxShadow: `0 16px 50px ${alpha('#8b5cf6', 0.18)}`
                    }
                  }}
                >
                  <Stack spacing={3}>
                    {/* Title Field */}
                    <motion.div
                      animate={{ y: focusedField === 'title' ? -2 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <TextField
                        label="Expense Title"
                        name="title"
                        variant="outlined"
                        fullWidth
                        required
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => handleFocus('title')}
                        error={touched.title && Boolean(errors.title)}
                        helperText={touched.title && errors.title}
                        placeholder="What did you spend on?"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <motion.div
                                animate={{
                                  scale: focusedField === 'title' ? 1.15 : 1,
                                  rotate: focusedField === 'title' ? [0, -10, 10, -10, 0] : 0
                                }}
                                transition={{ duration: 0.6 }}
                              >
                                <TitleIcon
                                  sx={{
                                    color: focusedField === 'title' ? '#8b5cf6' : 'action.active',
                                    transition: 'color 0.3s'
                                  }}
                                />
                              </motion.div>
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fff',
                            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                            '& fieldset': {
                              borderColor: alpha('#8b5cf6', 0.2),
                              transition: 'all 0.3s'
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#8b5cf6', 0.4)
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 4px ${alpha('#8b5cf6', 0.12)}`,
                              '& fieldset': {
                                borderColor: '#8b5cf6',
                                borderWidth: 2
                              }
                            }
                          }
                        }}
                      />
                    </motion.div>

                    {/* Amount Field */}
                    <motion.div
                      animate={{ y: focusedField === 'amount' ? -2 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <TextField
                        type="number"
                        label="Amount"
                        name="amount"
                        variant="outlined"
                        fullWidth
                        required
                        value={formData.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => handleFocus('amount')}
                        error={touched.amount && Boolean(errors.amount)}
                        helperText={touched.amount && errors.amount}
                        placeholder="0.00"
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <motion.div
                                animate={{ scale: focusedField === 'amount' ? [1, 1.2, 1] : 1 }}
                                transition={{ 
                                  duration: 0.5,
                                  repeat: focusedField === 'amount' ? Infinity : 0,
                                  repeatDelay: 0.5
                                }}
                              >
                                <CurrencyRupee
                                  sx={{
                                    color: focusedField === 'amount' ? '#8b5cf6' : 'action.active',
                                    transition: 'color 0.3s'
                                  }}
                                />
                              </motion.div>
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fff',
                            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                            '& fieldset': {
                              borderColor: alpha('#8b5cf6', 0.2),
                              transition: 'all 0.3s'
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#8b5cf6', 0.4)
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 4px ${alpha('#8b5cf6', 0.12)}`,
                              '& fieldset': {
                                borderColor: '#8b5cf6',
                                borderWidth: 2
                              }
                            }
                          }
                        }}
                      />
                    </motion.div>

                    {/* Category */}
                    <motion.div
                      animate={{ y: focusedField === 'category' ? -2 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <FormControl fullWidth required error={touched.category && Boolean(errors.category)}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          label="Category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onFocus={() => handleFocus('category')}
                          startAdornment={
                            selectedCategory && (
                              <InputAdornment position="start">
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                                >
                                  {/* <selectedCategory.icon sx={{ color: '#8b5cf6' }} /> */}
                                </motion.div>
                              </InputAdornment>
                            )
                          }
                          sx={{
                            backgroundColor: '#fff',
                            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                            '& fieldset': {
                              borderColor: alpha('#8b5cf6', 0.2),
                              transition: 'all 0.3s'
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#8b5cf6', 0.4)
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 4px ${alpha('#8b5cf6', 0.12)}`,
                              '& fieldset': {
                                borderColor: '#8b5cf6',
                                borderWidth: 2
                              }
                            }
                          }}
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <cat.icon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                                <Typography>{cat.label}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {touched.category && errors.category && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {errors.category}
                          </Typography>
                        )}
                      </FormControl>
                    </motion.div>

                    {/* Buttons */}
                    <Stack spacing={2} sx={{ pt: 1 }}>
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={!isFormValid() || isSubmitting}
                          startIcon={
                            <motion.div
                              animate={{ rotate: isSubmitting ? 360 : 0 }}
                              transition={{ duration: 1.2, repeat: isSubmitting ? Infinity : 0, ease: 'linear' }}
                            >
                              <Save />
                            </motion.div>
                          }
                          sx={{
                            py: 1.75,
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                            boxShadow: `0 8px 24px ${alpha('#8b5cf6', 0.35)}`,
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                              transition: 'left 0.6s cubic-bezier(0.19, 1, 0.22, 1)'
                            },
                            '&:hover': {
                              boxShadow: `0 12px 32px ${alpha('#8b5cf6', 0.45)}`,
                              transform: 'translateY(-1px)',
                              '&::before': {
                                left: '100%'
                              }
                            },
                            '&:disabled': {
                              background: alpha('#000', 0.12)
                            }
                          }}
                        >
                          {isSubmitting ? 'Updating...' : 'Update Expense'}
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <Button
                          variant="text"
                          size="large"
                          fullWidth
                          onClick={() => navigate('/')}
                          sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            color: '#8b5cf6',
                            transition: 'all 0.3s',
                            '&:hover': {
                              backgroundColor: alpha('#8b5cf6', 0.08)
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </Stack>
                  </Stack>
                </Paper>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
