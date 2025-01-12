import express from 'express';
import { isAuthticated } from '../middlewares/auth.js';
import { newGroupChat } from '../controllers/chat.js';

const app=express.Router();



// After here user must be logged in to access the routes
app.use(isAuthticated);

app.post("/new",newGroupChat);



export default app;