import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import style from './Header.module.css';
import logoImg from './logo.png';
import profileIcon from './icone.jpg';
import api from '../../services/api';
import LoadingModal from '../LoadingModal/LoadingModal';
import Swal from 'sweetalert2';

const Modal = ({ title, fields, onClose, onSubmit }) => {
  const [values, setValues] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {})
  );

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(values);
  };

  return ReactDOM.createPortal(
    <div className={style.modalOverlay}>
      <div className={style.modal}>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(f => (
            <div key={f.name} className={style.formGroup}>
              <label htmlFor={f.name}>{f.label}</label>
              <input
                id={f.name}
                type={f.type || 'text'}
                name={f.name}
                value={values[f.name]}
                onChange={handleChange}
                required={f.required}
              />
            </div>
          ))}
          <div className={style.actions}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Header = ({ token }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = async ({ email, senha }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, senha });
      const { token: newToken } = res.data;
      localStorage.setItem('token', newToken);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Bem vindo de volta',
        showConfirmButton: false,
        timer: 1500
      });

      setShowLogin(false);

      setTimeout(() => {
        window.location.reload();
      }, 1600);
    } catch (err) {
      const msg = err.response?.status === 401
        ? 'Credenciais inválidas'
        : 'Erro ao fazer login';

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ nome, email, senha }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/registro', { nome, email, senha });
      const { token: newToken } = res.data;
      localStorage.setItem('token', newToken);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Obrigado por criar uma conta',
        showConfirmButton: false,
        timer: 1500
      });

      setShowRegister(false);
      setTimeout(() => {
        window.location.reload();
      }, 1600);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao registrar usuário';

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('token');

  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Deslogado com sucesso',
    showConfirmButton: false,
    timer: 2000
  }).then(() => {

    window.location.href = '/';
    window.location.reload();
  });
};

  return (
    <>
      <header className={style.header}>
        <NavLink to="/" className={style.link}>
          <img src={logoImg} alt="Logo CompraSync" className={style.logo} />
        </NavLink>
        <nav className={style.nav}>
          <NavLink to="/" className={style.link}>Sobre Nós</NavLink>
          {!token ? (
            <>
              <button className={style.logar} onClick={() => setShowLogin(true)}>Logar</button>
              <button className={style.registrar} onClick={() => setShowRegister(true)}>Registrar</button>
            </>
          ) : (
            <>
              <NavLink to="/listagem" className={style.link}>Minhas Listas</NavLink>
              <div className={style.profileWrapper} ref={dropdownRef}>
                <div
                  className={style.profileIcon}
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{ backgroundImage: `url(${profileIcon})` }}
                />
                {dropdownOpen && (
                  <div className={style.dropdown}>
                    <NavLink to="/listagem" className={style.dropdownItem}>
                      Minhas Listas
                    </NavLink>
                    <button
                      className={style.dropdownItem}
                      onClick={handleLogout}
                    >
                      Deslogar
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {showLogin && (
          <Modal
            title="Login"
            fields={[
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'senha', label: 'Senha', type: 'password', required: true }
            ]}
            onClose={() => setShowLogin(false)}
            onSubmit={handleLogin}
          />
        )}

        {showRegister && (
          <Modal
            title="Registrar"
            fields={[
              { name: 'nome', label: 'Nome', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'senha', label: 'Senha', type: 'password', required: true }
            ]}
            onClose={() => setShowRegister(false)}
            onSubmit={handleRegister}
          />
        )}
      </header>
      {ReactDOM.createPortal(
        <LoadingModal visible={loading} message="Carregando..." />,
        document.body
      )}
    </>
  );
};

export default Header;
