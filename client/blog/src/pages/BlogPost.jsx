import React, { useContext, useEffect, useState } from 'react';
import Edit from '../img/edit.png';
import Delete from '../img/delete.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import axios from 'axios';
import moment from 'moment';
import Comments from '../components/Comments';
import { AuthContext } from '../context/authContext';
import DOMPurify from "dompurify";





const BlogPost = () => {

  const [post, setPost] = useState({});
  const [commentOpen, setCommentOpen] = useState(false);


  const location = useLocation();

  const navigate = useNavigate();

  const postID = location.pathname.split("/")[2]

  const {currentUser} = useContext(AuthContext)

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const res = await axios.get(`https://three35finalapi.onrender.com//posts/${postID}`);
        setPost(res.data)
        console.log("Res data:",res.data);
      }catch(err){
        console.log(err)
      }
    };
    fetchData();
  }, [postID]);

  const handleDelete = async ()=>{
    try{
      await axios.delete(`https://three35finalapi.onrender.com//posts/${postID}`);
      navigate("/")
    }catch(err){
      console.log(err)
    }
  }

  return(
    <div className = 'one'>
      <div className='content'>
        <img src = {`../upload/${post?.img}`}/>
        <div className="user">
          {post.userImg && <img src = {`../upload/${post.userImg}`} alt = "user profile"/>}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser?.username === post.username && <div className="edit">
            <Link to = {`/write?edit=${postID}`} state={post}>
            <img className = "symbol" src = {Edit}/>
            </Link>
            <img className = "symbol" onClick = {handleDelete} src = {Delete}/>
          </div>}
        </div>

        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}
        ></p> 
        {commentOpen? <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
          Hide Comments
        </div>: <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
          See Comments
        </div>}
        {commentOpen && <Comments postId={post.id}/>}
      </div>
      <Menu cat = {post.cat}/>
    </div>
  )
}

export default BlogPost