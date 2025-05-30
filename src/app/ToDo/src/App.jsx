
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ListaDetalhada from './components/ListaDetalhada/ListaDetalhada';
import ListsPage from './components/ListsPage/ListsPages';

function App() {
  const { search } = useLocation();
  const codigo = new URLSearchParams(search).get('codigolista') || '';
  const token = localStorage.getItem('token');

  return (
    <div className="layout">
      <Header token={token} />
      <Routes>
        <Route path="/" element={!codigo ? <HomePage /> : <ListaDetalhada />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/listagem" element={<ListsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
