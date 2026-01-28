import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/common/UIComponents';
import { LoginForm, RegisterForm } from '@/components/Auth/AuthForms';
import { slideUp, containerVariants, itemVariants } from '@/utils/animations';

const AuthPage = ({ isLogin = true }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-md w-full space-y-8">
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            URLShort
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard>
            {isLogin ? <LoginForm /> : <RegisterForm />}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => navigate(isLogin ? '/register' : '/login')}
                  className="ml-2 font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>🔐 Your data is secure and encrypted</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
