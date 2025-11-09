// PostDetails.jsx
import React, { useEffect, useState } from 'react'
import {Nav} from "../src/Components/Navbars"
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import avatarImg from "../src/assets/account-avatar-profile-user-11.svg"
import avatarMyProfile from "../src/assets/avatar.jpg"
import { Divider } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import PublicIcon from '@mui/icons-material/Public';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import {PostProvider} from "../context/PostContext.jsx"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { SnackbarProvider, useSnackbar } from 'notistack';



export const PostDetails = () => {

    const user = localStorage.getItem("user")
    const userData = JSON.parse(user)

    const token = localStorage.getItem("token")
    console.log(token)
    console.log(userData)
    const myImageProfile = userData.profile_image

    const { enqueueSnackbar } = useSnackbar();
    const [userName , setUserName] = useState("")
    const [userProfileImage , setUserProfileImage] = useState("")
    const [imageOfPost , setimageOfPost] = useState("")
    const [title , setTitle] = useState("")
    const [body , setBody] = useState("")
    const [commentsCount , setCommentsCount] = useState("")
    const [timeOfPosts , setTimeOfPost] = useState("")
    const [commentsArray , setCommentsArray] = useState([])
    const [CommentBody , setCommentBody] = useState("")
    console.log(CommentBody)


    const { id } = useParams()

    useEffect(()=>{
            const myData = axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`).then((response)=>{
                const userdata = response.data.data
                setUserName(userdata.author.username)
                setUserProfileImage(userdata.author.profile_image)
                setimageOfPost(userdata.image)
                setTitle(userdata.title)
                setBody(userdata.body)
                setCommentsCount(userdata.comments_count)
                setTimeOfPost(userdata.created_at)
                setCommentsArray(userdata.comments)
        })
    },[])

    function handleCreateNewComment(e){
        e.preventDefault();
        const params = {
            body : CommentBody
        }
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, params , {
            headers : {
                'Authorization' : `Bearer ${token}`,
            }
        })    .then(() => {
        return axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`);
    })
    .then((response) => {
        const updatedPost = response.data.data;
        setCommentsArray(updatedPost.comments);
        setCommentsCount(updatedPost.comments_count);
        setCommentBody("");
        enqueueSnackbar('You have been created a new comment', { 
        variant: 'success',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    })
    .catch((error) => {
        enqueueSnackbar('Error Adding Comment' , { 
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        autoHideDuration: 3000,
      });
    });
    }

        const hasValidImage = (image) => {
        return image && 
               typeof image === 'string' && 
               image.trim() !== '' && 
               image !== 'null' && 
               image !== 'undefined';
    }

    return (
        <PostProvider>
        <Container maxWidth="md">
            <Nav />
            <div className='my-10 text-2xl flex items-center'>
                <h1 className='mr-2 font-bold'>{userName}<span className='font-normal'> posts</span></h1>
                
            </div>
            
            <Card className="shadow-lg p-4" sx={{ maxWidth: "100%", borderRadius: "20px"}}>
                <CardContent sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <div className='flex items-center'>
                        <img
                            style={{
                                height: "40px",
                                width: "40px",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                            src={userProfileImage}
                            onError={(e) => {
                                e.target.src = avatarImg;
                            }}
                            title="user avatar"
                        />
                        <div className='flex flex-col justify-center ml-4'>
                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                {userName}
                            </Typography>
                            <div className='flex gap-1 items-center'>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {timeOfPosts}
                                </Typography>
                                <PublicIcon style={{ fontSize: "18px", color: "gray" }} />
                            </div>
                        </div>
                    </div>
                </CardContent>

                    {hasValidImage(imageOfPost) ? (
                        <CardMedia
                            sx={{ height: 400, borderRadius: "20px" }}
                            image={imageOfPost}
                            component="img"
                            onError={(e) => {
                                
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : null}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: "bold" }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {body}
                    </Typography>
                </CardContent>
                <Divider sx={{ borderColor: 'gray', my: 1 }} />
                <CardActions style = {{fontSize:"20px" , fontWeight:"bold" , display:"flex"}}>
                     <div>Top comments</div>
                     <ArrowDropDownIcon />
                </CardActions>
                <div className = "comments px-5">
                    {
                        commentsArray.map((element)=>{
                            return(
                     <div key = {element.id} className = "comment flex gap-4 my-8">
                        <div className = "image1 h-10 w-10">
                        <img 
                        src={element.author.profile_image} 
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Comment author"
                        onError={(e) => {
                        e.target.src = avatarImg;
                        }}
                        />
                        </div>
                        <div className = "flex flex-col bg-gray-200 w-fit p-4 rounded-2xl">
                            <div className='font-bold'>{element.author.name}</div>
                            <div>{element.body}</div>
                        </div>
                    </div>
                            )
                        })
                    }
<form className = "flex gap-5 items-center" onSubmit={handleCreateNewComment}>
    <img 
        className="h-10 w-10 rounded-full object-cover" 
        src={myImageProfile} 
        onError={(e) => {
        e.target.src = avatarMyProfile;
        }}
        alt="Profile" 
    />
    <div className='flex w-full'>
        <input onKeyPress={(e) => {if (e.key === 'Enter') {handleCreateNewComment(e);}}} value = {CommentBody} onChange = {(e)=>{setCommentBody(e.target.value)}} className='bg-gray-200 rounded-l-xl w-full focus:outline-none px-5 py-3' placeholder='Enter your comment'/>
        <div onClick = {handleCreateNewComment} style = {{backgroundColor : "rgb(120 75 251)"}} className=' rounded-r-xl cursor-pointer px-8 py-3 text-white '>
            <ArrowUpwardIcon />
        </div>
    </div>
</form>
                    
                </div>
            </Card>
        </Container>
        </PostProvider>
    )
}