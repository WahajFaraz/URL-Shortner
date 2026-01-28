import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/common/UIComponents';
import { containerVariants, itemVariants } from '@/utils/animations';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '⚡', title: 'Lightning Fast', description: 'Create and share short URLs instantly' },
    { icon: '🎯', title: 'Advanced Analytics', description: 'Track clicks, devices, countries and more' },
    { icon: '🔒', title: 'Secure & Private', description: 'Password protection and expiration controls' },
    { icon: '📊', title: 'Detailed Insights', description: 'Beautiful charts and real-time statistics' },
    { icon: '🎨', title: 'Custom Aliases', description: 'Create memorable short links' },
    { icon: '📱', title: 'QR Codes', description: 'Auto-generated QR codes for every link' },
  ];

  return (
    <motion.div className="space-y-20" variants={containerVariants} initial="initial" animate="animate">
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-4">
          Shorten Your URLs, Amplify Your Impact 🚀
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          The most powerful URL shortener with advanced analytics, custom aliases, and enterprise-grade security.
          Perfect for marketing campaigns, social media, and sharing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <Button size="lg" variant="primary" onClick={() => navigate('/register')} className="w-full sm:w-auto">
            Get Started
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/login')} className="w-full sm:w-auto">
            See Demo
          </Button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div variants={itemVariants}>
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Powerful Features</h2>
          <p className="text-gray-300 text-base sm:text-lg">Everything you need for professional URL shortening</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center h-full">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div variants={itemVariants}>
        <GlassCard className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10 text-center py-12 sm:py-16 mx-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Shorten Your First Link?</h2>
          <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">Join thousands of marketers and creators using URLShort</p>
          <Button size="lg" variant="primary" onClick={() => navigate('/register')} className="w-full sm:w-auto">
            Start Now - It's Free
          </Button>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
