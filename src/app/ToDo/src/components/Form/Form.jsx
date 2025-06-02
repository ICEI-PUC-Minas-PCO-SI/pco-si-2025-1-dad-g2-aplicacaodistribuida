import { useState } from 'react';
import style from './Form.module.css';
import Toast from '../Toast/Toast'; 
import Swal from 'sweetalert2';
const Form = ({ novositens }) => {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const mostrarToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 3000);
  };

  const funcenvio = e => {
    e.preventDefault();

    if (value === '' || category === '') {
     Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Existem campos vazios",
});
      return;
    }

    novositens(value, category);  
    setValue('');
    setCategory('');
    const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "success",
  title: "Item Adiconado"
});
  };

  return (
    <div className={style.buylist}>
      <h2>Adicionar Produto</h2>
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
        <button type="submit">Adicionar a Lista</button>
      </form>

      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Form;
