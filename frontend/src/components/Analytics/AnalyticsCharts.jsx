import { motion } from 'framer-motion';
import { GlassCard, Badge } from '../common/UIComponents.jsx';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getColorByIndex } from '../../utils/helpers.js';
import { slideUp, containerVariants, itemVariants } from '../../utils/animations.js';

export const AnalyticsChart = ({ title, data, type = 'line' }) => {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={100}
                fill="#8b5cf6"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {renderChart()}
      </GlassCard>
    </motion.div>
  );
};

export const AnalyticsOverview = ({ analytics }) => {
  const stats = [
    { label: 'Total Clicks', value: analytics.totalClicks, color: 'indigo' },
    { label: 'Devices', value: '📊', color: 'purple' },
    { label: 'Countries', value: analytics.countries?.length || 0, color: 'pink' },
    { label: 'Top Browser', value: analytics.browsers?.[0]?.name || '-', color: 'orange' },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={`backdrop-blur-xl bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/10 border border-${stat.color}-500/20 rounded-lg p-4`}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};
