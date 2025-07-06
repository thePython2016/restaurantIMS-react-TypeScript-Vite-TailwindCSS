import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import MicrosoftIcon from '@mui/icons-material/Computer';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Login Data:', data);
      const success = await login(data.username, data.password);
      
      if (success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa', pt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', mt: 4 }}>
        <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
          Login
        </Typography>
        
        {/* Error/Success Messages */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
          <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Box textAlign="right">
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>Or Sign In With</Divider>

        <Stack spacing={2}>
          <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth>
            Continue with Gmail
          </Button>
          <Button variant="outlined" startIcon={<MicrosoftIcon />} fullWidth>
            Continue with Microsoft
          </Button>
          <Button variant="outlined" startIcon={<AppleIcon />} fullWidth>
            Continue with Apple ID
          </Button>
        </Stack>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => navigate('/signup')}
              sx={{ cursor: 'pointer' }}
            >
              Sign up
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Or{' '}
            <Link 
              component="button" 
              variant="body2" 
              onClick={() => navigate('/signin')}
              sx={{ cursor: 'pointer' }}
            >
              use the original sign in page
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
