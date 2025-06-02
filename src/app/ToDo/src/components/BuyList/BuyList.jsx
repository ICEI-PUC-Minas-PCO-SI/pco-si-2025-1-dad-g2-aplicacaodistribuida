import { useState } from 'react';
import style from './BuyList.module.css';
import Toast from '../Toast/Toast'; 
import Swal from 'sweetalert2';

const BuyList = ({ item, removeritem, concluirItem, autenticado }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const mostrarToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 3500); 
  };

  // Novo handleConcluir que recebe checked
  const handleConcluir = (id, checked) => {
    // Atualiza o estado no componente pai (inverte item.isCompleted)
    concluirItem(id);

    // Só exibe o toast do Swal quando estiver marcando
    if (checked) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toastElem) => {
          toastElem.onmouseenter = Swal.stopTimer;
          toastElem.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Produto "+item.text+ " comprado"
      });
    }
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  const handleRemover = id => {
    swalWithBootstrapButtons.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover!",
      cancelButtonText: "Não, cancelar!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await removeritem(id);
        if (!success) return;
        mostrarToast("Item removido da lista!", "warning");

        swalWithBootstrapButtons.fire({
          title: "Removido!",
          text: "O item "+item.text+ " foi removido com sucesso.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-primary"
          },
          buttonsStyling: false
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          text: "O item permanece na lista :)",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-primary"
          },
          buttonsStyling: false
        });
      }
    });
  };

  return (
    <>
      <div
        className={style.item}
        style={{ textDecoration: item.isCompleted ? "line-through" : "" }}
      >
        <div className={style.content}>
          <input
            type="checkbox"
            checked={item.isCompleted}
            onChange={(e) => handleConcluir(item.id, e.target.checked)}
            className={style.checkbox}
          />
          <div className={style.textBlock}>
            <p className={style.text}>{item.text}</p>
            <p className={style.category}>{item.category}</p>
          </div>
        </div>

        {autenticado && (
          <button
            onClick={() => handleRemover(item.id)}
            className={style.remove}
          >
            X
          </button>
        )}
      </div>

      <Toast visible={toast.visible} message={toast.message} type={toast.type} position />
    </>
  );
};

export default BuyList;
