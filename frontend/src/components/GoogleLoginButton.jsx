import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GoogleLoginButton({ onSuccess }) {
  // ⬇️ چک کن Client ID لود شده یا نه
  console.log('Google Client ID loaded:', !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log('API_URL:', API_URL);

  const handleSuccess = async (credentialResponse) => {
    try {
      const userInfo = jwtDecode(credentialResponse.credential);
      console.log('Google user decoded:', userInfo);

      // ⚠️ مسیر API رو بر اساس backend خودت تنظیم کن
      // اگه console خطای 404 داد، شاید مسیرت /api/customer/auth/google باشه
     const res = await axios.post(`${API_URL}/api/auth/google`, {
        email: userInfo.email,
        name: userInfo.name,
        googleId: userInfo.sub,
        avatar: userInfo.picture,
      });

      localStorage.setItem('token', res.data.token);
      onSuccess?.(res.data);
    } catch (err) {
      console.error('Google login error:', err.response?.data || err.message);
      alert('ورود با گوگل ناموفق بود: ' + (err.response?.data?.error || 'خطای ناشناخته'));
    }
  };

  return (
    <div className="flex justify-center my-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.error('Google Login onError triggered');
          alert('ورود با گوگل ناموفق بود');
        }}
        text="signin_with"
        shape="pill"
        locale="fa"
      />
    </div>
  );
}