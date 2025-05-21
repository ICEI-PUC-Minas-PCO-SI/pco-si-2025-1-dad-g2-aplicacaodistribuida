import React, { useState } from 'react';
import './HomePage.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const HomePage = () => {
  const [code, setCode] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = e => {
    e.preventDefault();
    if (!code.trim()) return;
    window.location.href = `${window.location.pathname}?codigolista=${encodeURIComponent(code)}`;
  };

  return (
    <div className="home-container">
      <Header token={token} />

      <main className="home-main">
        <h1>Bem Vindo ao CompraSync</h1>
        <p>Insira o código da sua Lista</p>
        <form onSubmit={handleSubmit} className="home-form">
          <input
            type="text"
            placeholder="Código da Lista"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
