// components/ListaDetalhada/ListaDetalhada.jsx
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

  // Ref para guardar os dados brutos da última resposta (array de produtos)
  const prevRawDataRef = useRef(null);

  /**
   * Faz o GET na API e, se detectar mudança em relação ao prevRawDataRef.current,
   * identifica itens removidos ou marcados como comprados e exibe um Swal para cada mudança,
   * depois formata e atualiza o state.
   *
   * Se a lista não existir (404), exibe um alerta e redireciona à home.
   *
   * @param {boolean} showLoading — se true, exibe o LoadingModal (usado apenas na carga inicial)
   */
  const fetchProdutos = async (showLoading = false) => {
    if (!codigo) return;

    if (showLoading) {
      setLoading(true);
    }

    try {
      const resp = await api.get(`/produtos/${codigo}`);
      const rawData = resp.data; // Array vindo da API

      // Converter o array em string para compararmos a “versão” anterior
      const rawString = JSON.stringify(rawData);
      const prevRaw = prevRawDataRef.current;
      const prevRawString = prevRaw ? JSON.stringify(prevRaw) : null;

      // Se não havia dado anterior (primeira carga) OU se mudou algo, processar diferenças
      if (prevRaw && rawString !== prevRawString) {
        // Montar maps por id
        const prevMap = {};
        prevRaw.forEach((prod) => {
          prevMap[prod.id] = prod;
        });
        const newMap = {};
        rawData.forEach((prod) => {
          newMap[prod.id] = prod;
        });

        // 1) Itens removidos: presentes em prevMap, mas não em newMap
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

        // 2) Itens marcados/desmarcados como comprados: mesmo id, flagComprado diferente
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

      // Atualiza ref e estado, caso seja primeira carga ou tenha mudado algo
      if (!prevRaw || rawString !== prevRawString) {
        prevRawDataRef.current = rawData;

        const produtosFormatados = rawData.map((prod) => ({
          id: prod.id,
          text: prod.nome,
          category: prod.categoria,
          isCompleted: prod.flagComprado,
        }));

        setItens(produtosFormatados);
      }
    } catch (err) {
      // Se a API retornar 404 (lista não encontrada), mostra alerta e volta à home
      if (err.response && err.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Lista não existe',
        });
        navigate('/');
        return;
      } else {
        console.error('Erro ao buscar produtos:', err);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!codigo) {
      // Se não houve código na URL, redireciona imediatamente para home
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Lista não existe',
      });
      navigate('/');
      return;
    }

    // 1) Chamada inicial com modal de loading
    fetchProdutos(true);

    // 2) Polling de 3 segundos sem acionar o loading
    const intervalId = setInterval(() => {
      fetchProdutos(false);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [codigo, navigate]);

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
        localSugerido: '',
      };
      const res = await api.post('/produtos/criar', body, config);

      // Atualiza o state local imediatamente para feedback instantâneo
      setItens((prev) => [
        ...prev,
        { id: res.data.idProduto, text, category, isCompleted: false },
      ]);

      // Se preferir forçar recarga total, descomente abaixo:
      // prevRawDataRef.current = null;
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

      // Atualiza localmente
      setItens((prev) => prev.filter((item) => item.id !== id));

      // Se preferir forçar recarga total, descomente abaixo:
      // prevRawDataRef.current = null;
    } catch (err) {
      console.error('Erro ao remover item:', err);
      return false;
    }
    return true;
  };

  const concluirItem = async (id) => {
    const item = itens.find((i) => i.id === id);
    if (!item) return;
    const novoStatus = !item.isCompleted;
    try {
      await api.put(
        '/produtos/atualizarFlags',
        { codigoLista: codigo, idProduto: id, comprado: novoStatus },
        config
      );
      // Atualiza somente o flag do item no state
      setItens((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, isCompleted: novoStatus } : i
        )
      );

      // Se preferir forçar recarga total, descomente abaixo:
      // prevRawDataRef.current = null;
    } catch (err) {
      console.error('Erro ao concluir item:', err);
    }
  };

  return (
    <div className="app" style={{ opacity: loading ? 0.5 : 1 }}>
      {/* Só aparece no carregamento inicial */}
      <LoadingModal visible={loading} message="Carregando dados…" />
      <LoadingModal visible={authModalVisible} message={authModalMessage} />

      <h1>Lista de Compras: {codigo}</h1>
      <Search search={search} setSearch={setSearch} />

      <div className="item-list">
        {itens
          .filter((item) =>
            item.text.toLowerCase().includes(search.toLowerCase())
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
