import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="flex-grow container mx-auto p-4">
                <Outlet />
            </main>
            {/* Footer */}
            <Footer />
            
        </div>
    );
};

export default AppLayout;
