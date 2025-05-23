import React from "react"
import {Outlet} from "react-router-dom"
import Footer from "./Footer";

export default function MainLayout() {
    return (
        <div className="site-wrapper">
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}