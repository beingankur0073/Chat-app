import React from 'react';
import { Stack } from '@mui/material';
import ChatItem from '../shared/ChatItem.jsx';

const ChatList = ({
  w = '100%',
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: '',
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack
      width={w}
      direction="column"
      overflow="auto"
      height="100%"
      sx={{
        background: 'linear-gradient(to bottom right, #b91c1c, #3b82f6, #4338ca)',
        fontFamily: 'cursive',
        padding: '0.5rem',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '10px',
        },
      }}
    >
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          (alert) => alert.chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );




        console.log('isOnline', isOnline);
        return (
          <ChatItem
            key={_id}
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
