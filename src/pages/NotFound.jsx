import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Stack, alpha, Chip } from '@mui/material';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Typing animation with smooth cursor
const TypingText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(false);
    const timer = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setIsTyping(false), 400);
        }
      }, 26);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <Typography
      variant="body1"
      sx={{
        color: '#475569',
        fontSize: { xs: '14px', sm: '16px' },
        lineHeight: 1.9,
        fontWeight: 400,
        minHeight: { xs: '90px', sm: '70px' },
        textAlign: 'center',
        px: { xs: 1, sm: 0 }
      }}
    >
      {displayedText}
      <AnimatePresence>
        {isTyping && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.2, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, repeat: Infinity }}
            style={{ 
              display: 'inline-block',
              width: 2,
              height: 18,
              backgroundColor: '#8b5cf6',
              marginLeft: 4,
              verticalAlign: 'middle'
            }}
          />
        )}
      </AnimatePresence>
    </Typography>
  );
};

// Simple floating particles
const SmoothParticles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 100 + Math.random() * 20,
    delay: Math.random() * 2.5,
    duration: 4 + Math.random() * 3,
    size: 2 + Math.random() * 3
  }));

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{
            opacity: [0, 0.45, 0],
            scale: [0, 1, 0.8],
            y: -220,
            x: (Math.random() - 0.5) * 90
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            boxShadow: `0 0 ${p.size * 4}px rgba(139, 92, 246, 0.6)`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </Box>
  );
};

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageKey, setMessageKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const attemptedPath = location.pathname;

  // PROFESSIONAL MESSAGES (No roasting, just helpful & friendly)
  const professionalMessages = [
    "The page you're looking for doesn't exist in our system. This might be due to a mistyped URL or an outdated link. Please check the address and try again.",
    "We couldn't find the resource you requested. The URL may have been moved, deleted, or never existed. Navigate back to the dashboard to continue exploring.",
    "This endpoint is not available. It's possible the page was removed during a recent update, or the link you followed is incorrect. Let's get you back on track.",
    "The requested page could not be found. Double-check the URL for any typos, or use the navigation menu to find what you're looking for.",
    "Oops! This route doesn't exist on our expense tracker. It seems you've ventured into uncharted territory. Click below to return to familiar ground.",
    "We've searched our database but couldn't locate this page. The URL might be outdated or incorrectly formatted. Return to the dashboard to continue your work.",
    "Page not found. This could happen if the link is broken or the page has been relocated. Use the button below to navigate back to the main application.",
    "The path you entered doesn't match any routes in our system. Please verify the URL or click the button below to return to your expense dashboard.",
    "Sorry, this page is unavailable. The resource may have been moved or removed. Navigate to the home page to access all available features.",
    "We couldn't locate the page you requested. This might be a temporary issue or a broken link. Click below to return to the expense tracker dashboard.",
    "The requested resource is not available at this location. Please check your URL for accuracy or use the navigation to find your desired page.",
    "This page doesn't exist in the application. The URL you entered may be incorrect or outdated. Return to the dashboard to continue managing your expenses.",
    "404 Error: The page you're trying to access is not found. This could be due to an incorrect URL or a removed page. Navigate back to get started.",
    "We're unable to find this page. It may have been moved, renamed, or deleted. Use the button below to return to the main dashboard and try again.",
    "The endpoint you're looking for is not available. Please ensure the URL is correct, or navigate back to the homepage to access all features.",
    "This page isn't accessible right now. The link might be broken or the page may no longer exist. Click the button below to return to your workspace.",
    "Sorry, we can't find that page. The URL may contain a typo or the page might have been removed. Head back to the dashboard to continue.",
    "The page you requested is not available. This could be due to an incorrect link or a page that no longer exists. Navigate home to get back on track.",
    "We couldn't locate this resource. The URL might be outdated or mistyped. Return to the expense tracker to access all available features and tools.",
    "This route is not recognized by our system. Please verify the URL or click below to navigate back to the main application dashboard."
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentMessage(professionalMessages[Math.floor(Math.random() * professionalMessages.length)]);
  }, []);

  const handleNewMessage = () => {
    setMessageKey((prev) => prev + 1);
    const newMessage = professionalMessages[Math.floor(Math.random() * professionalMessages.length)];
    setCurrentMessage(newMessage);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f7ff 25%, #f5f3ff 50%, #ede9fe 80%, #e9d5ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4 },
        px: 2
      }}
    >
      {!prefersReducedMotion && <SmoothParticles />}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {showContent && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <Stack spacing={{ xs: 2.5, sm: 3 }} alignItems="center">
                {/* Terminal-style header */}
                <motion.div variants={itemVariants} style={{ width: '100%', maxWidth: 620 }}>
                  <Box
                    sx={{
                      background: alpha('#020617', 0.98),
                      backdropFilter: 'blur(18px)',
                      borderRadius: { xs: 2, sm: 2.5 },
                      border: `1px solid ${alpha('#8b5cf6', 0.25)}`,
                      overflow: 'hidden',
                      boxShadow: `0 12px 40px rgba(15, 23, 42, 0.35)`
                    }}
                  >
                    <Box
                      sx={{
                        background: alpha('#020617', 0.9),
                        borderBottom: `1px solid ${alpha('#8b5cf6', 0.25)}`,
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.7, sm: 0.9 },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {['#ef4444', '#f59e0b', '#22c55e'].map((color, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '999px',
                            background: color
                          }}
                        />
                      ))}
                      <Typography
                        variant="caption"
                        sx={{
                          ml: 0.5,
                          color: alpha('#e5e7eb', 0.6),
                          fontSize: { xs: 10, sm: 11 },
                          fontFamily: 'monospace'
                        }}
                      >
                        ~/expense-tracker
                      </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 1.6, sm: 2 }, fontFamily: 'monospace' }}>
                      <Stack spacing={0.6}>
                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          <Typography
                            sx={{
                              color: '#22c55e',
                              fontSize: { xs: 11, sm: 13 },
                              wordBreak: 'break-all'
                            }}
                          >
                            $ GET {attemptedPath}
                          </Typography>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45, duration: 0.4 }}
                        >
                          <Typography
                            sx={{
                              color: '#f97316',
                              fontSize: { xs: 11, sm: 13 },
                              fontWeight: 600
                            }}
                          >
                            ✗ HTTP 404 NOT FOUND
                          </Typography>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6, duration: 0.4 }}
                        >
                          <Typography
                            sx={{
                              color: '#a78bfa',
                              fontSize: { xs: 10, sm: 12 }
                            }}
                          >
                            → Suggestion: Navigate to "/" instead
                          </Typography>
                        </motion.div>
                      </Stack>
                    </Box>
                  </Box>
                </motion.div>

                {/* 404 heading */}
                <motion.div variants={itemVariants}>
                  <Typography
                    sx={{
                      fontSize: { xs: '80px', sm: '110px', md: '130px' },
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #a855f7 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 0.9,
                      letterSpacing: '-0.06em',
                      textAlign: 'center',
                      filter: 'drop-shadow(0 10px 35px rgba(79, 70, 229, 0.35))',
                      userSelect: 'none'
                    }}
                  >
                    404
                  </Typography>
                </motion.div>

                {/* Title */}
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '24px', sm: '32px', md: '38px' },
                      color: '#020617',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      textAlign: 'center',
                      px: { xs: 2, sm: 0 }
                    }}
                  >
                    Page Not Found
                  </Typography>
                </motion.div>

                {/* Professional message box */}
                <motion.div variants={itemVariants} style={{ maxWidth: 600, width: '100%' }}>
                  <Box
                    key={messageKey}
                    component={motion.div}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    sx={{
                      background: alpha('#ffffff', 0.9),
                      backdropFilter: 'blur(16px)',
                      borderRadius: 2,
                      border: `1px solid ${alpha('#e5e7eb', 0.9)}`,
                      p: { xs: 2, sm: 3 },
                      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)'
                    }}
                  >
                    <TypingText text={currentMessage} delay={120} />
                  </Box>
                </motion.div>

                {/* Buttons */}
                <motion.div variants={itemVariants}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1.5, sm: 2 }}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/')}
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        color: '#fff',
                        px: { xs: 4, sm: 5 },
                        py: { xs: 1.7, sm: 2 },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: { xs: 15, sm: 17 },
                        fontWeight: 700,
                        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.35)'
                      }}
                    >
                      Back to Dashboard
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleNewMessage}
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{
                        borderColor: '#8b5cf6',
                        color: '#4c1d95',
                        borderWidth: 1.5,
                        px: { xs: 4, sm: 4 },
                        py: { xs: 1.7, sm: 2 },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: { xs: 15, sm: 17 },
                        fontWeight: 700
                      }}
                    >
                      Try Another Tip
                    </Button>
                  </Stack>
                </motion.div>

                {/* Small footer line */}
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#9ca3af',
                      fontSize: 11,
                      textAlign: 'center',
                      maxWidth: 500
                    }}
                  >
                    If you believe this is an error, please contact support or check your bookmarks for the correct URL.
                  </Typography>
                </motion.div>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Soft background blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-30%',
          right: '-25%',
          width: { xs: 420, sm: 640, md: 760 },
          height: { xs: 420, sm: 640, md: 760 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.24), transparent 65%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-25%',
          width: { xs: 460, sm: 700, md: 820 },
          height: { xs: 460, sm: 700, md: 820 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233, 213, 255, 0.24), transparent 65%)',
          filter: 'blur(110px)',
          pointerEvents: 'none'
        }}
      />
    </Box>
  );
}
