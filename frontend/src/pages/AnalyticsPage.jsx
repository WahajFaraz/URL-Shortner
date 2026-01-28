import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, Button, Spinner } from '@/components/common/UIComponents';
import { AnalyticsChart, AnalyticsOverview } from '@/components/Analytics/AnalyticsCharts';
import { urlService } from '@/services';
import { containerVariants, itemVariants } from '@/utils/animations';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const { data } = await urlService.getUrlAnalytics(id);
      setAnalytics(data.analytics);
    } catch (error) {
      toast.error('Failed to fetch analytics');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <GlassCard>
        <p className="text-center text-gray-600 dark:text-gray-400">No data available</p>
      </GlassCard>
    );
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="initial" animate="animate">
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h1 className="text-3xl font-bold">Analytics 📊</h1>
          <p className="text-gray-600 dark:text-gray-400">Detailed insights for your short URL</p>
        </GlassCard>
      </motion.div>

      {analytics && (
        <>
          <AnalyticsOverview analytics={analytics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsChart
              title="Clicks Over Time"
              data={analytics.dailyClicks}
              type="line"
            />
            <AnalyticsChart
              title="Device Type Distribution"
              data={analytics.devices}
              type="pie"
            />
            <AnalyticsChart
              title="Top Browsers"
              data={analytics.browsers}
              type="bar"
            />
            <AnalyticsChart
              title="Clicks by Country"
              data={analytics.countries}
              type="bar"
            />
          </div>
        </>
      )}

      <motion.div variants={itemVariants}>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
