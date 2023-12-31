import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Menu = ({cat}) => {

  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        const res = await axios.get(`https://three35finalapi.onrender.com/api/posts/?cat=${cat}`);
        setPosts(res.data)
        console.log("POsts:-", res.data);
      }catch(err){
        console.log(err)
      }
    };
    fetchData();
  }, [cat]);

  return (
    <div className='menu'>
      <h1>Other posts you may like</h1>
      {posts.map(post=>(
        <div className='post' key = {post._id}>
          <img src = {`${post.img}`} alt = ""/>
          <Link className = "link" to = {`/post/${post._id}`}>
          <h2>{post.title}</h2>
          </Link>
          <Link className = "link" to = {`/post/${post._id}`}>
          <button>Read More </button>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Menu