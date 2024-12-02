import React,{lazy} from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
const Home=lazy(()=>import("./pages/Home.jsx"))
const Login=lazy(()=>import("./pages/Login.jsx"))
const Chat=lazy(()=>import("./pages/Chat.jsx"))
const Groups=lazy(()=>import("./pages/Groups.jsx"))
const App = () => {
  return (
     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/groups' element={<Groups/>} />
        <Route path='/chat/:chatId' element={<Chat/>} />
      </Routes>
     </BrowserRouter>
  )
}

export default App