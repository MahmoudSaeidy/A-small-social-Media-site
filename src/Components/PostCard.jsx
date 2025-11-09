// components/PostCard.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import avatarImg from "../assets/account-avatar-profile-user-11.svg";

export const PostCard = ({ element, canEdit = false, onEditClick, onDeleteClick, onPostClick,}) => {
  
  const hasValidImage = (image) => {
    return image && typeof image === 'string' && image.trim() !== '' && image !== 'null' && image !== 'undefined';};

    return (
    <Card key={element.id} className="shadow-lg p-4" sx={{ maxWidth: "100%", borderRadius: "20px" }}>
      <CardContent sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <div className='flex justify-between w-full items-center'>
          <div className='flex items-center'>
            <img 
              src={element.author.profile_image} 
              alt="user avatar"
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = avatarImg;
              }}
            />
            <div className='flex flex-col justify-center ml-4'>
              <Typography variant="h6" sx={{ color: 'text.secondary'}}>
                {element.author.username}
              </Typography>
              <div className='flex gap-1 items-center'>
                <Typography variant="body2" sx={{ color: 'text.secondary'}}>
                  {element.created_at}
                </Typography>
                <PublicIcon style={{ fontSize: "18px", color: "gray" }} />
              </div>
            </div>
          </div>
          
          {canEdit && (
            <div className='flex gap-4'>
              <div className='cursor-pointer' onClick={() => onEditClick(element.id)}>
                <EditIcon />
              </div>
              <div className='cursor-pointer hover:text-red-500 transition' 
                   onClick={() => onDeleteClick(element.id, element.author.id)}>
                <DeleteIcon />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {hasValidImage(element.image) ? (
        <CardMedia
          sx={{ height: 400, borderRadius: "20px" }}
          image={element.image}
          title={element.title}
          component="img"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: "bold" }}>
          {element.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {element.body}
        </Typography>
      </CardContent>
      

        <>
          <Divider sx={{ borderColor: 'gray', my: 1 }} />
          
          <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              onClick={() => onPostClick(element.id)} 
              size="small" 
              sx={{
                fontWeight: "bold", 
                color: "#1e3a8a",
                padding: "5px 10px", 
                fontSize: "15px", 
                '&:hover': {
                  backgroundColor: 'rgb(229,231,235)',
                }
              }}
            >
              <CommentIcon sx={{ mr: "10px" }} />
              Comments ({element.comments_count})
            </Button>
            
            {element.tags && element.tags.length > 0 && (
              <ul style={{ display: "flex", flexWrap: 'wrap', gap: '8px' }}>
                {element.tags.map((tag, index) => (
                  <li key={index} className="bg-gray-300 px-3 py-1 rounded-xl text-sm">
                    {tag.name || tag}
                  </li>
                ))}
              </ul>
            )}
          </CardActions>
        </>
    </Card>
  );
};