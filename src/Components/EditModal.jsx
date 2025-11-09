// components/EditModal.jsx
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';

const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: "24px",
  p: 4,
  border: "none !important",
  top: "40%",
  width: '400px',
  borderRadius: '16px'

};

export const EditModal = ({
  open,
  onClose,
  updateTitle,
  setUpdateTitle,
  updateBody,
  setUpdateBody,
  imageOfPost,
  fileName,
  onFileChange,
  onSubmit,
  hasValidImage
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={style} className="modal">
        <Typography id="modal-modal-title" variant="h5" component="h2" style={{marginBottom: "20px", fontWeight:"bold"}}>
          Edit Your Post
        </Typography>
        <form onSubmit={onSubmit} className='flex justify-center flex-col'>
          <Divider sx={{ borderColor: '#777777', my: 1, marginBottom:"25px"}} />
          <input 
            value={updateTitle} 
            onChange={(e) => setUpdateTitle(e.target.value)} 
            placeholder='Enter Your title' 
            type="text" 
            className="border border-gray-300 rounded-md py-2 px-4 w-full mb-6"
          />
          <textarea 
            value={updateBody} 
            onChange={(e) => setUpdateBody(e.target.value)} 
            className="border border-gray-300 rounded-md py-2 px-4 w-full mb-4" 
            placeholder='Enter Your body'
            rows="4"
          ></textarea>
          <div>
            {hasValidImage(imageOfPost) && (
              <img 
                className="h-10 w-20 flex justify-center" 
                src={imageOfPost} 
                alt="Current post"
                style={{ maxHeight: '200px', objectFit: 'cover', marginBottom: '10px' }}
              />
            )}
            <input 
              type="file" 
              id="fileInput"
              className="file-input"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="fileInput" className="custom-file-button" style={{ 
              display: 'inline-block', 
              padding: '8px 16px', 
              backgroundColor: '#784bfb', 
              color: 'white', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginRight: '10px'
            }}>
              Update image
            </label>
            <span className="file-name">{fileName || 'No file chosen'}</span>
          </div>

          <Divider sx={{ borderColor: '#777777', my: 1, marginBottom:"25px"}} />
          <div className="flex justify-end mt-6">
            <Button style={{marginRight: "10px"}} onClick={onClose} variant="contained" sx={{backgroundColor: "gray"}}>Close</Button>
            <Button type="submit" variant="contained" color="primary">Update</Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};