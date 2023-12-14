import { useContext, useState, useEffect } from "react";
import "../commentsStyle.scss";
import moment from "moment";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Replies from '../components/Replies';
import Delete from '../img/delete.png';
import { AuthContext } from '../context/authContext';





const Comments = ({postId}) => {
  const [desc, setDesc] = useState("");
  const [comments, setComments] = useState([]);
  const [openRepliesForCommentId, setOpenRepliesForCommentId] = useState(null);
  const {currentUser} = useContext(AuthContext);
  const [replyOpen, setReplyOpen] = useState(false);



  useEffect(()=>{
    
    const fetchData = async ()=>{
      try{
        // const res = await axios.get(`/comments/?postId=${postId}`);
        const res = await axios.get(`https://three35finalapi.onrender.com/api/comments/?postId=${postId}`);
        setComments(res.data)

      }catch(err){
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleAddComment = async (e)=>{
    e.preventDefault();
    try{
      const cmt = {
        postId: postId, 
        desc: desc,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };

      const response = await axios.post("https://three35finalapi.onrender.com/api/comments", cmt);
        setComments([...comments, response.data]);
        const res = await axios.get(`https://three35finalapi.onrender.com/api/comments/?postId=${postId}`);
        setComments(res.data)
        setDesc("");      
    }catch(err){
      console.log(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://three35finalapi.onrender.com/api/comments/${commentId}`); 
      setComments(comments.filter(comment => comment.id !== commentId)); 
    } catch (err) {
      console.log(err);
    }
  };

  
 

  const handleOpenReplies = (commentId) => {
    setOpenRepliesForCommentId(commentId);
    setReplyOpen(!replyOpen);
  };

  return (
    <div className="comments">
      <div className="write">
        {currentUser && <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />}
         {currentUser && <button onClick={handleAddComment}>Post</button>}
      </div>
      {comments.map((comment) => (
            <div className="comment" key = {comment.id}>
              {comment.img && <img id = "profilePic" src = {`../upload/${comment.img}`} alt = "user profile"/>}
              <div className="info">
                <span>{comment.username}</span>
                <span className="desc">
                    {comment.desc}
                  <span className="date">{moment(comment.createdAt).fromNow()}
                  {currentUser?.username === comment.username && <div className="edit">
                <img onClick = {() => handleDeleteComment(comment.id)} src = {Delete}/>
                </div>}
                  </span>
                  
                </span>
                {replyOpen && openRepliesForCommentId === comment.id? <div className="item" onClick={() => handleOpenReplies(null)}>
                Hide Replies
                </div> :
                <div className="item" onClick={() => handleOpenReplies(comment.id)}>
                See Replies
                </div>}
                <div className="test">
                {openRepliesForCommentId === comment.id && <Replies commentId={comment.id} postId={postId} parentCommentId={null}/>}
                </div>
              </div>
            </div>
          ))}
    </div>
  );
};

export default Comments;