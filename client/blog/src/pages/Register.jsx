import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    password:"",
    img:null
  })

  const [err,setError] = useState(null)

  const navigate = useNavigate()

  const handleChange = e => {
    if (e.target.name === 'img') {
      // Store the file object in the state
      setInputs(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async e =>{
    e.preventDefault()
    try{
      if (!inputs.username || !inputs.email || !inputs.password || !inputs.img) {
        setError("All fields are required");
      } else {
        setError("");
      const formData = new FormData();
      formData.append("file", inputs.img)
      const res = await axios.post("https://three35finalapi.onrender.com/upload", formData)
      const imgUrl = res.data;
      //added proxy in package.json so don't have to type the url while requesting again and again
      const dat = await axios.post("https://three35finalapi.onrender.com/auth/register", {...inputs, img: imgUrl})
      console.log(dat.data);
      navigate("/login")
      }
    }catch(err){
      setError(err.response.data)
    }
    
  }

  return (
    <div className='auth'>
      <h1>Register</h1>
      <form>
        <input required type = "text" placeholder='username' name='username' onChange={handleChange}/>
        <input required type = "email " placeholder='email' name = 'email' onChange={handleChange}/>
        <input required type = "password" placeholder='password' name = 'password' onChange={handleChange}/>
        <input required type='file' name = 'img' onChange={handleChange}/>
        <button onClick={handleSubmit}>Register</button>
        {err && <p>{err}</p>}
        <span>Already have an account? <Link to = "/login">Login</Link></span>
      </form>
    </div>
  )
}

export default Register