import React from "react";
import Header from "@/components/Header/Header";

const Layout = ({ children, noHeader = false, className = "" }) => {
  return (
    <div>
      {!noHeader && (
        <div
          className="
          sticky
          top-[0px]
            home__header
            flex-shrink-0
            whitespace-nowrap
            flex flex-row
            z-50
            bg-[rgba(255,255,255,0.85)]
        backdrop-blur-md
          "
        >
          <Header />
        </div>
      )}
      <div
        className={`
          min-h-screen
          max-w-screen
          flex flex-col
          bg-[var(--bg-page)]
          text-[var(--text-primary)]
          ${className}
        `}
      >
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
