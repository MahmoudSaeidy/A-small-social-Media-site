import React, { useEffect, useState } from 'react'
import { usePost } from '../../context/PostContext';
import axios from 'axios';

export const ProfilePosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;
      
      const userData = JSON.parse(userString);
      const response = await axios.get(`https://tarmeezacademy.com/api/v1/users/${userData.id}/posts`);
      setUserPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">My Posts ({userPosts.length})</h3>
      <div className="space-y-6">
        {userPosts.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold text-lg">{post.title}</h4>
            <p className="text-gray-600">{post.body}</p>
            <img src = {post.image} />
            <div className="text-sm text-gray-500 mt-2">
              Comments: {post.comments_count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};