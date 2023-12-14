import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DOMPurify from "dompurify";
import Slideshow from '../components/Slideshow';
import { AuthContext } from '../context/authContext';


const Home = () => {

  const [posts, setPosts] = useState([]);


  const cat = useLocation().search;
  const isCategorySelected = cat && cat !== '';

  const {currentUser} = useContext(AuthContext);



  useEffect(()=>{
    const fetchData = async ()=>{
      console.log(cat)
      if (cat === "?cat=news") {
        const res = await axios.get(`/newsApi/`);
        console.log("NEWS",res.data.articles)
        setPosts(res.data.articles)
      }else{
      try{
        const res = await axios.get(`/posts${cat}`);
        console.log("RES",res.data)
        setPosts(res.data)
      }catch(err){                                            
        console.log(err)
      }
    }
    };
    fetchData();

  }, [cat]);

  

  const getText = (html, numLines = 3)=>{
    const doc = new DOMParser().parseFromString(html, "text/html");
  const lines = doc.body.textContent.split('.');
  
  if (lines.length <= numLines) {
    return lines.join('\n');
  } else {
    // Display the first `numLines` lines and add "..." at the end
    return lines.slice(0, numLines).join('\n') + '...';
  }
  }
  return(
    <div className='home'>
      {isCategorySelected ? null : <Slideshow />}
      <div className='posts'>
        {posts.map(
          post=>(
            <div className='post' key = {post._id}>
              <div className='img'>
                <img src = {!(cat === "?cat=news")?`../upload/${post.img}`:post.urlToImage} alt = ""/>
              </div>
              <div className='content'>
                <Link className = "link" to = {`/post/${post._id}`}>
                <h1>{post.title}</h1>
                </Link>
                <p dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(!(cat === "?cat=news")?getText(post.desc, 2):getText(post.description, 2)),
                }}
                ></p> 
                <Link className = "link" to = {!(cat === "?cat=news")?`/post/${post._id}`:post.url}>
                <button>Read More</button>
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default Home