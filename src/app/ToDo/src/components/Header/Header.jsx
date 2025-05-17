import React, { useState, useRef, useEffect } from 'react';
import style from './Header.module.css';

const Header = ({ token }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <header className={style.header}>
      <span className={style.brand}>ElderCare</span>
      <nav className={style.nav}>
        <a href="#" className={style.link}>Sobre Nós</a>

        {!token ? (
          <>          
            <button className={style.logar}>Logar</button>
            <button className={style.registrar}>Registrar</button>
          </>
        ) : (
          <>
            <a href="#" className={style.link}>Minhas Listas</a>
            <div className={style.profileWrapper} ref={dropdownRef}>
              <div className={style.profileIcon} onClick={handleProfileClick} />
              {dropdownOpen && (
                <div className={style.dropdown}>
                  <a href="#" className={style.dropdownItem}>Minhas Listas</a>
                  <button className={style.dropdownItem} onClick={() =>{}}>Deslogar</button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
