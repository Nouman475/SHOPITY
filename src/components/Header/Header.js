import { useAuthContext } from "contexts/AuthContext";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const { isAuthenticated } = useAuthContext();
  let nav = useRef(null);

  const toggleMenu = () => {
    nav.current.classList.toggle("active");
  };

  return (
    <header className="header container">
      <div className="logo">
        <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/shopping_cart.png" alt="Logo" />
        <span>Shopity</span>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav className="nav" ref={nav}>
        {isAuthenticated ? (
          <>
            <Link to="/products">Products</Link>
            <Link to="/dashboard">Seller Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/auth/login">Sign In</Link>
          </>
        )}
      </nav>
    </header>
  );
}
