import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

//Routes

app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_ATLAS_URI).then(
    () => {
        console.log('Connected to MongoDB');
    }
).catch(
    (err) => {
        console.error('Error connecting to MongoDB', err);
    }
);

app.get('/api', (req, res) => {
    res.send('Hello World');
    }
);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);