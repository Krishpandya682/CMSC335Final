import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users } from "../mongodb.js";

// Assuming you have already initialized the MongoDB connection and obtained the database instance.
// This could be done in a separate module and then imported here.

export const register = async (req, res) => {
  try {
    // Check existing user
    const existingUser = await users.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username }
      ]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists!' });
    }
    // console.log("Request Body", req.body);
    // Encrypt the password
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create user
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      img: req.body.img,
    };

    await users.insertOne(newUser);

    return res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error in registration:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// export const register = (req,res)=>{
//     //check existing user
//     const q = "SELECT * FROM users WHERE email = ? OR username = ?"
//     db.query(q,[req.body.email, req.body.name], (err,data)=>{
//         if(err) return res .json(err);
//         if(data.length) return res.status(409).json("User already exists!");

//         //encrypt the password - hash password and create user
//         const salt = bcrypt.genSaltSync(10);
//         const hash = bcrypt.hashSync(req.body.password, salt);

//         const q = "INSERT INTO users(`username`, `email`, `password`, `img`) VALUES (?)"
//         const values = [
//             req.body.username,
//             req.body.email,
//             hash,
//             req.body.img,
//         ]

//         db.query(q, [values], (err,data)=>{
//             if(err) return res.json(err);
//             return res.status(200).json(res.data)
//         });

//     });

// };

// export const login = (req,res)=>{
//     //check user
//     const q = "SELECT * FROM users WHERE username = ?"
//     db.query(q,[req.body.username], (err, data)=>{
//         if(err) return res.json(err);
//         if(data.length == 0) return res.status(404).json("User not found!")

//         //check password
//         const isPasswordCorrrect = bcrypt.compareSync(req.body.password, data[0].password);
//         if(!isPasswordCorrrect) return res.status(400).json("Wrong username or password!")

//         //using JSON Web Token to ensure security - Ex: not deleting someone else's posts

//         //storng this token inside a cookie on the website
//         const token = jwt.sign({id:data[0].id}, "jwtkey")
//         const {password, ...other} = data[0]
//         res.cookie("access_token", token, {
//             //for extra security - it means that any script in the browser cannot reach the cookie directive
//             //we are using it only when we make api requests
//             httpOnly:true 
//         }).status(200).json(other)//to ensure security - not sending password
//     });
// };

export const login = async (req, res) => {
  try {
    // Check user
    const user = await users.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found!' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Wrong username or password!' });
    }

    // Using JSON Web Token for security
    const token = jwt.sign({ id: user.id }, 'jwtkey');
    console.log("cookie stored", token);
    // Storing the token inside a cookie on the website
    res.cookie('access_token', token, {
      httpOnly: true, // For extra security
    }).status(200).json({id: user.id, username: user.username, email: user.email, img: user.img }); // To ensure security - not sending password
    console.log("Logged In!",res.cookie);
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const logout = (req,res)=>{
    res.clearCookie("access_token", {
        sameSite:"none",
        secure:true
    }).status(200).json("User has been logged out!")
};