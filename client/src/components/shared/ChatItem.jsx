import React, { memo } from 'react';
import { Link } from '../styles/StyledComponents.jsx';
import { Typography, Stack, Box } from '@mui/material';
import AvatarCard from './AvatarCard.jsx';
import { motion } from 'framer-motion';

const ChatItem = ({
  avatar = '',
  name,
  _id,
  groupChat = false,
  sameSender = false,
  isOnline = true,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{ padding: 0, textDecoration: 'none' }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '1rem',
          margin:'0.2rem 0',
          background: sameSender
            ? 'linear-gradient(to bottom right, #3730a3, #e11d48, #dc2626)'
            : 'rgba(255, 255, 255, 0.1)',
          color: sameSender ? 'white' : 'unset',
          justifyContent: 'space-between',
          position: 'relative',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          fontFamily: 'cursive',
          transition: 'background 0.3s ease',
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: sameSender
            ? '0 0 10px rgba(255,255,255,0.4)'
            : '0 0 6px rgba(0,0,0,0.2)',
        }}
      >
        <AvatarCard avatar={avatar} />

       <Stack spacing={0.5}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <Typography
      sx={{
        color: sameSender ? 'white' : 'text.primary',
        fontWeight: 600,
        fontFamily: 'cursive',
      }}
    >
      {name}
    </Typography>

    {isOnline && (
      <Box
        sx={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'lightgreen',
          boxShadow: '0 0 8px 1px green',
          animation: 'pulse 1.5s infinite',
        }}
      />
    )}
  </Box>

  {newMessageAlert && (
    <Typography
      sx={{
        color: sameSender ? 'white' : 'text.secondary',
        fontSize: '0.8rem',
        fontFamily: 'cursive',
      }}
    >
      {newMessageAlert.count} New Message
      {newMessageAlert.count > 1 ? 's' : ''}
    </Typography>
  )}
</Stack>


       
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
