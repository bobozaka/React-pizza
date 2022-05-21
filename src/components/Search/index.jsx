import React from 'react';
import debounce from 'lodash.debounce';
import { SearchContext } from '../../App';

import styles from './Search.module.scss';

function Search() {
  const [value, setValue] = React.useState('');
  const { setSearchValue } = React.useContext(SearchContext);
  const inputRef = React.useRef();

  const onClickClear = () => {
    setSearchValue('');
    setValue('');
    inputRef.current.focus();
  };

  const updateSearchValue = React.useCallback(
    debounce((str) => {
      setSearchValue(str);
    }, 250),
    [],
  );

  const onChangeInput = (event) => {
    setValue(event.target.value);
    updateSearchValue(event.target.value);
  };

  return (
    <div className={styles.root}>
      <img className={styles.icon} src="../img/search.svg" alt="Поиск" />
      <input
        ref={inputRef}
        value={value}
        onChange={onChangeInput}
        className={styles.input}
        placeholder="Поиск пиццы ..."
      />
      {value && (
        <img
          onClick={onClickClear}
          className={styles.clearIcon}
          src="../img/clouse-search.svg"
          alt="Закрыть поиск"
        />
      )}
    </div>
  );
}

export default Search;
