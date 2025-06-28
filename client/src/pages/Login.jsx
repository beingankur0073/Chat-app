import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton
} from '@mui/material';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents.jsx';
import { useFileHandler, useInputValidation } from '6pp';
import { usernameValidator } from '../utils/validators.js';
import { server } from '../constants/config.js';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth.js';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin(prev => !prev);
  const name = useInputValidation('');
  const bio = useInputValidation('');
  const username = useInputValidation('', usernameValidator);
  const password = useInputValidation('');
  const avatar = useFileHandler('single');

  const dispatch = useDispatch();

  const handleLogin = async e => {
    e.preventDefault();
    const toastId = toast.loading('Logging in...');
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong', {
        id: toastId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async e => {
    e.preventDefault();
    const toastId = toast.loading('Signing Up...');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('avatar', avatar.file);
    formData.append('name', name.value);
    formData.append('bio', bio.value);
    formData.append('username', username.value);
    formData.append('password', password.value);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong', {
        id: toastId
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to right, #3b82f6, #ef4444)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: 3,
            borderRadius: 4,
            background: 'linear-gradient(to bottom right, #1e3a8a, #b91c1c)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography variant="h6" textAlign="center" fontWeight={600}>
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </Typography>

          <form
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}
            onSubmit={isLogin ? handleLogin : handleSignUp}
          >
            {!isLogin && (
              <>
                <Stack
                  position="relative"
                  width="6rem"
                  height="6rem"
                  margin="0 auto"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Avatar
                    src={avatar.preview}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      ':hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                    }}
                  >
                    <CameraAltIcon />
                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography variant="caption" color="error" textAlign="center">
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  size="small"
                  fullWidth
                  label="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  variant="filled"
                  InputProps={{
                        style: { color: 'white' } // text inside the input
                    }}
                    InputLabelProps={{
                        style: { color: 'white' } // label text color
                    }}
                    sx={{
                        '& .MuiFilledInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                        },
                        '& .MuiFilledInput-underline:before': {
                        borderBottomColor: 'rgba(255,255,255,0.6)'
                        },
                        '& .MuiFilledInput-underline:hover:before': {
                        borderBottomColor: '#fff'
                        },
                        '& .MuiFilledInput-underline:after': {
                        borderBottomColor: '#fff'
                        }
                    }}
                />
                <TextField
                  required
                  size="small"
                  fullWidth
                  label="Bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  variant="filled"
                          InputProps={{
                        style: { color: 'white' } // text inside the input
                    }}
                    InputLabelProps={{
                        style: { color: 'white' } // label text color
                    }}
                    sx={{
                        '& .MuiFilledInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                        },
                        '& .MuiFilledInput-underline:before': {
                        borderBottomColor: 'rgba(255,255,255,0.6)'
                        },
                        '& .MuiFilledInput-underline:hover:before': {
                        borderBottomColor: '#fff'
                        },
                        '& .MuiFilledInput-underline:after': {
                        borderBottomColor: '#fff'
                        }
                    }}



                />
              </>
            )}

            <TextField
              required
              size="small"
              fullWidth
              label="Username"
              value={username.value}
              onChange={username.changeHandler}
              variant="filled"
                InputProps={{
                        style: { color: 'white' } // text inside the input
                    }}
                    InputLabelProps={{
                        style: { color: 'white' } // label text color
                    }}
                    sx={{
                        '& .MuiFilledInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                        },
                        '& .MuiFilledInput-underline:before': {
                        borderBottomColor: 'rgba(255,255,255,0.6)'
                        },
                        '& .MuiFilledInput-underline:hover:before': {
                        borderBottomColor: '#fff'
                        },
                        '& .MuiFilledInput-underline:after': {
                        borderBottomColor: '#fff'
                        }
                    }}
            />
            {username.error && (
              <Typography variant="caption" color="error">
                {username.error}
              </Typography>
            )}

            <TextField
              required
              size="small"
              fullWidth
              type="password"
              label="Password"
              value={password.value}
              onChange={password.changeHandler}
              variant="filled"
                InputProps={{
                        style: { color: 'white' } // text inside the input
                    }}
                    InputLabelProps={{
                        style: { color: 'white' } // label text color
                    }}
                    sx={{
                        '& .MuiFilledInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px'
                        },
                        '& .MuiFilledInput-underline:before': {
                        borderBottomColor: 'rgba(255,255,255,0.6)'
                        },
                        '& .MuiFilledInput-underline:hover:before': {
                        borderBottomColor: '#fff'
                        },
                        '& .MuiFilledInput-underline:after': {
                        borderBottomColor: '#fff'
                        }
                    }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isLoading}
              sx={{
                backgroundColor: '#3b82f6',
                ':hover': { backgroundColor: '#1d4ed8' },
                mt: 1
              }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>

            <Typography textAlign="center" variant="body2" color="white">
              OR
            </Typography>

            <Button
              variant="text"
              fullWidth
              onClick={toggleLogin}
              disabled={isLoading}
              sx={{ color: '#fff' }}
            >
              {isLogin ? 'Sign Up Instead' : 'Login Instead'}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
