import "./App.css"
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import MainLayout from "./components/MainLayout"
import UserLayout from "./components/UserLayout"
import UserLogin from "./components/UserLogin";
import Home from "./components/Home";
import Sheet from "./components/Sheet";
import Analytics from "./components/Analytics";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import Auth from "./components/Auth";
import AdminPanel from "./components/AdminPanel";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<UserLogin />}/>
      </Route>

        <Route path="user" element={<Auth><UserLayout /></Auth>}>
        <Route index element={<Home />} />
        <Route path="sheet" element={<Sheet />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="adminpanel" element={<AdminPanel />} />

      </Route>
    </>,
  ),
)

function App() {
  const[loading,setLoading]=useState(false);
    useEffect(()=>{
       setLoading(true)
       setTimeout(()=>{
           setLoading(false)

       },1000)

    },[])
    return (
      
      loading ? (
        <div className="spinner"> 
        <HashLoader
        
          color={"#d62424"}
          loading={loading}
          size={60}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> </div>
      ) : (
        <RouterProvider router={router} />
        
      )
      
    );
  }

export default App
