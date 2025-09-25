// src/pages/LoginSuccess.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');
    const userid = params.get('userid');
    const userPublicId = params.get('userPublicId') ;
    const role = params.get('role')
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('userId' , userid) ;
      localStorage.setItem('userRole' , role) ;
      localStorage.setItem('userPublicId' , userPublicId) ;
      // navigate('/');   // Điều hướng kiểu này có thể không re-render lại Header -> hiển thị chưa login
                          // Lúc đó lại phải thêm location vào useEffect của Header
      window.location.href = '/'; // Reload toàn bộ trang web
    }
  }, []);

  return <div>Login...</div>;
}
