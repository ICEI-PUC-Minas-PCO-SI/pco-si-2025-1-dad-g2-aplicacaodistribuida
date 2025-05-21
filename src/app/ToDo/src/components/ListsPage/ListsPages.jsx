import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingModal from '../LoadingModal/LoadingModal'; 
import HomePage from '../HomePage/HomePage';

export default function ListsPage() {
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');


  
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const fetchListas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/listasCompras');
      const data = Array.isArray(res.data) ? res.data : [];
      setListas(data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate('/');
      } else {
        alert('Erro ao buscar listas: ' + (err.response?.data?.message || err.message));
      }
      setListas([]);
    } finally {
      setLoading(false);
    }
  };
  const shareLista = (codigo) => {
    const url = `${window.location.origin}/?codigolista=${codigo}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('URL copiada: ' + url))
      .catch(() => alert('Falha ao copiar URL'));
  };

  const createLista = async () => {
    const nome = prompt('Nome da nova lista:');
    if (!nome) return;
    const descricao = prompt('Descrição da nova lista:');
    try {
      const res = await api.post('/listasCompras/criar', { nome, descricao });
      alert('Lista criada com código: ' + res.data.codigo);
      fetchListas();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar lista: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <LoadingModal visible={loading} message="Carregando listas..." />
      {!loading && (
        <div style={{ padding: 32, background: '#f3f4f6', minHeight: '100vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Minhas Listas de Compras</h1>
            <button
              onClick={createLista}
              style={{ background: '#3b82f6', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Criar Nova Lista
            </button>
          </div>

          {listas.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {listas.map(lista => (
                <div
                  key={lista.codigo}
                  style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                  onClick={() => navigate(`/?codigolista=${lista.codigo}`)}
                >
                  <h2 style={{ fontSize: 18, fontWeight: '600' }}>{lista.nome}</h2>
                  <p style={{ color: '#4b5563', marginBottom: 12 }}>{lista.descricao}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/?codigolista=${lista.codigo}`); }}
                      style={{ background: 'none', border: 'none', textDecoration: 'underline', padding: 0, fontSize: 14, color: '#3b82f6', cursor: 'pointer' }}
                    >
                      Acessar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); shareLista(lista.codigo); }}
                      style={{ background: 'none', border: 'none', textDecoration: 'underline', padding: 0, fontSize: 14, color: '#10b981', cursor: 'pointer' }}
                    >
                      Compartilhar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#6b7280', marginTop: 32 }}>
              Nenhuma lista encontrada. Crie sua primeira lista!
            </div>
          )}
        </div>
      )}
    </>
  );
}