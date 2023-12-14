import express from "express";
import {addReply, getReply, deleteReply} from "../controllers/reply.js";

const router = express.Router();

router.get("/", getReply); // To add a reply to a reply
router.post("/", addReply); // To add a reply to a comment
router.delete("/:id", deleteReply);

export default router;