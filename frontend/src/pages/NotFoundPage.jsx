import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/common/UIComponents';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-9xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.div>

        <GlassCard className="max-w-md">
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Oops! The page you're looking for has been shortened out of existence.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={() => navigate('/')}>
              Go Home
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
