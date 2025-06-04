// src/components/Form/Form.jsx
import { useState } from 'react';
import style from './Form.module.css';
import Swal from 'sweetalert2';

const Form = ({ novositens, onClose }) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valor, setValor] = useState(0);
  const [medida, setMedida] = useState('');
  const [localSugerido, setLocalSugerido] = useState('');

  const funcenvio = (e) => {
    e.preventDefault();

    if (nome.trim() === '' || categoria.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nome e categoria são obrigatórios',
      });
      return;
    }

    const novoItem = {
      nome: nome.trim(),
      categoria,
      quantidade: Number(quantidade) || 1,
      valor: Number(valor) || 0,
      medida: medida.trim(),
      localSugerido: localSugerido.trim(),
      flagComprado: false,
    };

    novositens(novoItem);

    // Limpa campos
    setNome('');
    setCategoria('');
    setQuantidade(1);
    setValor(0);
    setMedida('');
    setLocalSugerido('');

    // Toast de sucesso
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Item Adicionado',
    });

    // Fecha o modal
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className={style['modalContent']}>
      <h2 className={style.title}>Cadastrar Item</h2>
      <form onSubmit={funcenvio} className={style['buylist-form']}>
        <input
          value={nome}
          type="text"
          placeholder="Digite o nome do produto"
          onChange={(e) => setNome(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Selecione uma Categoria</option>
          <option value="Massas">Massas</option>
          <option value="Fruta">Fruta</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Carnes">Carnes</option>
          <option value="Frios">Frios</option>
          <option value="Limpeza">Limpeza</option>
          <option value="Higiene">Higiene</option>
          <option value="Diversos">Diversos</option>
        </select>

        <input
          value={quantidade}
          type="number"
          min="1"
          placeholder="Quantidade"
          onChange={(e) => setQuantidade(e.target.value)}
        />

        <input
          value={valor}
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor (R$)"
          onChange={(e) => setValor(e.target.value)}
        />

        <input
          value={medida}
          type="text"
          placeholder="Unidade de medida (e.g. kg, L, un)"
          onChange={(e) => setMedida(e.target.value)}
        />

        <input
          value={localSugerido}
          type="text"
          placeholder="Local Sugerido"
          onChange={(e) => setLocalSugerido(e.target.value)}
        />

        <div className={style['button-group']}>
          <button type="submit">Cadastrar</button>
          <button
            type="button"
            className={style.cancelButton}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
