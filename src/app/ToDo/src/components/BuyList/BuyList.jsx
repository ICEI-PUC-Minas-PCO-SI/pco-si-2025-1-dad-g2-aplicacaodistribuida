import { useState } from 'react';
import style from './BuyList.module.css';
import Toast from '../Toast/Toast'; 

const BuyList = ({ item, removeritem, concluirItem, autenticado }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const mostrarToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 3500); 
  };

  const handleConcluir = id => {
    concluirItem(id);
    mostrarToast("Produto comprado", "info");
  };

  const handleRemover = async id => {
    var success = await removeritem(id);
    if (!success) return;
    mostrarToast("Item removido da lista!", "warning");
  };

  return (
    <>
      <div className={style.item} style={{ textDecoration: item.isCompleted ? "line-through" : "" }}>
        <div className={style.content}>
          <p className={style.text}>{item.text}</p>
          <p className={style.category}>{item.category}</p>
        </div>
        <div>
          <button onClick={() => handleConcluir(item.id)} className={style.complete}>Já Comprei</button>
          {autenticado && <button onClick={() => handleRemover(item.id)} className={style.remove}>X</button>}
        </div>
      </div>

      {/* Toast no canto superior direito */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} position />
    </>
  );
};

export default BuyList;
