import express from 'express';
import 'dotenv/config';
import { ObjectId } from 'mongodb';
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

    app.get('/products', async (req, res) => {
      try {
        const db = getDB();

        const products = await db.collection('products').find().toArray();

        res.status(200).json(products);
      } catch (error) {
        res
          .status(500)
          .json({ message: `Failed to fetch products: ${error.message}` });
      }
    });

    app.get('/products/:id', async (req, res) => {
      try {
        const db = getDB();

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid product id' });
        }

        const product = await db
          .collection('products')
          .findOne({ _id: new ObjectId(id) });

        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
      } catch (error) {
        res
          .status(500)
          .json({ message: `Failed to fetch product: ${error.message}` });
      }
    });

    app.put('/products/:id', async (req, res) => {
      try {
        const db = getDB();

        const id = req.params.id;
        const newData = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid product id' });
        }

        const result = await db
          .collection('products')
          .updateOne({ _id: new ObjectId(id) }, { $set: newData });

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product update successfully' });
      } catch (error) {
        res
          .status(500)
          .json({ message: `Failed to update product: ${error.message}` });
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
