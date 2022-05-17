import React from 'react';
import styles from './NotFound.module.scss';

const NotFounBlock = () => {
  return (
    <div className={styles.root}>
      <h1>
        <span>:-( </span>
        <br />
        Ничего не найдено
      </h1>
      <p className={styles.description}>К сожалению данная страницы отсутствует в магазине</p>
    </div>
  );
};

export default NotFounBlock;
