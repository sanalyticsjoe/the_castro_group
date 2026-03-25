
import React, { useState, useEffect, useRef } from 'react';
import SwipeableViews from 'react-swipeable-views';

const HomePage = ({ index, setIndex }) => {
  const [clients, setClients] = useState([]);
  const [note, setNote] = useState('');
  const swipeableActions = useRef(null);

  const handleChangeIndex = (index) => {
    setIndex(index);
  };

  const loadClients = async () => {
    try {
      const response = await fetch('/api/get-clients');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const clients = await response.json();
      setClients(clients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleSaveNote = async () => {
    if (note.trim() === '') {
      alert('Please enter a note.');
      return;
    }

    try {
      const response = await fetch('/api/save-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Note saved successfully!');
      setNote('');
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note.');
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <>
      <SwipeableViews index={index} onChangeIndex={handleChangeIndex} ref={swipeableActions}>
        <section id="scratchpad" className="screen">
          <h2><i className="fas fa-file-alt"></i>Scratchpad</h2>
          <textarea
            id="scratchpad-input"
            placeholder="Type or paste your notes here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <button id="save-scratchpad-btn" onClick={handleSaveNote}>Save</button>
        </section>
        <section id="todo" className="screen">
          <h2><i className="fas fa-list-check"></i>To-Do</h2>
          <p>Your tasks for the day will appear here.</p>
          <button className="open-detail-btn">Open Detail View</button>
        </section>
        <section id="crm" className="screen">
          <h2><i className="fas fa-address-book"></i>CRM</h2>
          <input type="search" id="client-search" placeholder="Search clients..." />
          <div id="client-list" className="grid">
            {clients.map((client) => (
              <div key={client.id} className="client-card">
                <h4>{client.name}</h4>
                <span className="status-badge" data-status={client.status}>{client.status}</span>
                <p>📧 {client.email || 'No Email'}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="transactions" className="screen">
          <h2><i className="fas fa-file-invoice-dollar"></i>Transactions</h2>
          <p>All your property transactions will be tracked here.</p>
        </section>
        <section id="leads" className="screen">
          <h2><i className="fas fa-funnel-dollar"></i>Leads</h2>
          <p>New leads will be listed here.</p>
        </section>
      </SwipeableViews>
    </>
  );
};

export default HomePage;
