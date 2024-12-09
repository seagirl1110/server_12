import express from 'express';
import 'dotenv/config';
import { connectToDatabase, getDB } from './db/index.js';

const app = express();
app.use(express.json());

const port = process.env.PORT;

connectToDatabase()
  .then(() => {
    app.post('/products', async (req, res) => {
      try {
        const db = getDB();

        const { name, price, description } = req.body;
        if (!name || !price || !description) {
          return res
            .status(400)
            .json('message: Name, price and description are required');
        }

        const result = await db
          .collection('products')
          .insertOne({ name, price, description });

        res.status(201).json(result);
      } catch (error) {
        res
          .status(500)
          .json({ message: `Failed to create product: ${error.message}` });
      }
    });

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
