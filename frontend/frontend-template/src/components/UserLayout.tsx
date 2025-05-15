import React from "react"
import { Outlet } from "react-router-dom"
import Footer from "./Footer";
import UserHeader from "./UserHeader";

export default function UserLayout() {
    return (
        <div className="site-wrapper">
            <UserHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}