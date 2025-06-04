import { useState } from 'react';
import style from './BuyList.module.css';
import Swal from 'sweetalert2';
import Toast from '../Toast/Toast';

const BuyList = ({ item, removeritem, concluirItem, autenticado }) => {
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });

  const mostrarToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: '' });
    }, 3500);
  };

  const handleConcluir = (id, checked) => {
    concluirItem(id);
    if (checked) {
      const ToastSwal = Swal.mixin({
        toast: true,
        position: 'top-center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toastElem) => {
          toastElem.onmouseenter = Swal.stopTimer;
          toastElem.onmouseleave = Swal.resumeTimer;
        },
      });
      ToastSwal.fire({
        icon: 'success',
        title: `Produto "${item.nome}" comprado`,
      });
    }
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger',
    },
    buttonsStyling: false,
  });

  const handleRemover = (id) => {
    swalWithBootstrapButtons
      .fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter isso!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const success = await removeritem(id);
          if (!success) return;
          mostrarToast('Item removido da lista!', 'warning');

          swalWithBootstrapButtons.fire({
            title: 'Removido!',
            text: `O item "${item.nome}" foi removido com sucesso.`,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelado',
            text: 'O item permanece na lista :)',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
          });
        }
      });
  };

  return (
    <>
      <div
        className={`${style.item} ${
          item.flagComprado ? style.comprado : ''
        }`}
      >
        {/* Checkbox à esquerda */}
        <input
          type="checkbox"
          checked={item.flagComprado}
          onChange={(e) => handleConcluir(item.id, e.target.checked)}
          className={style.checkbox}
        />

        {/* Conteúdo textual */}
        <div className={style.info}>
          {/* Linha 1: Nome + Badge de categoria */}
          <div className={style.row1}>
            <span className={style.nome}>{item.nome}</span>
            <span className={style.badge}>{item.categoria}</span>
          </div>

          {/* Linha 2: Detalhes em formato compacto */}
          <div className={style.row2}>
            <span className={style.detail}>
              <strong>Qtd:</strong> {item.quantidade}
            </span>
            <span className={style.detail}>
              <strong>Valor:</strong> R$ {item.valor.toFixed(2)}
            </span>
            <span className={style.detail}>
              <strong>Medida:</strong> {item.medida || '—'}
            </span>
            <span className={style.detail}>
              <strong>Local:</strong> {item.localSugerido || '—'}
            </span>
          </div>
        </div>

        {/* Botão de remover (se autenticado) */}
        {autenticado && (
          <button
            onClick={() => handleRemover(item.id)}
            className={style.remove}
            title="Remover item"
          >
            &times;
          </button>
        )}
      </div>

      {/* Toast de notificação */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} position />
    </>
  );
};

export default BuyList;
