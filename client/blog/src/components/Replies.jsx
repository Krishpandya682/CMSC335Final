import { useState, useEffect, useContext } from "react";
import "../commentsStyle.scss";
import moment from "moment";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Delete from '../img/delete.png';
import { AuthContext } from '../context/authContext';


const Replies = ({commentId, postId, parentCommentId}) => {
    const state = useLocation().state
    const [desc, setDesc] = useState(state?.desc || "");
    const [replies, setReplies] = useState([]);
    const [openRepliesForReplyId, setOpenRepliesForReplyId] = useState(null);
    const [replyOpen, setReplyOpen] = useState(false);
    const {currentUser} = useContext(AuthContext);



    useEffect(()=>{
        const fetchData = async ()=>{
          try{
            //the get request is wrong - it gets all comments under the commentId everytime, you all want the replies under the replyId
          const res = parentCommentId === null
          ? await axios.get(`https://three35finalapi.onrender.com//replies/?commentId=${commentId}`)
          : await axios.get(`https://three35finalapi.onrender.com//replies/?parentCommentId=${parentCommentId}`);
                    console.log(res.data);
            setReplies(res.data)
    
          }catch(err){
            console.log(err);
          }
        };
        fetchData();
      }, [commentId, postId, parentCommentId]);

    const handleAddReply = async () => {
        try {
          const cmt = {
            desc: desc,
            postId: postId,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            commentId: commentId, 
            parentCommentId: parentCommentId
          };
    
          const response = await axios.post("https://three35finalapi.onrender.com/replies", cmt);
          setReplies([...replies, response.data]);
          const res = parentCommentId === null
          ? await axios.get(`https://three35finalapi.onrender.com/replies/?commentId=${commentId}`)
          : await axios.get(`https://three35finalapi.onrender.com/replies/?parentCommentId=${parentCommentId}`);
                  setReplies(res.data);
          setDesc('');
        } catch (err) {
          console.log(err);
        }
    };

    const handleDeleteReply = async (replyId) => {
      try {
        await axios.delete(`https://three35finalapi.onrender.com/replies/${replyId}`); // Assuming your API route is "/comments/{commentId}" for deleting a comment
        setReplies(replies.filter(reply => reply.id !== replyId)); // Remove the deleted comment from the state
      } catch (err) {
        console.log(err);
      }
    };

    const handleOpenReplies = (replyId) => {
      setOpenRepliesForReplyId(replyId);
      setReplyOpen(!replyOpen);
    };

    return (
        <div className="comments">
          <div className="write">
            {currentUser && <input
              type="text"
              placeholder="write a reply"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />}
             {currentUser && <button onClick={handleAddReply}>Reply</button>}
          </div>
          {replies.map((reply) => (
                <div className="reply" key={reply.id}>
                  {reply.img && <img id = "profilePic" src = {`../upload/${reply.img}`} alt = "user profile"/>}
                  <div className="info">
                    <span>{reply.username}</span>
                    <span className="desc">
                    {reply.desc}
                  <span className="date">{moment(reply.createdAt).fromNow()}
                  {currentUser?.username === reply.username && <div className="edit">
                <img onClick = {() => handleDeleteReply(reply.id)} src = {Delete}/>
                </div>}
                  </span>
                </span>
                {replyOpen && openRepliesForReplyId === reply.id? <div className="item" onClick={() => handleOpenReplies(null)}>
                Hide Replies
                </div> :
                <div className="item" onClick={() => handleOpenReplies(reply.id)}>
                See Replies
                </div>}
                    <div className="test">
                    {openRepliesForReplyId === reply.id && <Replies commentId={commentId} postId={postId} parentCommentId={reply.id}/>}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      );
}

export default Replies;


