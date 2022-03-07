import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { connect, useSelector } from 'react-redux';
import Cart from '../components/Cart';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART, UPDATE_PRODUCTS } from '../utils/actions';
import { QUERY_PRODUCTS } from '../utils/queries';
import { idbPromise } from '../utils/helpers';
import spinner from '../assets/spinner.gif';
import { updateProducts, updateCartQuantity, addToCart, removeFromCart } from '../store/actions';

function Detail(props) {
    const { updateProducts, updateCartQuantity, addToCart, removeFromCart } = props;
    const { id } = useParams();

    const [currentProduct, setCurrentProduct] = useState({});

    const { loading, data } = useQuery(QUERY_PRODUCTS);

    const products = useSelector((state) => state.products);
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        // already in global store
        if (products) {
            setCurrentProduct(products.find((product) => product._id === id));
        }
        // retrieved from server
        else if (data) {
            updateProducts(data.products);
            data.products.forEach((product) => {
                idbPromise('products', 'put', product);
            });
        }
        // get cache from idb
        else if (!loading) {
            idbPromise('products', 'get').then((indexedProducts) => {
                updateProducts(indexedProducts);
            });
        }
    }, [products, data, loading, updateProducts, id]);

    const handleAddToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === id);
        if (itemInCart) {
            updateCartQuantity(id, parseInt(itemInCart.purchaseQuantity) + 1);
            idbPromise('cart', 'put', {
                ...itemInCart,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
            });
        } else {
            addToCart({ ...currentProduct, purchaseQuantity: 1 });
            idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
        }
    };

    const handleRemoveFromCart = () => {
        removeFromCart(currentProduct._id);
        idbPromise('cart', 'delete', { ...currentProduct });
    };

    return (
        <>
            {currentProduct && cart ? (
                <div className="container my-1">
                    <Link to="/">← Back to Products</Link>

                    <h2>{currentProduct.name}</h2>

                    <p>{currentProduct.description}</p>

                    <p>
                        <strong>Price:</strong>${currentProduct.price}{' '}
                        <button onClick={handleAddToCart}>Add to Cart</button>
                        <button
                            disabled={!cart.find((p) => p._id === currentProduct._id)}
                            onClick={handleRemoveFromCart}
                        >
                            Remove from Cart
                        </button>
                    </p>

                    <img src={`/images/${currentProduct.image}`} alt={currentProduct.name} />
                </div>
            ) : null}
            {loading ? <img src={spinner} alt="loading" /> : null}
            <Cart />
        </>
    );
}

const mapDispatchToProps = { updateCartQuantity, updateProducts, addToCart, removeFromCart };
export default connect(null, mapDispatchToProps)(Detail);
