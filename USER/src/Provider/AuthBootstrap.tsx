import React, { useEffect } from 'react';
import { useAuthStore } from '../Middleware/useAuthStoreWithLocal';
import { auth_api_handler } from '../Api/Api_Handler/auth_api';

/**
 * accessToken khong con duoc persist (xem useAuthStoreWithLocal.ts), nen moi
 * khi mo lai app (reload trang, mo tab moi) accessToken se la null cho du
 * nguoi dung van dang dang nhap - refresh_token (cookie httpOnly) van con.
 *
 * Component nay chay 1 lan luc app khoi dong: neu con thong tin profile cu
 * (id) nhung chua co accessToken, thu silent-refresh de lay accessToken moi
 * truoc khi router quyet dinh redirect. Khong render gi ca, chi chay effect.
 */
const AuthBootstrap: React.FC = () => {
  useEffect(() => {
    const { id, accessToken, setAuth, clearAuth, setBootstrapped } = useAuthStore.getState();

    if (accessToken || !id) {
      setBootstrapped(true);
      return;
    }

    auth_api_handler.RefreshToken()
      .then((res) => {
        const { userName, email, userImg, id: currentId } = useAuthStore.getState();
        setAuth(res.data.accessToken, userName, email ?? null, userImg ?? null, currentId);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => {
        setBootstrapped(true);
      });
  }, []);

  return null;
};

export default AuthBootstrap;
