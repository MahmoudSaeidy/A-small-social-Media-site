// Profile.jsx
import React, { useEffect, useState } from 'react';
import { Nav } from "../src/Components/Navbars";
import Container from '@mui/material/Container';
import { PostProvider } from "../context/PostContext.jsx";
import avatarImg from "../src/assets/avatar.jpg";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Posts } from '../src/Components/Posts.jsx';

export const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [postCount, setPostCount] = useState("");
  const [commentCount, setCommentCount] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return null;
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  useEffect(() => {
    GetUserData();
  }, []);

  const GetUserData = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      enqueueSnackbar('Please login first', { variant: 'error' });
      setIsLoading(false);
      return;
    }

    axios.get(`https://tarmeezacademy.com/api/v1/users/${currentUser.id}`)
      .then((response) => {
        const profileData = response.data.data;
        setEmail(profileData.email || "");
        setName(profileData.name || "");
        setUserName(profileData.username || "");
        setPostCount(profileData.posts_count || 0);
        setCommentCount(profileData.comments_count || 0);

        if (profileData.profile_image) {
          setImage(profileData.profile_image);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        enqueueSnackbar('Failed to load user data', { variant: 'error' });
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <PostProvider>
        <Container maxWidth="md">
          <Nav />
          <div className="flex justify-center items-center my-15">
            <div>Loading...</div>
          </div>
        </Container>
      </PostProvider>
    );
  }

  return (
    <PostProvider>
      <Container maxWidth="md">
        <Nav />
        <div className="mainBox bg-white flex justify-between p-8 gap-8 items-center my-8 rounded-2xl shadow-lg">
          <div className='flex gap-5 items-center'>
          <img 
            className='w-24 h-24 rounded-full object-cover border-4 border-purple-200'
            src={image} 
            alt="Profile" 
            onError={(e) => {
              e.target.src = avatarImg;
            }}
          />
            <div className='flex flex-col gap-2'>
              <div className='text-2xl font-bold'>{name}</div>
              <div className="text-gray-600">@{userName}</div>
              <div className="text-gray-500">{email}</div>
            </div>
          </div>
          <div className='flex justify-start flex-col gap-4 flex-1'>
            <div className="text-center">
              <span className='text-3xl font-bold text-purple-600'>{postCount}</span>
              <div className="text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <span className='text-3xl font-bold text-purple-600'>{commentCount}</span>
              <div className="text-gray-600">Comments</div>
            </div>
          </div>
        </div>

        {/* استخدام Posts مع prop isProfilePage */}
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-6">My Posts</h2>
          <Posts isProfilePage={true} />
        </div>
      </Container>
    </PostProvider>
  );
};