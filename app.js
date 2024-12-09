import express from 'express';
import 'dotenv/config';
import { connectToDatabase } from './db/index.js';

const app = express();

const port = process.env.PORT;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(
      'Failed to start the server due to MongoDB connection issue: ',
      err
    );
  });
