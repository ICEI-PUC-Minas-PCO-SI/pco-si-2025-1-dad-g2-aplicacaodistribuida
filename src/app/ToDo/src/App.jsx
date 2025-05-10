import { useState } from 'react';
import './App.css';

import BuyList from './components/BuyList/BuyList';
import Form    from './components/Form/Form';
import Search  from './components/Search/Search';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  const [itens, setItens]   = useState([
    { id: '1', text: 'Banana', category: 'Fruta', isCompleted: false },
    { id: '2', text: 'Macarrão',                    category: 'Massas',    isCompleted: false },
    { id: '3', text: 'Petisco Cachorro',                           category: 'Quem leu me deu',  isCompleted: false },
  ]);

  const [search, setSearch] = useState('');

  
  const adicionarItem = (text, category) => {
    const novoItem = {
      id: String(Math.floor(Math.random() * 1000000)),
      text,
      category,
      isCompleted: false
    };
    setItens(prev => [...prev, novoItem]);
  };

  const removerItem = id => {
    setItens(prev => prev.filter(item => item.id !== id));
  };

  const concluirItem = id => {
    setItens(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
  };

  return (
    <div className="layout">
    <Header />
    <div className="app">
      <h1>Lista de Compras 21452</h1>

      <Search search={search} setSearch={setSearch} />

      <div className="item-list">
        {itens
          .filter(item =>
            item.text.toLowerCase().includes(search.toLowerCase())
          )
          .map(item => (
            <BuyList
              key={item.id}
              item={item}
              removeritem={removerItem}
              concluirItem={concluirItem}
            />
        ))}
        <Form novositens={adicionarItem} />
      </div>

      
      
    </div>
    <Footer />
    </div>
  );
}

export default App;