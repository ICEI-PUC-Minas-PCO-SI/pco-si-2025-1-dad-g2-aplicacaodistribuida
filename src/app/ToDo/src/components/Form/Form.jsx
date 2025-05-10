import { useState } from 'react';
import style from './Form.module.css';

const Form = ({ novositens }) => {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');

  const funcenvio = e => {
    e.preventDefault();

    if (value === '' || category === '') {
      window.alert("Existe campo vazio");
      return;
    }

    novositens(value, category);  
    setValue('');                 
    setCategory('');
  };

  return (
    <div className={style.buylist}>
      <h2>Criar Tarefa</h2>
      <form onSubmit={funcenvio}>
        <input
          value={value}
          type="text"
          placeholder="Digite o título"
          onChange={e => setValue(e.target.value)}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Selecione uma opção</option>
          <option value="Massas">Massas</option>
          <option value="Fruta">Fruta</option>
          <option value="Diversos">Diversos</option>
        </select>
        <button type="submit">Criar Tarefa</button>
      </form>
    </div>
  );
};

export default Form;
