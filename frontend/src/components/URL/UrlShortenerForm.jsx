import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, Button, Input, Select } from '../common/UIComponents.jsx';
import { urlService } from '../../services/index.js';
import { copyToClipboard } from '../../utils/helpers.js';
import toast from 'react-hot-toast';
import { slideUp, containerVariants, itemVariants } from '../../utils/animations.js';

export const UrlShortenerForm = ({ onUrlCreated, editData }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    title: '',
    description: '',
    expirationType: 'never',
    expirationDate: '',
    expirationClicks: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (editData) {
      setFormData({
        originalUrl: editData.originalUrl || '',
        customAlias: editData.customAlias || '',
        title: editData.title || '',
        description: editData.description || '',
        expirationType: editData.expirationDate ? 'date' : editData.expirationClicks ? 'clicks' : 'never',
        expirationDate: editData.expirationDate ? editData.expirationDate.split('T')[0] : '',
        expirationClicks: editData.expirationClicks || '',
        tags: editData.tags?.join(', ') || '',
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.originalUrl) newErrors.originalUrl = 'URL is required';
    if (formData.originalUrl && !formData.originalUrl.startsWith('http')) {
      newErrors.originalUrl = 'URL must start with http:// or https://';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      const payload = {
        ...formData,
        tags,
        expirationClicks: formData.expirationClicks ? parseInt(formData.expirationClicks) : null,
      };

      let data;
      if (editData) {
        // Update existing URL
        const { data: updateResponse } = await urlService.updateUrl(editData._id, payload);
        data = updateResponse;
        toast.success('Short URL updated successfully!');
      } else {
        // Create new URL
        const { data: createResponse } = await urlService.createUrl(payload);
        data = createResponse;
        const fullUrl = `${window.location.origin}/${data.shortUrl.shortCode}`;
        await copyToClipboard(fullUrl);
        toast.success('Short URL created and copied to clipboard!');
      }
      
      if (!editData) {
        setFormData({
          originalUrl: '',
          customAlias: '',
          title: '',
          description: '',
          expirationType: 'never',
          expirationDate: '',
          expirationClicks: '',
          isPassword: false,
          password: '',
          tags: '',
        });
      }

      onUrlCreated?.(data.shortUrl || data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save short URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6" {...slideUp}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="originalUrl"
          type="url"
          label="Original URL"
          placeholder="https://example.com/very/long/url"
          value={formData.originalUrl}
          onChange={handleChange}
          error={errors.originalUrl}
        />
        <Input
          name="customAlias"
          type="text"
          label="Custom Alias (Optional)"
          placeholder="my-link"
          value={formData.customAlias}
          onChange={handleChange}
          error={errors.customAlias}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="title"
          type="text"
          label="Title (Optional)"
          placeholder="My Link Title"
          value={formData.title}
          onChange={handleChange}
        />
        <Input
          name="tags"
          type="text"
          label="Tags (Comma separated)"
          placeholder="marketing,social"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>

      <Input
        name="description"
        as="textarea"
        label="Description (Optional)"
        placeholder="Link description"
        value={formData.description}
        onChange={handleChange}
        className="resize-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          name="expirationType"
          label="Expiration Type"
          value={formData.expirationType}
          onChange={handleChange}
        >
          <option value="never">Never</option>
          <option value="date">By Date</option>
          <option value="clicks">By Clicks</option>
        </Select>

        {formData.expirationType === 'date' && (
          <Input
            name="expirationDate"
            type="date"
            label="Expiration Date"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        )}

        {formData.expirationType === 'clicks' && (
          <Input
            name="expirationClicks"
            type="number"
            label="Max Clicks"
            placeholder="1000"
            value={formData.expirationClicks}
            onChange={handleChange}
          />
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Short URL'}
      </Button>
    </motion.form>
  );
};
