import React from 'react';
import { getCategories, getProductsFromCategoryAndQuery } from '../services/api';
import ProductCard from './ProductCard';
import CartButton from './CartButton';

class MainPage extends React.Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      inputValue: '',
      products: [],
      category: '',
      cart: [],
    };
  }

  componentDidMount() {
    this.callApiCategories();
  }

  callApiCategories = async () => {
    const result = await getCategories();
    this.setState({
      categories: result,
    });
  }

  handleInput = ({ target }) => {
    const { value } = target;
    this.setState({
      inputValue: value,
    });
  }

  searchApi = async () => {
    const { inputValue, category } = this.state;
    const result = await getProductsFromCategoryAndQuery(category, inputValue);
    this.setState({
      products: result.results,
    });
  }

  searchCategory = ({ target }) => {
    const { id } = target;
    this.setState(({
      category: id,
    }), () => this.searchApi());
  }

  addToCart = (title, price, thumbnail) => {
    this.setState((prevState) => ({
      cart: [...prevState.cart, { title, price, thumbnail }],
    }));
  }

  render() {
    const { categories, products, cart } = this.state;
    return (
      <div>
        <input
          data-testid="query-input"
          type="text"
          name="inputValue"
          id=""
          onChange={ this.handleInput }
        />
        <button
          data-testid="query-button"
          type="button"
          onClick={ this.searchApi }
        >
          Pesquisar
        </button>
        <CartButton cart={ cart } />
        <p
          data-testid="home-initial-message"
        >
          Digite algum termo de pesquisa ou escolha uma categoria.
        </p>
        {categories.map((element) => {
          const { name, id } = element;
          return (
            <button
              data-testid="category"
              type="button"
              key={ name }
              id={ id }
              onClick={ this.searchCategory }
            >
              { name }
            </button>
          );
        })}
        {products.length > 0 && (
          products.map((element) => {
            const { title, price, thumbnail } = element;
            return (
              <ProductCard
                key={ title }
                title={ title }
                price={ price }
                thumbnail={ thumbnail }
                addToCart={ this.addToCart }
              />
            );
          }))}
      </div>
    );
  }
}

export default MainPage;
