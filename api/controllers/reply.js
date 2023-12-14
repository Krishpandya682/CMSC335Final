import jwt from "jsonwebtoken";
import moment from "moment";
import { replies } from "../mongodb.js"; // Assuming you have a 'replies' collection
import { ObjectId } from "mongodb";

export const addReply = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newReply = {
      desc: req.body.desc,
      createdAt: new Date(),
      userId: userInfo.id,
      postId: req.body.postId,
      commentId: req.body.commentId,
      parentCommentId: req.body.parentCommentId,
    };

    const result = await replies.insertOne(newReply);
    console.log(result);

    if (result.insertedId) {
      return res.status(200).json("Reply added"); // Return the inserted reply
    } else {
      return res.status(500).json("Failed to add reply");
    }
  } catch (error) {
    console.error("Error adding reply:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const addReply = (req,res) => {

//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, "jwtkey", (err, userInfo) => {
//       if (err) return res.status(403).json("Token is not valid!");

//       const q = "INSERT INTO replies(`desc`, `createdAt`, `userId`, `postId`, `commentId`, `parentCommentId`) VALUES (?)";
//       const values = [
//         req.body.desc,
//         moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
//         userInfo.id,
//         req.body.postId,
//         req.body.commentId,
//         req.body.parentCommentId
//       ];

//       db.query(q, [values], (err, data) => {
//         if (err) {
//           return res.status(500).json(err);
//         }else{
//           return res.status(200).json(data);
//         }
//       });
//     });

//   }

export const getReply = async (req, res) => {
  try {
    let filter;
    if (req.query.parentCommentId) {
      filter = { parentCommentId: req.query.parentCommentId };
    } else {
      filter = {
        commentId: req.query.commentId,
        parentCommentId: null,
      };
    }

    const result = await replies.find(filter).sort({ createdAt: -1 }).toArray();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving replies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getReply = (req,res) => {
//   let q;
//   let queryParams;

//   if(req.query.parentCommentId) {
//     q = `SELECT r.*, u.id AS userId, username, img FROM replies AS r JOIN users AS u ON (u.id = r.userId)
//     WHERE r.parentCommentId = ? ORDER BY r.createdAt DESC`;
//     queryParams = [req.query.parentCommentId];
//   } else {
//     q = `SELECT r.*, u.id AS userId, username, img FROM replies AS r JOIN users AS u ON (u.id = r.userId)
//     WHERE (r.commentId = ? AND r.parentCommentId IS NULL) ORDER BY r.createdAt DESC`;
//     queryParams = [req.query.commentId, req.query.parentCommentId];
//   }

//   db.query(q, queryParams, (err, data) => {
//     if (err) {
//       console.error("Error:", err);
//       return res.status(500).json(err);
//     } else {
//       return res.status(200).json(data);
//     }
//   });
// };

export const deleteReply = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const replyId = req.params.id;

    const result = await replies.deleteOne({ _id: new ObjectId(replyId), userId: userInfo.id });

    if (result.deletedCount > 0) {
      return res.json("Reply has been deleted!");
    } else {
      return res.status(403).json("You can delete only your reply!");
    }
  } catch (error) {
    console.error('Error deleting reply:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// export const deleteReply = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, "jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const replyId = req.params.id;
//     const q = "DELETE FROM replies WHERE `id` = ? AND `userId` = ?";

//     db.query(q, [replyId, userInfo.id], (err, data) => {
//       if (err) return res.status(500).json(err);
//       if (data.affectedRows > 0) return res.json("Reply has been deleted!");
//       return res.status(403).json("You can delete only your reply!");
//     });
//   });
// };
