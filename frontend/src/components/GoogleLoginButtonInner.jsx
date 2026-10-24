import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function GoogleLoginButtonInner({ onSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const userInfo = jwtDecode(credentialResponse.credential);

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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
  );
}
