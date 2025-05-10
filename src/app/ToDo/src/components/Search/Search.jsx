import React from 'react';
import style from './Search.module.css';

const Search = ({ search, setSearch }) => {
  return (
    <div className={style.search}>
      <h2>Pesquisar:</h2>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Digite para pesquisar"
      />
    </div>
  );
};

export default Search;