import { Fab, Zoom } from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButtons() {
  const navigate = useNavigate();

  return (
    <Zoom in={true} timeout={400}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/add')}
          sx={{
            width: 64,
            height: 64,
            backgroundColor: '#1a237e',
            boxShadow: '0 8px 24px rgba(26, 35, 126, 0.25)',
            '&:hover': {
              backgroundColor: '#0d1642',
              boxShadow: '0 12px 32px rgba(26, 35, 126, 0.35)'
            }
          }}
        >
          <Add sx={{ fontSize: 28 }} />
        </Fab>
      </motion.div>
    </Zoom>
  );
}
