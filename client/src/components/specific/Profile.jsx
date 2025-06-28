import { Avatar, Stack, Typography } from '@mui/material'
import {
  Face as FaceIcon, 
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material'
import moment from 'moment'
import { transfromImage } from '../../lib/features.js'

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"} >
      <Avatar
        src={transfromImage(user?.avatar?.url)}
       sx={{
        width:200,
        height:200,
        objectFit:"contain",
        marginBottom:"1rem",
        border:"5px solid white",
      }}/>

      <ProfileCard heading={"Bio"} text={user?.bio}/>
      <ProfileCard heading={"Username"} text={user?.username} Icon={<UserNameIcon/>}/>
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon/>}/>
      <ProfileCard heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon/>}/>
    </Stack>
  )
}


const ProfileCard=({text,Icon,heading})=>(
  <Stack 
  direction={"row"} 
  alignItems={"center"} 
  spacing={"1rem"}
  color={"black"}
  textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant='body1' color='black' fontWeight={820} fontFamily={"cursive"}    >{text}</Typography>
      <Typography color='black' fontWeight={820} fontFamily={"cursive"} variant='caption'>{heading}</Typography>
    </Stack>
  </Stack>
)

export default Profile