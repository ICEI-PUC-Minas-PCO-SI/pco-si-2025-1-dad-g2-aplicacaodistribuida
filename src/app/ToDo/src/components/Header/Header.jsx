
import React from 'react';
import style from './Header.module.css';

const Header = () => (
  <header className={style.header}>
    <span className={style.brand}>ElderCare</span>
    <nav className={style.nav}>
      <a href="#" className={style.link}>Sobre Nós</a>
      <button className={style.logar}>Logar</button>
      <button className={style.registrar}>Registrar</button>
    </nav>
  </header>
);

export default Header;
