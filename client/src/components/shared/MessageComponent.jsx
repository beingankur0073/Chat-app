import { Typography, Box } from '@mui/material';
import React, { memo } from 'react';
import { lightBlue } from '../../constants/color.js';
import moment from 'moment';
import { fileFormat } from '../../lib/features.js';
import RenderAttachment from './RenderAttachment.jsx';
import { motion } from 'framer-motion';

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: '-100%' }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? 'flex-end' : 'flex-start',
        background: sameSender
          ? 'linear-gradient(135deg, #dbeafe, #e0f2fe)' // light blue gradient
          : 'linear-gradient(135deg, #fef9c3, #fef3c7)', // soft yellow gradient
        color: 'black',
        borderRadius: '10px',
        padding: '0.75rem',
        width: 'fit-content',
        fontFamily: 'cursive',
        maxWidth: '80%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {!sameSender && (
        <Typography
          color={lightBlue}
          fontWeight="600"
          variant="caption"
          sx={{ fontFamily: 'cursive' }}
        >
          {sender.name}
        </Typography>
      )}

      {content && (
        <Typography sx={{ fontFamily: 'cursive' }}>{content}</Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: 'black',
                  fontFamily: 'cursive',
                  textDecoration: 'underline',
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontFamily: 'cursive' }}
      >
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
