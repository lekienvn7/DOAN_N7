import React from "react";
import Header from "@/components/Header/Header";

const Layout = ({ children, noHeader = false, className = "" }) => {
  return (
    <div className={`min-h-screen text-[#2a2a2a] flex flex-col ${className}`}>
      {!noHeader && (
        <div className="home__header flex-shrink-0 whitespace-nowrap flex flex-row z-50 bg-[#121212]">
          <Header />
        </div>
      )}
      <main className="flex-grow ">{children}</main>
    </div>
  );
};

export default Layout;
