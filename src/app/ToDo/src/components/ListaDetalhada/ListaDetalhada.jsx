import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Search from '../Search/Search';
import BuyList from '../BuyList/BuyList';
import Form from '../Form/Form';
import api from '../../services/api';
import LoadingModal from '../LoadingModal/LoadingModal';
import Swal from 'sweetalert2';
import './ListaDetalhada.css';

export default function ListaDetalhada() {
  const [itens, setItens] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const { search: query } = useLocation();
  const navigate = useNavigate();
  const codigo = new URLSearchParams(query).get('codigolista') || '';
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const prevRawDataRef = useRef(null);

  const fetchProdutos = async (showLoading = false) => {
    if (!codigo) return;

    if (showLoading) setLoading(true);

    try {
      const resp = await api.get(`/produtos/${codigo}`, config);
      const rawData = resp.data; // Array de objetos vindos da API

      const rawString = JSON.stringify(rawData);
      const prevRaw = prevRawDataRef.current;
      const prevRawString = prevRaw ? JSON.stringify(prevRaw) : null;

      if (prevRaw && rawString !== prevRawString) {
        const prevMap = {};
        prevRaw.forEach((prod) => {
          prevMap[prod.id] = prod;
        });
        const newMap = {};
        rawData.forEach((prod) => {
          newMap[prod.id] = prod;
        });

        // Itens removidos
        prevRaw.forEach((prodPrev) => {
          if (!newMap[prodPrev.id]) {
            Swal.fire({
              icon: 'info',
              title: 'Item removido',
              text: `O item "${prodPrev.nome}" foi removido.`,
              timer: 2500,
              showConfirmButton: false,
            });
          }
        });

        // Itens marcados/desmarcados como comprados
        prevRaw.forEach((prodPrev) => {
          const prodNew = newMap[prodPrev.id];
          if (prodNew && prodPrev.flagComprado !== prodNew.flagComprado) {
            const status = prodNew.flagComprado
              ? 'foi marcado como comprado'
              : 'foi desmarcado';
            Swal.fire({
              icon: 'success',
              title: 'Status alterado',
              text: `O item "${prodNew.nome}" ${status}.`,
              timer: 2500,
              showConfirmButton: false,
            });
          }
        });
      }

      prevRawDataRef.current = rawData;

      const produtosFormatados = rawData.map((prod) => ({
        id: prod.id,
        nome: prod.nome,
        categoria: prod.categoria,
        quantidade: prod.quantidade,
        valor: prod.valor,
        medida: prod.medida,
        localSugerido: prod.localSugerido,
        flagComprado: prod.flagComprado,
      }));
      setItens(produtosFormatados);
    } catch (err) {
      if (err.response && (err.response.status === 404 || err.response.status === 401)) {
        // Lista vazia ou não encontrada, mas não deslogamos o usuário
        if (prevRawDataRef.current && prevRawDataRef.current.length > 0) {
          prevRawDataRef.current.forEach((prod) => {
            Swal.fire({
              icon: 'info',
              title: 'Item removido',
              text: `O item "${prod.nome}" foi removido.`,
              timer: 2500,
              showConfirmButton: false,
            });
          });
        }
        prevRawDataRef.current = [];
        setItens([]);
      } else {
        console.error('Erro ao buscar produtos:', err);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (!codigo) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Lista não existe',
      });
      navigate('/');
      return;
    }

    fetchProdutos(true);
    const intervalId = setInterval(() => {
      fetchProdutos(false);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [codigo, navigate]);

  const adicionarItem = async (itemDados) => {
    if (!token) {
      setAuthModalMessage('Faça login para adicionar itens.');
      setAuthModalVisible(true);
      setTimeout(() => setAuthModalVisible(false), 1500);
      return;
    }
    try {
      const body = {
        codigoLista: codigo,
        nome: itemDados.nome,
        categoria: itemDados.categoria,
        quantidade: itemDados.quantidade,
        valor: itemDados.valor,
        medida: itemDados.medida,
        localSugerido: itemDados.localSugerido,
        flagComprado: itemDados.flagComprado,
      };

      const res = await api.post('/produtos/criar', body, config);

      setItens((prev) => [
        ...prev,
        {
          id: res.data.idProduto,
          nome: itemDados.nome,
          categoria: itemDados.categoria,
          quantidade: itemDados.quantidade,
          valor: itemDados.valor,
          medida: itemDados.medida,
          localSugerido: itemDados.localSugerido,
          flagComprado: itemDados.flagComprado,
        },
      ]);
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    }
  };

  const removerItem = async (id) => {
    if (!token) {
      setAuthModalMessage('Faça login para remover itens.');
      setAuthModalVisible(true);
      setTimeout(() => setAuthModalVisible(false), 1500);
      return false;
    }
    try {
      await api.delete('/produtos/deletar', {
        ...config,
        data: { codigoLista: codigo, idProduto: id },
      });
      setItens((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Erro ao remover item:', err);
      return false;
    }
    return true;
  };

  const concluirItem = async (id) => {
    const item = itens.find((i) => i.id === id);
    if (!item) return;
    const novoStatus = !item.flagComprado;
    try {
      await api.put(
        '/produtos/atualizarFlags',
        { codigoLista: codigo, idProduto: id, comprado: novoStatus },
        config
      );
      setItens((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, flagComprado: novoStatus } : i
        )
      );
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
          .filter((item) =>
            item.nome.toLowerCase().includes(search.toLowerCase())
          )
          .map((item) => (
            <BuyList
              key={item.id}
              item={item}
              removeritem={removerItem}
              concluirItem={concluirItem}
              autenticado={token != null && token !== ''}
            />
          ))}

        {token && <Form novositens={adicionarItem} />}
      </div>
    </div>
  );
}