import express from 'express'
import { getMyProfile, login, newUser,logout, searchUser, sendFriendRequest, getMyNotifications, acceptFriendRequest, getMyFriends } from '../controllers/user.js';
import {singleAvatar} from '../middlewares/multer.js';
import { isAuthticated } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from '../lib/validators.js';

const app=express.Router();

app.post("/new",singleAvatar,registerValidator(),validateHandler,newUser)
app.post("/login",loginValidator(),validateHandler,login)


// After here user must be logged in to access the routes
app.use(isAuthticated);

app.get("/me",getMyProfile)
app.get("/logout",logout)
app.get("/search",searchUser);

app.put("/sendrequest",sendRequestValidator(),validateHandler,sendFriendRequest)

app.put(
    "/acceptrequest",
    acceptRequestValidator(),
    validateHandler,
    acceptFriendRequest
)


app.get(
    "/notifications",
    getMyNotifications
)

app.get(
    "/friends",
     getMyFriends
)

export default app;