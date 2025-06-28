import React from 'react'
import Applayout from '../components/layout/Applayout.jsx'
import { Typography,Box } from '@mui/material'
import { grayColor } from '../constants/color.js'

const Home = () => {
  return (
    <Box bgcolor={{backgroundImage: "linear-gradient(to right, #0f172a, #334155)"}} height={"100%"}>
    <Typography p={"2rem"} variant='h5' textAlign={"center"}  color='white'>
      Select a friend to chat
    </Typography>
    </Box>
  )
}

export default Applayout()(Home)