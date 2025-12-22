import React from "react";
import Header from "@/components/Header/Header";

const Layout = ({ children, noHeader = false, className = "" }) => {
  return (
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
      {!noHeader && (
        <div
          className="
            home__header
            flex-shrink-0
            whitespace-nowrap
            flex flex-row
            z-50
            bg-[var(--bg-panel)]
            backdrop-blur-[18px]
          "
        >
          <Header />
        </div>
      )}

      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
