import { useState, useEffect } from 'react';


import './App.css';

import BuyList      from './components/BuyList/BuyList';
import Form         from './components/Form/Form';
import Search       from './components/Search/Search';
import Header       from './components/Header/Header';
import Footer       from './components/Footer/Footer';
import LoadingModal from './components/LoadingModal/LoadingModal';
import api          from './services/api';

function App() {
  
useEffect(() => {
    const autenticar = async () => {
      try {
        const response = await api.post('/auth/login', {
          email: 'admin@example.com',
          senha: 'senhaadmin'
        });
        const { token } = response.data;
        localStorage.setItem('token', token);
        console.log('Token de teste válido obtido e salvo:', token);
      } catch (error) {
        console.error('Erro ao autenticar usuário de teste:', error);
      }
    };
    autenticar();
  }, []);

  const [itens, setItens]             = useState([]);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const codigo = new URLSearchParams(window.location.search).get('codigolista') || '';
  const token  = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!codigo) return;
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/produtos/${codigo}`);
        const produtosFormatados = response.data.map(prod => ({
          id: prod.id,
          text: prod.nome,
          category: prod.categoria,
          isCompleted: prod.flagComprado
        }));
        setItens(produtosFormatados);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [codigo]);


  const adicionarItem = async (text, category) => {
    if (!token) {
      setAuthModalMessage('Faça login para adicionar itens.');
      setAuthModalVisible(true);
      setTimeout(() => setAuthModalVisible(false), 1500);
      return;
    }
    try {
      const body = {
        codigoLista: codigo,
        nome: text,
        categoria: category,
        quantidade: 1,
        valor: 0,
        medida: '',
        localSugerido: ''
      };
      const res = await api.post('/produtos/criar', body, config);
      setItens(prev => [...prev, { id: res.data.idProduto, text, category, isCompleted: false }]);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const removerItem = async id => {
    if (!token) {
      setAuthModalMessage('Faça login para remover itens.');
      setAuthModalVisible(true);
      setTimeout(() => setAuthModalVisible(false), 1500);
      return;
    }
    try {
      await api.delete('/produtos/deletar', {
        ...config,
        data: { codigoLista: codigo, idProduto: id }
      });
      setItens(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao remover item:', error);
    }
  };

  const concluirItem = async id => { 
    const item = itens.find(i => i.id === id);
    if (!item) return;
    const novoStatus = !item.isCompleted;
    try {
      await api.put('/produtos/atualizarFlags', {
        codigoLista: codigo,
        idProduto: id,
        comprado: novoStatus
      });
      setItens(prev => prev.map(i => i.id === id ? { ...i, isCompleted: novoStatus } : i));
    } catch (error) {
      console.error('Erro ao concluir item:', error);
    }
  };

  const hasToken = Boolean(token);

  return (
    <div className="layout">
      <Header token={token} />
      <LoadingModal visible={loading} message="Carregando dados..." />
      <LoadingModal visible={authModalVisible} message={authModalMessage} />

      <div className="app" style={{ opacity: loading ? 0.5 : 1 }}>
        <h1>Lista de Compras: {codigo}</h1>
        <Search search={search} setSearch={setSearch} />

        <div className="item-list">
          {itens
            .filter(item => item.text.toLowerCase().includes(search.toLowerCase()))
            .map(item => (
              <BuyList
                key={item.id}
                item={item}
                removeritem={removerItem}
                concluirItem={concluirItem}
              />
            ))
          }

          {hasToken && <Form novositens={adicionarItem} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
