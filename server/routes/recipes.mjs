import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all recipes from A to Z
router.get("/", async (req, res) => {
  // db.collection("<ENDPOINT>")

  const collection = await db.collection("recipes");
  // ! difference between .find() and .find({}) ??
  // let results = await collection.find({}).sort({title:1}).toArray();
  
  // https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h-allow-filtering-sorting-and-pagination
  // TODO filter by specific item
  // let results = await collection.find({}).toArray();
  const { sort, pageID } = req.query;
  console.log('sort: ', sort)
  console.log('pageID: ', pageID)
  let results = {};
  if (sort === 'sort') {
    // https://www.mongodbtutorial.org/mongodb-crud/mongodb-limit/ PAGINATION
    // results = await collection.find({}).sort({title:1}).toArray();
    results = await collection.find({}).sort({title:1}).skip(pageID > 0 ? ( ( pageID - 1 ) * 3) : 0).limit(3).toArray();
  }
  else if (sort === 'reverseSort') {
    // results = await collection.find({}).sort({title:-1}).toArray();
    results = await collection.find({}).sort({title:-1}).skip(pageID > 0 ? ( ( pageID - 1 ) * 3) : 0).limit(3).toArray();
  }
  else {
    // results = await collection.find({}).toArray();

    // FIXME not working on nginx
    // results = await collection.find({}).limit(3).toArray();
    results = await collection.find({}).skip(pageID > 0 ? ( ( pageID - 1 ) * 3) : 0).limit(3).toArray();
  }

  res.send(results).status(200);
});

// TODO retrieve first 24, second 24 items
// need to sort first, then get items
// Get a single post
router.get("/:id", async (req, res) => {
  // let collection = await db.collection("recipes");
  // let query = {_id: ObjectId(req.params.id)};
  // let result = await collection.findOne(query);

  // if (!result) res.send("Not found").status(404);
  // else res.send(result).status(200);
});

// Fetches the latest recipes
router.get("/latest", async (req, res) => {
  // let collection = await db.collection("recipes");
  // let results = await collection.aggregate([
  //   {"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
  //   {"$sort": {"date": -1}},
  //   {"$limit": 3}
  // ]).toArray();
  // res.send(results).status(200);
});


// Add a new document to the collection
router.post("/", async (req, res) => {
  let collection = await db.collection("recipes");
  let newDocument = req.body;
  newDocument.date = new Date();
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204); //send to db
});

// Update the post with a new comment
router.patch("/comment/:id", async (req, res) => {
  // const query = { _id: ObjectId(req.params.id) };
  // const updates = {
  //   $push: { comments: req.body }
  // };

  // let collection = await db.collection("recipes");
  // let result = await collection.updateOne(query, updates);

  // res.send(result).status(200);
});

// Delete an entry
router.delete("/:id", async (req, res) => {
  // const query = { _id: ObjectId(req.params.id) };

  // const collection = db.collection("recipes");
  // let result = await collection.deleteOne(query);

  // res.send(result).status(200);
});

export default router;
