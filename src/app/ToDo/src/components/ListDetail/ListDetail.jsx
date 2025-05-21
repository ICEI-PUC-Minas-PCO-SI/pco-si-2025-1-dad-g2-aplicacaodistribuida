// src/components/ListDetail/ListDetail.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Search       from '../Search/Search';
import BuyList      from '../BuyList/BuyList';
import Form         from '../Form/Form';
import Footer       from '../Footer/Footer';

const ListDetail = ({
  itens,
  fetchProdutos,
  adicionarItem,
  removerItem,
  concluirItem
}) => {
  const { search } = useLocation();
  const codigo     = new URLSearchParams(search).get('codigolista') || '';
  const [busca, setBusca] = React.useState('');

  useEffect(() => {
    fetchProdutos(codigo);
  }, [codigo, fetchProdutos]);

  if (!codigo) {
    return <p>Nenhum código de lista informado.</p>;
  }

  return (
    <div className="app" style={{ opacity: 0 }}>
      <h1>Lista de Compras: {codigo}</h1>
      <Search search={busca} setSearch={setBusca} />

      <div className="item-list">
        {itens
          .filter(item => item.text.toLowerCase().includes(busca.toLowerCase()))
          .map(item => (
            <BuyList
              key={item.id}
              item={item}
              removeritem={() => removerItem(codigo, item.id)}
              concluirItem={() => concluirItem(codigo, item.id)}
            />
          ))
        }
        {adicionarItem && <Form novositens={(text, cat) => adicionarItem(codigo, text, cat)} />}
      </div>

      <Footer />
    </div>
  );
};

export default ListDetail;
