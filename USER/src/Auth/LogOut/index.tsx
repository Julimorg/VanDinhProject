import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/Store/auth';
import Loading from '@/Components/Loading';

const Logout: React.FC = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const navigate = useNavigate();
  const [loading] = useState(true);

  useEffect(() => {
    clearTokens();
    localStorage.removeItem('isAuthenticated');

    const timer = setTimeout(() => {
      navigate('/');
    }, 800);

    return () => clearTimeout(timer);
  }, [clearTokens, navigate]);

  return <>{loading && <Loading />}</>;
};

export default Logout;
