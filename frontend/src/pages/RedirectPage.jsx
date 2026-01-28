import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@/components/common/UIComponents';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await fetch(`http://localhost:5000/redirect/${shortCode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: password || '' }),
        });
        const data = await response.json();

        if (data.success && data.originalUrl) {
          // Redirect to the original URL
          window.location.href = data.originalUrl;
        } else if (response.status === 403) {
          // Password protected
          setNeedsPassword(true);
        } else {
          // Not found
          setTimeout(() => {
            window.location.href = '/404';
          }, 1000);
        }
      } catch (error) {
        console.error('Redirect error:', error);
        setTimeout(() => {
          window.location.href = '/404';
        }, 1000);
      }
    };

    if (!needsPassword || password) {
      redirect();
    }
  }, [shortCode, password, needsPassword]);

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
        <div className="glass rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Password Protected</h2>
          <p className="text-gray-300 mb-6">This link is password protected. Please enter the password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setPassword(password)}
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            autoFocus
          />
          <button
            onClick={() => setPassword(password)}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
          >
            Access Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default RedirectPage;
