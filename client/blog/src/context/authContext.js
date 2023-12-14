import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()
//to use user state anywhere in the application

export const AuthContextProvider = ({children})=>{
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)

    const login = async(inputs)=>{
        const res = await axios.post("https://three35finalapi.onrender.com/api/auth/login", inputs);
        console.log("CUrrent User set to ", res.data);
        setCurrentUser(res.data)
    };

    const logout = async(inputs)=>{
        await axios.post("https://three35finalapi.onrender.com/api/auth/logout");
        setCurrentUser(null)
    };

    useEffect(()=>{
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser])

    return (
        <AuthContext.Provider value = {{currentUser, login, logout}}>
        {children}
        </AuthContext.Provider>
    );
};
