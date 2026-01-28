import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '@/components/common/UIComponents';
import { UrlShortenerForm } from '@/components/URL/UrlShortenerForm';
import { containerVariants, itemVariants } from '@/utils/animations';

const CreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [urlData, setUrlData] = useState(location.state?.url || null);

  useEffect(() => {
    // If editing but no data in state, redirect
    if (id && !urlData) {
      navigate('/dashboard');
    }
  }, [id, urlData, navigate]);

  const handleUrlCreated = (url) => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const isEditing = !!id || !!urlData;

  return (
    <motion.div className="max-w-2xl mx-auto space-y-8" variants={containerVariants} initial="initial" animate="animate">
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Link' : 'Create Short URL'} 🔗</h1>
            {isEditing && (
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
            )}
          </div>
          <p className="text-gray-300">
            {isEditing ? 'Update your short URL details' : 'Convert your long URLs into memorable short links with advanced features'}
          </p>
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard>
          <UrlShortenerForm onUrlCreated={handleUrlCreated} editData={urlData} />
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard className="bg-gradient-to-r from-indigo-500/10 to-purple-600/10">
          <h3 className="font-semibold mb-4">✨ Features</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ Custom short codes and aliases</li>
            <li>✓ Link expiration by date or clicks</li>
            <li>✓ QR code generation</li>
            <li>✓ Advanced analytics & tracking</li>
            <li>✓ Tag and organize your links</li>
          </ul>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default CreatePage;
