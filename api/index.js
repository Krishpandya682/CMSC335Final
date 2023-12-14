import express from "express";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import commentRoutes from "./routes/comments.js";
import replyRoutes from "./routes/replies.js";
import newsApiRoutes from "./routes/newsApi.js";
import multer from "multer";
import { posts, users } from "../mongodb.js"; // Assuming you have 'posts' and 'users' collections



const app = express()

app.use(express.json())
app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/blog/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })

const upload = multer({storage})

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file =req.file;
    res.status(200).json(file.filename)
})
app.get('/api/upload', function (req, res) {
  res.send("GET");
})
app.get('/', function (req, res) {
  res.send("Welcome to my API ROOT!");
})
app.use("/api/newsApi", newsApiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/replies", replyRoutes);


app.listen(8800, ()=>{
    
    console.log("Connected!");
    console.log("Posts:-",posts);
})