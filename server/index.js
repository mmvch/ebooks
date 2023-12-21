import cors from 'cors';
import express, { json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const port = 5500;
app.use(json());
let db;

app.use(cors({ origin: 'http://localhost:3000' }));

const connectToMongoDB = async () => {
	try {
		const client = await MongoClient.connect('mongodb://127.0.0.1:27017/');
		console.log('Connected to MongoDB');
		db = client.db('mybookdb');
	} catch (err) {
		console.error("MongoDB Connection Error: ", err);
	}
}

app.post('/books', async (req, res) => {
	try {
		const book = req.body;
		const result = await db.collection('books').insertOne(book);
		res.status(201).send(result.insertedId);
	} catch (err) {
		console.error("Insert Error: ", err);
		res.status(500).send(err);
	}
});

app.get('/books', async (req, res) => {
	try {
		const books = await db.collection('books').find().toArray();
		res.status(200).send(books);
	} catch (err) {
		console.error("Find Error: ", err);
		return res.status(500).send(err);
	}
});

app.put('/books/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const updatedBook = req.body;
		const result = await db.collection('books').updateOne({ _id: new ObjectId(id) }, { $set: updatedBook });
		res.status(200).send(result);
	} catch (err) {
		console.error("Update Error: ", err);
		return res.status(500).send(err);
	}
});

app.delete('/books/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
		res.status(200).send(result);
	} catch (err) {
		console.error("Delete Error: ", err);
		return res.status(500).send(err);
	}
});

connectToMongoDB().then(() => {
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
});
