import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import AddBlog from "./pages/AddBlog"
import BlogPost from "./pages/BlogPost"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./style.scss";

const Layout = ()=>{
  return(
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

//router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    //Using Layout to share common components like Navbar and Footer
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/post/:id",
        element: <BlogPost/>
      },
      {
        path: "/write",
        element: <AddBlog/>
      }
    ]
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
]); 

function App() {
  return (
    <div className="app">
      <div className = "container">
      <RouterProvider router={router}/>
      </div>
    </div>
  )
}

export default App;
