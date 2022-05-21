import React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import qs from 'qs';

import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../Redux/slices/filterSlice';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaSkeleton from '../components/PizzaBlock/Skeleton';
import PizzaBlock from '../components/PizzaBlock';
import Pagination from '../components/Pagination';

import { SearchContext } from '../App.js';
import { sortList } from '../components/Sort';

export const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = React.useRef(false);
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const sortType = sort.sortProperty;
  const { searchValue } = React.useContext(SearchContext);
  const [pizzas, setPizzas] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const fetchPizzas = async () => {
    setIsLoading(true);

    const sortBy = sortType.replace('-', '');
    const order = sortType.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&serch=${searchValue}` : '';

    // await axios
    //   .get(
    //     `https://6281385c7532b4920f78dc3e.mockapi.io/pizzas?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    //   )
    //   .then((res) => {
    //     setPizzas(res.data);
    //     setIsLoading(false);
    //   });
    try {
      const res = await axios.get(
        `https://6281385c7532b4920f78dc3e.mockapi.io/pizzas?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
      );
      setPizzas(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
      alert('Ошибка при получения пицц');
    } finally {
      setIsLoading(false);
    }

    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    if (isMounted.current) {
      fetchPizzas();
    }
  }, [categoryId, sortType, searchValue, currentPage]);

  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: categoryId > 0 ? categoryId : null,
        sortProperty: sort.sortProperty,
        currentPage,
      };
      const queryString = qs.stringify(params, { skipNulss: true });
      navigate(`/?${queryString}`);
    }
  }, [categoryId, sortType, searchValue, currentPage]);

  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);
      if (sort) {
        params.sort = sort;
      }

      dispatch(setFilters(params));
    }
    isMounted.current = true;
  }, [location.search]);

  React.useEffect(() => {
    if (!window.location.search) {
      fetchPizzas();
    }
  }, []);

  const items = pizzas
    .filter((obj) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      return false;
    })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <PizzaSkeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onClickCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : items}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
