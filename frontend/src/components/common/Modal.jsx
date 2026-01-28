import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations.js';
import { Button } from './UIComponents.jsx';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
      {...fadeIn}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        {children}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, title, message, onConfirm, isDangerous = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-gray-600 dark:text-gray-400">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant={isDangerous ? 'danger' : 'primary'} onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  </Modal>
);

export const Toast = ({ message, type = 'success' }) => (
  <motion.div
    className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
  >
    {message}
  </motion.div>
);

export const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      {...fadeIn}
    >
      <motion.div
        className="w-12 h-12 border-4 border-white/20 border-t-indigo-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};
