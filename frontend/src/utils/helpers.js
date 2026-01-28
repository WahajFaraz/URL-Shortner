export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const truncateUrl = (url, maxLength = 50) => {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
};

export const getColorByIndex = (index) => {
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
  ];
  return colors[index % colors.length];
};
