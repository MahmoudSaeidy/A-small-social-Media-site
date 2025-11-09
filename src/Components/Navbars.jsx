import React, { useState, useEffect } from 'react';
import {Container,Box,Button,Typography,Modal,Divider} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { usePost } from '../../context/PostContext';
import avatarImg from "../assets/avatar.jpg";

// Constants
const API_BASE_URL = 'https://tarmeezacademy.com/api/v1';
const MODAL_STYLE = {
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  border: "none",
  top: "40%",
  borderRadius: '16px'
};

// Custom Hooks
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({ name: '', profile_image: avatarImg });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser({
          name: userData.name,
          profile_image: userData.profile_image || avatarImg
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        clearAuthData();
      }
    }
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken('');
    setUser({ name: '', profile_image: '' });
    setIsLoggedIn(false);
  };

  const setAuthData = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser({
      name: userData.name,
      profile_image: userData.profile_image || avatarImg
    });
    setIsLoggedIn(true);
  };

  return { isLoggedIn, token, user, setAuthData, clearAuthData };
};

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
};

// Components
const FileUpload = ({ label, fileName, onFileChange, accept = "*" }) => (
  <div className="file-upload-container">
    <input 
      type="file" 
      id="fileInput"
      className="file-input"
      onChange={onFileChange}
      accept={accept}
    />
    <label htmlFor="fileInput" className="custom-file-button">
      {label}
    </label>
    <span className="file-name">{fileName || 'No file chosen'}</span>
  </div>
);

