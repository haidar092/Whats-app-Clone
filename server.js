//import
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
//app cofig

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1425594",
  key: "561bb67ce503c53d87c0",
  secret: "dca119154843f4b04ba6",
  cluster: "ap2",
  useTLS: true,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("db connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        recived: messageDetails.recived,
      });
    } else {
      console.log("error trigriring pusher");
    }
  });
});

//midlware
app.use(express.json());

app.use(cors());
//db config
const connection_url =
  "mongodb+srv://Hadi092:47440290@cluster0.cotc6xw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//???

//api routes

app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
//listen
app.listen(port, () => console.log(`listen on the port ${port}`));
