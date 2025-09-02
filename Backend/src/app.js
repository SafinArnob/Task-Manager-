import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import router from './routes/api.js';

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



// ROUTES ENTRY
app.use('/api/v1', router)

export default app;