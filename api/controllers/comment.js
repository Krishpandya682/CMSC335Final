import jwt from "jsonwebtoken";
import moment from "moment";
import { users, comments } from "../mongodb.js";
import { ObjectId } from 'mongodb';

export const getComments = async (req, res) => {
  try {
    const postId = req.query.postId;

    const aggregationPipeline = [
      {
        $match: { postId: postId },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          debugInfo: { $literal: "Debug info" },
          _id: 0,
          id: "$user.id",
          userId: "$userId",
          username: "$user.username",
          img: "$user.img",
          desc: "$desc",
          createdAt: "$createdAt",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const result = await comments.aggregate(aggregationPipeline).toArray();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error getting comments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getComments = (req, res) => {
//   const q = `SELECT c.*, u.id AS userId, username, img FROM comments AS c JOIN users AS u ON (u.id = c.userId)
//     WHERE c.postId = ? ORDER BY c.createdAt DESC
//     `;

//   db.query(q, [req.query.postId], (err, data) => {
//     if (err) return res.status(500).json(err);
//     return res.status(200).json(data);
//   });
// };

export const addComment = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not logged in!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const newComment = {
      desc: req.body.desc,
      createdAt: new Date(),
      userId: userInfo.id,
      postId: req.body.postId,
    };

    await comments.insertOne(newComment);

    return res.status(200).json("Comment has been created.");
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const addComment = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not logged in!");

//   jwt.verify(token, "jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const q = "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
//     const values = [
//       req.body.desc,
//       moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//       userInfo.id,
//       req.body.postId
//     ];

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("Comment has been created.");
//     });
//   });
// };

export const deleteComment = async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    const userInfo = jwt.verify(token, "jwtkey");
    if (!userInfo) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;

    const result = await comments.deleteOne({ _id: new ObjectId(commentId), userId: userInfo.id });

    if (result.deletedCount > 0) {
      return res.json("Comment has been deleted!");
    } else {
      return res.status(403).json("You can delete only your comment!");
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// export const deleteComment = (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, "jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     const commentId = req.params.id;
//     const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

//     db.query(q, [commentId, userInfo.id], (err, data) => {
//       if (err) return res.status(500).json(err);
//       if (data.affectedRows > 0) return res.json("Comment has been deleted!");
//       return res.status(403).json("You can delete only your comment!");
//     });
//   });
// };
