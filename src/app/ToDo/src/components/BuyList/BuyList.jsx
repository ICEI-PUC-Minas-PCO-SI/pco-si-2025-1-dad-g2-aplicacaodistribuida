import React from 'react';
import style from './BuyList.module.css'
const BuyList = ({ item,removeritem,concluirItem }) => {
  return (
    <div className={style.item} style={{textDecoration:item.isCompleted?"line-through":""}}>
      <div className={style.content}>
        <p className={style.text}>{item.text}</p>
        <p className={style.category}>{item.category}</p>
      </div>
      <div>
        <button onClick={()=>{concluirItem(item.id)}} className={style.complete}>Completar</button>
        <button onClick={()=>{removeritem(item.id)}} className={style.remove}>X</button>
      </div>
    </div>
  );
};

export default BuyList;
