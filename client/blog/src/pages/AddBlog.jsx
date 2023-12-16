import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const AddBlog = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  // const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();

  // const upload = async ()=>{
  //   try{
  //     const formData = new FormData();
  //     formData.append("file", file)
  //     console.log("Form Data",formData);
  //     const res = await axios.post("https://three35finalapi.onrender.com/api/upload", formData)
  //     return res.data
  //   }catch(err){
  //     console.log(err)
  //   }
  // }

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      state
        ? await axios.put(
            `https://three35finalapi.onrender.com/api/posts/${state._id}`,
            {
              title,
              desc: value,
              cat,
              img: imgUrl,
              uid: localStorage.getItem("user")._id,
            }
          )
        : await axios.post(`https://three35finalapi.onrender.com/api/posts/`, {
            title,
            desc: value,
            cat,
            img: imgUrl,
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            uid: localStorage.getItem("user")._id,
          });
      console.log("Navigating");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <form className="content">
        <input
          type="text"
          value={imgUrl}
          placeholder="Image Url"
          onChange={(e) => setImgUrl(e.target.value)}
        />
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </form>

      <div className="menu">
        <div className="item">
          <h1>Publish</h1>

          {/* <input style = {{display:'none'}} type='file' id="file" onChange={e=>setFile(e.target.files[0])}/> */}
          {/* <label className= "file" htmlFor='file'>Upload Image</label> */}
          <div className="buttons">
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "tech"}
              name="cat"
              value="tech"
              id="tech"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="tech">Technology</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="food"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
