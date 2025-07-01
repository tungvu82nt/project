import React, { useState, useEffect } from 'react';
import { LoginModal } from '../components/Auth/LoginModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [open, setOpen] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Callback chuyển hướng sau đăng nhập thành công
  const handleLoginSuccess = (user: any) => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/account', { replace: true });
    }
  };

  useEffect(() => {
    if (!open && !user) {
      navigate('/', { replace: true });
    }
  }, [open, user, navigate]);

  return (
    <LoginModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

export default Login;
