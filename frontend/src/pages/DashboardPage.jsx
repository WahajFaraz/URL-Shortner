import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { GlassCard, Button, Input, Spinner } from '@/components/common/UIComponents';
import { urlService } from '@/services';
import { UrlCard } from '@/components/URL/UrlCard';
import { containerVariants, itemVariants, slideUp } from '@/utils/animations';
import { ConfirmModal } from '@/components/common/Modal';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUrls();
  }, [page, isAuthenticated, navigate, searchQuery]);

  useEffect(() => {
    // Set user loading to false once we have user data
    if (user) {
      setUserLoading(false);
    }
  }, [user]);

  const fetchUrls = async () => {
    setIsLoading(true);
    try {
      const { data } = await urlService.getUserUrls({ page, limit: 10, search: searchQuery });
      setUrls(data.urls);
      setTotal(data.total);
    } catch (error) {
      toast.error('Failed to fetch URLs');
      console.error('Fetch URLs error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total clicks from the URLs data
  const totalClicks = urls.reduce((sum, url) => sum + (url.totalClicks || 0), 0);

  const handleDelete = async (id) => {
    try {
      await urlService.deleteUrl(id);
      toast.success('URL deleted successfully');
      fetchUrls();
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const handleViewAnalytics = (id) => {
    navigate(`/analytics/${id}`);
  };

  const handleEdit = (url) => {
    navigate(`/edit/${url._id}`, { state: { url } });
  };

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="initial" animate="animate">
      <motion.div variants={itemVariants}>
        <GlassCard>
          {userLoading ? (
            <div className="text-center py-4">
              <Spinner />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back,{' '}
                <motion.button
                  onClick={() => navigate('/profile')}
                  className="text-indigo-400 hover:text-indigo-300 underline-offset-2 hover:underline transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user?.name || 'User'}
                </motion.button>
                ! 👋
              </h1>
              <p className="text-gray-300">
                You have created <span className="font-semibold text-indigo-400">{total || 0}</span> links with{' '}
                <span className="font-semibold text-indigo-400">{totalClicks}</span> total clicks
              </p>
            </>
          )}
        </GlassCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search your links..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="flex-1"
            />
            <Button variant="primary" onClick={() => navigate('/create')}>
              + Create New
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300 mb-4">No short URLs yet. Create one to get started!</p>
              <Button variant="primary" onClick={() => navigate('/create')}>
                Create Your First Link
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {urls.map(url => (
                  <UrlCard
                    key={url._id}
                    url={url}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                    onViewAnalytics={handleViewAnalytics}
                  />
                ))}
              </div>

              {total > 10 && (
                <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
                  <Button
                    variant="secondary"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-300">
                    Page {page} of {Math.ceil(total / 10)}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(total / 10)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </GlassCard>
      </motion.div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Delete URL"
        message="Are you sure you want to delete this short URL? This action cannot be undone."
        onConfirm={() => {
          handleDelete(deleteModal.id);
          setDeleteModal({ isOpen: false, id: null });
        }}
        isDangerous
      />
    </motion.div>
  );
};

export default DashboardPage;
