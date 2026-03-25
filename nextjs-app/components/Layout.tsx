
import React from 'react';
import Head from 'next/head';

const Layout = ({ children, index, setIndex }) => {
  const handleNavClick = (newIndex) => {
    setIndex(newIndex);
  };

  return (
    <>
      <Head>
        <title>Ride or Die</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        :root {
          --bg-color: #0E7490; /* Dark Teal from logo */
          --card-bg: #083344; /* Darker shade for cards/nav */
          --text-main: #f0f9ff; /* Light cyan/white for text */
          --text-muted: #a3a3a3;
          --primary: #f0f9ff;
          --primary-active: #ffffff;
          --header-height: 60px;
          --nav-height: 60px;
          --title-font: 'Poppins', sans-serif;
          --body-font: 'Roboto', sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: var(--body-font);
          background-color: var(--bg-color);
          color: var(--text-main);
          margin: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden; /* Prevents body scroll */
        }

        .main-header {
          display: flex;
          align-items: center;
          height: var(--header-height);
          background-color: var(--card-bg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .header-title-container {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          padding-right: 1rem; /* Balance padding */
        }
        .main-header h1 {
          font-family: var(--title-font);
          font-weight: 500; /* Less bold */
          text-transform: uppercase; /* All caps */
          font-size: 1.2rem; /* Smaller font size to fit on screen */
          display: flex; /* Use flexbox to align icon and text */
          align-items: center;
        }
        .main-header h1 i {
          margin-left: 0.5rem; /* Space between title and icon */
        }
        .main-header .logo {
          height: var(--header-height); /* Fill the header height */
          width: auto; /* Maintain aspect ratio */
          margin-right: 1rem; /* Space between logo and title */
        }

        .swipe-container {
          flex-grow: 1;
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch; /* Momentum scrolling on iOS */
        }

        .screen {
          flex: 0 0 100%;
          width: 100%;
          scroll-snap-align: start;
          padding: 1.5rem;
          overflow-y: auto;
        }
        .screen h2 {
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .bottom-nav {
          display: flex;
          justify-content: space-around;
          height: var(--nav-height);
          background-color: var(--card-bg);
          box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
          position: sticky;
          bottom: 0;
          z-index: 10;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-grow: 1;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.75rem;
          transition: color 0.2s ease;
        }
        .nav-item i { font-size: 1.25rem; margin-bottom: 4px; }
        .nav-item.active { color: var(--primary-active); }

        /* Detail View */
        .detail-view {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: var(--bg-color);
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 20;
          display: flex;
          flex-direction: column;
        }
        .detail-view.active {
          transform: translateY(0);
        }
        .detail-header {
          display: flex;
          align-items: center;
          padding: 0 1rem;
          height: var(--header-height);
          background-color: var(--card-bg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          flex-shrink: 0;
        }
        .detail-header h3 { margin: 0; flex-grow: 1; text-align: center; }
        .detail-header button {
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
        }
        .detail-content {
          padding: 1.5rem;
          flex-grow: 1;
          overflow-y: auto;
        }

        /* Search Bar Style */
        #client-search {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1.5rem;
          background-color: var(--card-bg);
          border: 1px solid #0e7490;
          border-radius: 8px;
          color: var(--text-main);
          font-size: 1rem;
        }
        #client-search::placeholder {
          color: var(--text-muted);
        }

        /* Client Card Styles */
        .client-card {
          background-color: var(--card-bg);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .client-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        }
        .client-card h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: var(--text-main);
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: #1e40af; /* Default blue */
          color: #dbeafe;
          margin-bottom: 1rem;
        }
        .status-badge[data-status="Lead"] { background-color: #991b1b; color: #fee2e2; }
        .status-badge[data-status="Active Buyer"] { background-color: #1e40af; color: #dbeafe; }
        .status-badge[data-status="Under Contract"] { background-color: #b45309; color: #fef3c7; }
        .client-card p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        /* Detail View Content Styles */
        .detail-content h4 {
          font-family: var(--title-font);
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--bg-color);
          padding-bottom: 0.5rem;
        }
        .detail-content h4:first-child { margin-top: 0; }
        .detail-content p {
          font-size: 1rem;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Detail View Photo */
        .detail-photo {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          margin: 0 auto 1.5rem auto;
          border: 3px solid var(--card-bg);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .detail-photo-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          font-size: 3rem;
          color: var(--text-muted);
        }
        #scratchpad-input {
          width: 100%;
          height: 200px;
          background-color: var(--card-bg);
          border: 1px solid #0e7490;
          border-radius: 8px;
          color: var(--text-main);
          font-size: 1rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        #save-scratchpad-btn {
          width: 100%;
          padding: 1rem;
          background-color: var(--primary);
          color: var(--card-bg);
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
      <header className="main-header">
        <img src="/images/your-logo.png" alt="Company Logo" className="logo" />
        <div className="header-title-container">
          <h1>Ride or Die <i className="fas fa-skull-crossbones"></i></h1>
        </div>
      </header>
      <main className="swipe-container">{children}</main>
      <nav className="bottom-nav">
        <a href="#" onClick={() => handleNavClick(0)} className={`nav-item ${index === 0 ? 'active' : ''}`}>
          <i className="fas fa-file-alt"></i>
          <span>Scratchpad</span>
        </a>
        <a href="#" onClick={() => handleNavClick(1)} className={`nav-item ${index === 1 ? 'active' : ''}`}>
          <i className="fas fa-check-square"></i>
          <span>To-Do</span>
        </a>
        <a href="#" onClick={() => handleNavClick(2)} className={`nav-item ${index === 2 ? 'active' : ''}`}>
          <i className="fas fa-users"></i>
          <span>CRM</span>
        </a>
        <a href="#" onClick={() => handleNavClick(3)} className={`nav-item ${index === 3 ? 'active' : ''}`}>
          <i className="fas fa-handshake"></i>
          <span>Transactions</span>
        </a>
        <a href="#" onClick={() => handleNavClick(4)} className={`nav-item ${index === 4 ? 'active' : ''}`}>
          <i className="fas fa-lightbulb"></i>
          <span>Leads</span>
        </a>
      </nav>
    </>
  );
};

export default Layout;