const AuthModal = ({ isOpen, onClose, onSubmit, title, isRegister = false}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    image: null
  });
  const [fileName, setFileName] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFileName('');
  };

  const handleClose = () => {
    onClose();
    setFileName('');
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box 
        sx={{ 
          ...MODAL_STYLE,
          width: { xs: '90%', sm: '400px' },
          maxWidth: '400px'
        }} 
        className="modal"
      >
        <Typography sx = {{fontWeight:"bold" , marginBottom:"20px" , fontSize:"26px"}} variant="h5" component="h2" className="modal-title">
          {title}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Divider className="modal-divider" sx ={{marginBottom:"30px"}} />
          
          {isRegister && (
            <>
              <input
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter Your Name"
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter Your Email"
                type="email"
                required
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
              />
            </>
          )}
          
          <input
            value={formData.username}
            onChange={handleInputChange('username')}
            placeholder="Enter Your Username"
            type="text"
            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
          />
          <input
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder="Enter Your Password"
            type="password"
            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
          />

          {isRegister && (
            <FileUpload
              label="Choose Profile Image"
              fileName={fileName}
              onFileChange={handleFileChange}
              accept="image/*"
            />
          )}

          <Divider className="modal-divider" />
          
          <div className="modal-actions flex gap-3 mt-6">
            <Button onClick={handleClose} variant="contained" className="btn-secondary">
              Close
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

const CreatePostModal = ({ isOpen, onClose, onSubmit, token }) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image: null
  });
  const [fileName, setFileName] = useState('');

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData, token);
    setFormData({ title: '', body: '', image: null });
    setFileName('');
  };

  const handleClose = () => {
    onClose();
    setFormData({ title: '', body: '', image: null });
    setFileName('');
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box 
        sx={{ 
          ...MODAL_STYLE,
          width: { xs: '90%', sm: '500px' },
          maxWidth: '500px'
        }} 
        className="modal"
      >
        <Typography sx = {{fontWeight:"bold" , marginBottom:"20px"}} variant="h5" component="h2" className="modal-title">
          Create New Post
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Divider sx = {{marginBottom:"30px"}} className="modal-divider" />
          
          <input
            value={formData.title}
            onChange={handleInputChange('title')}
            placeholder="Enter Post Title"
            type="text"
            className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <textarea
            value={formData.body}
            onChange={handleInputChange('body')}
            placeholder="Enter Post Body"
            className="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 min-h-[100px]"
          />

          <FileUpload
            label="Choose Image"
            fileName={fileName}
            onFileChange={handleFileChange}
            accept="image/*"
          />

          <Divider className="modal-divider" />
          
          <div className="modal-actions flex gap-2 mt-6">
            <Button onClick={handleClose} variant="contained" className="btn-secondary">
              Close
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

// Main Component
export const Nav = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { refreshPosts } = usePost();
  
  const { isLoggedIn, token, user, setAuthData, clearAuthData } = useAuth();
  const loginModal = useModal();
  const registerModal = useModal();
  const createPostModal = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showNotification = (message, variant = 'success') => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      autoHideDuration: 3000,
    });
  };

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: formData.username,
        password: formData.password
      });

      setAuthData(response.data.token, response.data.user);
      loginModal.close();
      showNotification('You have been logged in successfully');
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Login failed', 
        'error'
      );
    }
  };

  const handleRegister = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("name", formData.name);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(`${API_BASE_URL}/register`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const userData = response.data.user;
      const profileImage = userData.profile_image && userData.profile_image !== null 
      ? userData.profile_image 
      : avatarImg;

      setAuthData(response.data.token, {
            ...userData,
            profile_image: profileImage
          });
          
          registerModal.close();
          showNotification('Your account has been created successfully');
        } catch (error) {
          showNotification(
            error.response?.data?.message || 'Registration failed', 
            'error'
          );
        }
      }

  const handleLogout = () => {
    clearAuthData();
    showNotification('You have successfully logged out', 'info');
  };

  const handleCreatePost = async (formData) => {
    if (!formData.title.trim() || !formData.body.trim()) {
      showNotification('Please fill in title and body', 'error');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("body", formData.body);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await axios.post(`${API_BASE_URL}/posts`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      refreshPosts();
      createPostModal.close();
      showNotification('Post created successfully!');
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to create post', 
        'error'
      );
    }
  };

  return (
    <div>
      <nav className="sticky top-0 bg-[#784bfb] text-white w-full rounded-b-xl shadow-md z-50 px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl">Tarmeez</h1>
            </div>
            
            {/* القائمة للأجهزة الكبيرة - تظهر من الشاشات المتوسطة فما فوق */}
            <ul className="hidden md:flex ml-5 items-center">
              <li><a href="/" className='mr-2 hover:text-gray-300 transition p-2 rounded-2xl'>Home</a></li> 
              <li><a href="/profile" className='hover:text-gray-300 transition p-2 rounded-2xl'>Profile</a></li> 
            </ul>

            {/* زر القائمة المتنقلة - يظهر فقط في الشاشات الصغيرة */}
            <button 
              className="md:hidden ml-4 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
          
          <div className="nav-actions">
            {isLoggedIn ? (
              <div className="flex items-center">
                <img 
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-5 rounded-full object-cover" 
                  src={user.profile_image} 
                  alt="Profile" 
                  onError={(e) => {
                    e.target.src = avatarImg;
                  }}
                />
                <div className="hidden sm:block mr-2 sm:mr-5 font-bold text-sm sm:text-base">
                  {user.name}
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="contained" 
                  color="error"
                  size="small"
                  className="text-xs sm:text-sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 sm:gap-3">
                <Button 
                  onClick={loginModal.open} 
                  variant="contained" 
                  color="success"
                  size="small"
                  className="text-xs sm:text-sm"
                >
                  Login
                </Button>
                <Button 
                  onClick={registerModal.open} 
                  variant="contained" 
                  color="success"
                  size="small"
                  className="text-xs sm:text-sm"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* القائمة المتنقلة - تظهر فقط في الشاشات الصغيرة عندما يكون الزر مضغوط */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#784bfb] border-t border-white/20 py-3">
            <ul className="flex flex-col space-y-2">
              <li>
                <a 
                  href="/" 
                  className="block hover:text-gray-300 transition p-2 rounded-2xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
              </li> 
              <li>
                <a 
                  href="/profile" 
                  className="block hover:text-gray-300 transition p-2 rounded-2xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </a>
              </li> 
            </ul>
          </div>
        )}
      </nav>

      {/* Modals */}
      <AuthModal
        isOpen={loginModal.isOpen}
        onClose={loginModal.close}
        onSubmit={handleLogin}
        title="Login"
      />

      <AuthModal
        isOpen={registerModal.isOpen}
        onClose={registerModal.close}
        onSubmit={handleRegister}
        title="Register"
        isRegister={true}
      />

      {isLoggedIn && (
        <>
          <CreatePostModal
            isOpen={createPostModal.isOpen}
            onClose={createPostModal.close}
            onSubmit={handleCreatePost}
            token={token}
          />
          
          <AddIcon
            sx={{
              color: "white",
              fontSize: { xs: '50px', sm: '65px' }
            }}
            onClick={createPostModal.open}
            className="cursor-pointer rounded-4xl fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-[#784bfb] p-2 shadow-lg"
          />
        </>
      )}
    </div>
  );
};