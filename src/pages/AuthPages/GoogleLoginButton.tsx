// GoogleLoginButton.js
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:8000/auth/google/', {
          access_token: tokenResponse.access_token,
        });
        console.log('Login successful', res.data);
        // Optionally store token in localStorage or context
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    onError: () => {
      console.error('Google Login Failed');
    },
  });

  return (
    <button onClick={() => login()}>
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
