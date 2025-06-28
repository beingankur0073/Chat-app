import {lazy, Suspense, useEffect} from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute.jsx' // Make sure this path is correct
import {LayoutLoader} from './components/layout/Loaders.jsx'
import axios from 'axios'
import {server} from "./constants/config.js"
import { useDispatch, useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth.js'
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from './socket.jsx'


const Home=lazy(()=>import("./pages/Home.jsx"))
const Login=lazy(()=>import("./pages/Login.jsx"))
const Chat=lazy(()=>import("./pages/Chat.jsx"))
const Groups=lazy(()=>import("./pages/Groups.jsx"))
const NotFound=lazy(()=>import("./pages/NotFound.jsx"))

const AdminLogin=lazy(()=>import("./pages/admin/AdminLogin.jsx"))
const Dashboard=lazy(()=>import("./pages/admin/Dashboard.jsx"))
const UserManagement=lazy(()=>import("./pages/admin/UserManagement.jsx"))
const ChatManagement=lazy(()=>import("./pages/admin/ChatManagement.jsx"))
const MessagesManagement=lazy(()=>import("./pages/admin/MessageManagement.jsx"))


const App = () => {

  const {user,loader}=useSelector(state=>state.auth)
  const dispatch=useDispatch()

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{withCredentials:true})
    .then(({data})=>dispatch(userExists(data.user)))
    .catch((err)=>dispatch(userNotExists()))
  },[dispatch])


  return loader ? (
    <LayoutLoader/>
  ): (
    <Suspense fallback={<LayoutLoader/>}>
      <BrowserRouter>
        <Routes >
          {/* Main Protected Routes */}
          <Route element={
            <SocketProvider>
              {/* If user is NOT logged in (user is false/null/undefined), redirect to /login */}
              <ProtectRoute user={user} redirect="/login"/>
            </SocketProvider>
          }>
            <Route path='/' element={<Home/>}/>
            <Route path='/chat/:chatId' element={<Chat/>} />
            <Route path='/groups' element={<Groups/>} />
          </Route>

          {/* Login Route:
              - If user is NOT logged in (!user is true), allow <Login/>
              - If user IS logged in (!user is false), redirect to / (Home) */}
          <Route
            path='/login'
            element={
              <ProtectRoute user={!user} redirect='/'>
                <Login/>
              </ProtectRoute>
            }
          />

          {/* Admin Login Route: This route itself doesn't need ProtectRoute wrapper unless
              you want to redirect if a regular user somehow lands here and is logged in */}
          <Route path='/admin' element={<AdminLogin/>}/>

          {/* Admin Protected Routes:
              - If user is NOT logged in, redirect to /admin (AdminLogin)
              - You'd likely add logic within ProtectRoute or here to check if 'user' also has 'isAdmin: true' */}
          <Route element={<ProtectRoute user={user} redirect="/admin"/>}>
            <Route path='/admin/dashboard' element={<Dashboard/>} />
            <Route path='/admin/users' element={<UserManagement/>} />
            <Route path='/admin/chats' element={<ChatManagement/>} />
            <Route path='/admin/messages' element={<MessagesManagement/>} />
          </Route>

          {/* Catch-all for any undefined routes */}
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster position='bottom-center'/>
    </Suspense>
  )
}

export default App;