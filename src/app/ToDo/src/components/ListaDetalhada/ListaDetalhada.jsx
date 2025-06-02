// components/ListaDetalhada/ListaDetalhada.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Search from '../Search/Search';
import BuyList from '../BuyList/BuyList';
import Form from '../Form/Form';
import api from '../../services/api';
import LoadingModal from '../LoadingModal/LoadingModal';
import './ListaDetalhada.css';

export default function ListaDetalhada() {
  const [itens, setItens] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const { search: query } = useLocation();
  const codigo = new URLSearchParams(query).get('codigolista') || '';
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!codigo) return;
      setLoading(true);
      try {
        const resp = await api.get(`/produtos/${codigo}`);
        const produtosFormatados = resp.data.map(prod => ({
          id: prod.id,
          text: prod.nome,
          category: prod.categoria,
          isCompleted: prod.flagComprado
        }));
        setItens(produtosFormatados);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
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
      return setTimeout(() => setAuthModalVisible(false), 1500);
    }
    try {
      const body = { codigoLista: codigo, nome: text, categoria: category, quantidade: 1, valor: 0, medida: '', localSugerido: '' };
      const res = await api.post('/produtos/criar', body, config);
      setItens(prev => [...prev, { id: res.data.idProduto, text, category, isCompleted: false }]);
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    }
  };

  const removerItem = async id => {
    if (!token) {
      setAuthModalMessage('Faça login para remover itens.');
      setAuthModalVisible(true);
      setTimeout(() => setAuthModalVisible(false), 1500);
      return false;
    }
    try {
      await api.delete('/produtos/deletar', { ...config, data: { codigoLista: codigo, idProduto: id } });
      setItens(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Erro ao remover item:', err);
      return false;
    }
    return true;
  };

  const concluirItem = async id => {
    const item = itens.find(i => i.id === id);
    if (!item) return;
    const novoStatus = !item.isCompleted;
    try {
      await api.put('/produtos/atualizarFlags', { codigoLista: codigo, idProduto: id, comprado: novoStatus }, config);
      setItens(prev => prev.map(i => i.id === id ? { ...i, isCompleted: novoStatus } : i));
    } catch (err) {
      console.error('Erro ao concluir item:', err);
    }
  };

  return (
    <div className="app" style={{ opacity: loading ? 0.5 : 1 }}>
      <LoadingModal visible={loading} message="Carregando dados…" />
      <LoadingModal visible={authModalVisible} message={authModalMessage} />
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
              autenticado={(token != null && token != "")}
            />
          ))}
        {token && <Form novositens={adicionarItem} />}
      </div>
    </div>
  );
}
