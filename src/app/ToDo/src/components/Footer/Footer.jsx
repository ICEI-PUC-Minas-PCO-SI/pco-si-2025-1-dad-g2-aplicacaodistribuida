import React from 'react';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.socialWrapper}>
      <div className={styles.brand}>CompraSync</div>
      <div className={styles.social}>
        <FaTwitter size={24} />
        <FaInstagram size={24} />
        <FaYoutube size={24} />
        <FaLinkedin size={24} />
      </div>
    </div>

    <div className={styles.column}>
      <h4>Sobre Nós</h4>
      <ul>
        <li><a href="#">Equipe</a></li>
        <li><a href="#">Sobre o CompraSync</a></li>
        <li><a href="#">Informações Para Nerds</a></li>
      </ul>
    </div>

    <div className={styles.column}>
      <h4>Contatos</h4>
      <ul>
        <li><a href="#">Email</a></li>
        <li><a href="#">Zap</a></li>
        <li><a href="#">Twitter</a></li>
        <li><a href="#">Facebook</a></li>
        <li><a href="#">Instagram</a></li>
        <li><a href="#">LinkedIn</a></li>
      </ul>
    </div>

    <div className={styles.column}>
      <h4>CompraSync</h4>
      <ul>
        <li><a href="#">Guia</a></li>
        <li><a href="#">Ideias</a></li>
        <li><a href="#">Parcerias</a></li>
      </ul>
    </div>
  </footer>
);

export default Footer;
