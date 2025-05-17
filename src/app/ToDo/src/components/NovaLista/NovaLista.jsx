import React, { useState, useEffect } from 'react';
import style from './NovaLista.module.css';

const NovaLista = () => {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
  });

  const [lista, setLista] = useState([]);

  // Carrega as listas salvas no localStorage ao inicializar
  useEffect(() => {
    const storedList = localStorage.getItem('listas');
    if (storedList) {
      setLista(JSON.parse(storedList));
    }
  }, []);

  // Salva as listas no localStorage sempre que ela for atualizada
  useEffect(() => {
    localStorage.setItem('listas', JSON.stringify(lista));
  }, [lista]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se o código já existe
    const codigoExistente = lista.some(item => item.codigo === formData.codigo);
    if (codigoExistente) {
      alert('Já existe uma lista com esse código.');
      return;
    }

    setLista((prev) => [...prev, formData]);
    setFormData({ codigo: '', nome: '', descricao: '' });
  };

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <h2>Criar Nova Lista</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Código:</label>
            <input
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Nome:</label>
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Descrição:</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Adicionar</button>
        </form>

        <h3>Itens Criados</h3>
        <ul className={style.itemList}>
          {lista.map((item, index) => (
            <li key={index}>
              <strong>{item.codigo}</strong> - {item.nome}
              <br />
              <em>{item.descricao}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NovaLista;
