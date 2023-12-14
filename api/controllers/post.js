import jwt from "jsonwebtoken";
import { posts, users } from "../mongodb.js"; // Assuming you have 'posts' and 'users' collections
import { ObjectId } from "mongodb";



export const getPosts = async (req, res) => {
  try {
    const filter = req.query.cat ? { cat: req.query.cat } : {};

    const result = await posts.find(filter).toArray();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getPosts = (req,res)=>{
//     const q = req.query.cat
//     ? "SELECT * FROM posts WHERE cat=?"
//     : "SELECT * FROM posts";

//     db.query(q, [req.query.cat], (err, data)=>{
//         if(err) return res.status(500).json(err);
//         return res.status(200).json(data);
//     });
// };

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    console.log("postID", postId);
    const aggregationPipeline = [
      {
        $match: { _id: new ObjectId(postId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "uid",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          id: "$id",
          username: "$user.username",
          title: "$title",
          desc: "$desc",
          img: "$img",
          userImg: "$user.img",
          cat: "$cat",
          date: "$date",
        },
      },
    ];

    const result = await posts.aggregate(aggregationPipeline).toArray();

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json("Post not found");
    }
  } catch (error) {
    console.error("Error getting post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getPost = (req,res)=>{
//     const q = "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id = ? "

//     db.query(q, [req.params.id], (err, data)=>{
//         if(err) return res.status(500).json(err);
//         return res.status(200).json(data[0]);
//     })
// };

export const addPost = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    console.log("Checking req.coockioes", req.cookies);
    console.log("Checking token", token);
    // if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "jwtkey");
    // if (!userInfo) return res.status(403).json("Token is not valid!");

    const newPost = {
      title: req.body.title,
      desc: req.body.desc,
      img: req.body.img,
      cat: req.body.cat,
      date: req.body.date,
      uid: userInfo?userInfo._id:req.body.uid,
    };
    console.log("User INfo:", userInfo);
    await posts.insertOne(newPost);

    return res.json("Post has been created");
  } catch (error) {
    console.error("Error adding post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const addPost = (req,res)=>{
//     const token = req.cookies.access_token;
//     if(!token) return res.status(401).json("Not authenticated!");

//     jwt.verify(token, "jwtkey", (err, userInfo)=>{
//         if(err) return res.status(403).json("Token is not valid!");

//         const q = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)";

//         const values = [
//             req.body.title,
//             req.body.desc,
//             req.body.img,
//             req.body.cat,
//             req.body.date,
//             userInfo.id
//         ]

//         db.query(q, [values], (err, data)=>{
//             if(err) return res.status(500).json(err);
//             return res.json("Post has been created")
//         })
//     });
// }

export const deletePost = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    const result = await posts.deleteOne({
      _id: new ObjectId(postId),
      uid: userInfo._id,
    });

    if (result.deletedCount > 0) {
      return res.json("Post has been deleted!");
    } else {
      return res.status(403).json("You can delete only your own posts!");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const deletePost = (req,res)=>{
//     const token = req.cookies.access_token
//     if(!token) return res.status(401).json("Not authenticated!")

//     jwt.verify(token, "jwtkey", (err, userInfo)=>{
//         if(err) return res.status(403).json("Token is not valid!")
//         const postID = req.params.id
//         const q = "DELETE FROM posts WHERE `id`= ? AND `uid` = ?"

//         db.query(q, [postID, userInfo.id], (err,data)=>{
//             if(err) return res.status(403).json("You can delete only your own posts!")

//             return res.json("Post has been deleted")
//         });
//     });
// };

export const updatePost = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    const updateFields = {
      title: req.body.title,
      desc: req.body.desc,
      cat: req.body.cat,
    };

    if (req.body.img) {
      updateFields.img = req.body.img;
    }

    const result = await posts.updateOne(
      { _id: new ObjectId(postId), uid: userInfo._id },
      { $set: updateFields }
    );

    if (result.modifiedCount > 0) {
      return res.json("Post has been updated");
    } else {
      return res.status(403).json("You can update only your own posts");
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const updatePost = (req,res)=>{
//     const token = req.cookies.access_token
//     if(!token) return res.status(401).json("Not authenticated!")

//     jwt.verify(token, "jwtkey", (err, userInfo)=>{
//         if(err) return res.status(403).json("Token is not valid!");

//         const postID = req.params.id
//         let q = "UPDATE posts SET `title`=?, `desc`=?, `cat`=?";
//     const values = [req.body.title, req.body.desc, req.body.cat];

//     if (req.body.img) {
//       q += ", `img`=?";
//       values.push(req.body.img);
//     }

//     q += " WHERE `id`=? AND `uid`=?";

//         db.query(q, [...values, postID, userInfo.id], (err, data)=>{
//             if(err) return res.status(500).json(err);
//             return res.json("Post has been updated");
//         });
//     });
// };
