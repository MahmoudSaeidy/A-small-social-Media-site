// Posts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { CircularProgress, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { usePost } from '../../context/PostContext';
import { UserContext } from "../../context/contextOfPosts";
import { useContext } from 'react';
import { PostCard } from './PostCard';
import { EditModal } from './EditModal';

export const Posts = ({ isProfilePage = false }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let contextOfPost = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [PostIdForDelete, setPostIdForDelete] = useState("");
  const [userIdForPost, setUserIdForPost] = useState("");
  const [idOfPost, setIdOfPost] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [openEditBox, setOpenEditBox] = useState(false);
  const [fileName, setFileName] = useState('');
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [imageOfPost, setImageOfPost] = useState("");
  const [userPosts, setUserPosts] = useState([]);

  const { shouldRefresh } = usePost();


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

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id;

  const hasValidImage = (image) => {
    return image && 
           typeof image === 'string' && 
           image.trim() !== '' && 
           image !== 'null' && 
           image !== 'undefined';
  };


  const handleClickOpen = (postId, authorId) => {
    setPostIdForDelete(postId);
    setUserIdForPost(authorId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPostIdForDelete("");
    setUserIdForPost("");
  };

  const handleOpenEdit = () => setOpenEditBox(true);
  
  const handleCloseEdit = () => {
    setOpenEditBox(false);
    setFileName('');
    setUpdateTitle("");
    setUpdateBody("");
    setUpdateImage("");
    setImageOfPost("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setUpdateImage(file);
    }
  };

  const handlePostClick = (postId) => {
    if (localStorage.getItem("token")) {
      navigate(`/post/${postId}`);
    } else {
      enqueueSnackbar('Please sign in to view comments', { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    }
  };

  const handleDeletePost = async () => {
    if (!PostIdForDelete || !userIdForPost) {
      enqueueSnackbar('No post selected for deletion', { variant: 'error' });
      return;
    }

    if (currentUser && currentUser.id === userIdForPost) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          enqueueSnackbar('Please login first', { variant: 'error' });
          return;
        }

        await axios.delete(`https://tarmeezacademy.com/api/v1/posts/${PostIdForDelete}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        enqueueSnackbar('Post deleted successfully!', { variant: 'success' });
        
        if (isProfilePage) {
          GetUserPosts();
        } else {
          fetchPosts(1, true);
        }
        handleClose();
        
      } catch (error) {
        console.error('Error deleting post:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete post';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('You can only delete your own posts', { variant: 'error' });
      handleClose();
    }
  };

  async function handleOpenEditBox(idOfElement) {
    try {
      const response = await axios.get(`https://tarmeezacademy.com/api/v1/posts/${idOfElement}`);
      const myPost = response.data.data;

      const currentUser = getCurrentUser();
      if (!currentUser) {
        enqueueSnackbar('Please login first', { variant: 'error' });
        return;
      }

      if (myPost.author.id !== currentUser.id) {
        enqueueSnackbar('You can edit only your posts', { variant: 'error' });
        return;
      }

      setIdOfPost(idOfElement);
      setUpdateTitle(myPost.title);
      setUpdateBody(myPost.body);
      setImageOfPost(myPost.image);
      
      handleOpenEdit();
    } catch (error) {
      console.error('Error fetching post:', error);
      enqueueSnackbar('Failed to load post for editing', { variant: 'error' });
    }
  }

  const handleConfirmEdit = async (event) => {
    event.preventDefault();

    if (!updateTitle.trim() || !updateBody.trim()) {
      enqueueSnackbar('Please write title and body', { variant: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append("title", updateTitle);
    formData.append("body", updateBody);
    formData.append("_method", "PUT");

    if (updateImage && updateImage instanceof File) {
      formData.append("image", updateImage);
    }

    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.post(`https://tarmeezacademy.com/api/v1/posts/${idOfPost}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.data && response.data.message) {
        enqueueSnackbar(response.data.message, { variant: 'success' });
      } else {
        enqueueSnackbar('Updated successfully!', { variant: 'success' });
      }
      
      handleCloseEdit();
      setUpdateImage(null);
      setFileName('');
      
      if (isProfilePage) {
        GetUserPosts();
      } else {
        setPage(1);
        await fetchPosts(1, true);
      }
      
    } catch (error) {
      console.error('Error Message:', error);
      const errorMessage = error.response?.data?.message || 'Error';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };


  const fetchPosts = async (pageNum, isRefresh = false) => {
    try {
      const response = await axios.get(`https://tarmeezacademy.com/api/v1/posts?page=${pageNum}&limit=5`);
      const newPosts = response.data.data;
      if (pageNum === 1 || isRefresh) {
        contextOfPost.setArrayOfPosts(newPosts);
      } else {
        contextOfPost.setArrayOfPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      setHasMore(newPosts.length > 0);
    } catch (error) {
      setHasMore(false);
    }
  };

  const GetUserPosts = async () => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        enqueueSnackbar('Please login first', { variant: 'error' });
        return;
      }

      const response = await axios.get(`https://tarmeezacademy.com/api/v1/users/${currentUser.id}/posts`);
      const myData = response.data.data;
      setUserPosts(myData);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      enqueueSnackbar('Failed to load user posts', { variant: 'error' });
    }
  };

  const loadMore = () => {
    if (hasMore && !isProfilePage) {
      const nextPage = page + 1;
      setPage(nextPage); 
      fetchPosts(nextPage, false);
    }
  };

  const refreshPosts = () => {
    if (isProfilePage) {
      GetUserPosts();
    } else {
      setPage(1);
      fetchPosts(1, true);
    }
  };

  useEffect(() => {
    if (isProfilePage) {
      GetUserPosts();
    } else {
      fetchPosts(1, true);
    }
  }, [shouldRefresh, isProfilePage]);

  
  const postsToShow = isProfilePage ? userPosts : contextOfPost.arrayOfPosts;

  return (
    <>
      <InfiniteScroll
        dataLength={postsToShow.length}
        next={loadMore}
        hasMore={hasMore && !isProfilePage}
        loader={
          !isProfilePage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress sx={{ color: '#784bfb' }} />
            </Box>
          )
        }
        endMessage={
          !isProfilePage && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography variant="body1">
                🎉 You have seen all the posts
              </Typography>
            </Box>
          )
        }
        refreshFunction={refreshPosts}
        pullDownToRefresh={!isProfilePage}
        pullDownToRefreshThreshold={50}
      >
        <div className='mt-10 posts flex flex-col gap-12'>
        {postsToShow.map((element) => {
            const canEdit = currentUserId && element.author.id === currentUserId;
            
            return (
            <PostCard
                key={element.id}
                element={element}
                canEdit={canEdit}
                onEditClick={handleOpenEditBox}
                onDeleteClick={handleClickOpen}
                onPostClick={handlePostClick}
            />
            );
        })}
</div>
      </InfiniteScroll>

      {/* Modal and Dialog المشتركة */}
      <EditModal
        open={openEditBox}
        onClose={handleCloseEdit}
        updateTitle={updateTitle}
        setUpdateTitle={setUpdateTitle}
        updateBody={updateBody}
        setUpdateBody={setUpdateBody}
        imageOfPost={imageOfPost}
        fileName={fileName}
        onFileChange={handleFileChange}
        onSubmit={handleConfirmEdit}
        hasValidImage={hasValidImage}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this post? You will not be able to recover its information.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{fontWeight:"bold", fontSize:"15px"}} onClick={handleClose}>Cancel</Button>
          <Button sx={{fontWeight:"bold", fontSize:"15px"}} onClick={handleDeletePost} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Posts;