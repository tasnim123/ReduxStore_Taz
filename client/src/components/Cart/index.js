import React, { useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import { addMultipleItemsToCart, toggleCart, removeFromCart, updateCartQuantity } from '../../store/actions';
import './style.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = (props) => {
    const { addMultipleItemsToCart, toggleCart, updateCartQuantity } = props;
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
    const cart = useSelector((state) => state.cart);
    const cartOpen = useSelector((state) => state.cartOpen);
    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session });
            });
        }
    }, [data]);
    const getCart = useCallback(async () => {
        const cart = await idbPromise('cart', 'get');
        addMultipleItemsToCart(cart);
    }, [addMultipleItemsToCart]);

    useEffect(() => {
        if (!cart) {
            getCart();
        }
    }, [cart, addMultipleItemsToCart, getCart]);

    function handleToggleCart() {
        toggleCart();
    }

    function calculateTotal() {
        let sum = 0;
        cart.forEach((item) => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    function submitCheckout() {
        const productIds = [];

        cart.forEach((item) => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id);
            }
        });

        getCheckout({
            variables: { products: productIds },
        });
    }

    const onChange = (e, item) => {
        const value = e.target.value;
        if (value === '0') {
            removeFromCart(item._id);
            idbPromise('cart', 'delete', { ...item });
        } else {
            updateCartQuantity(item._id, parseInt(value));
            idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
        }
    };

    if (!cartOpen) {
        return (
            <div className="cart-closed" onClick={handleToggleCart}>
                <span role="img" aria-label="trash">
                    🛒
                </span>
            </div>
        );
    }

    return (
        <div className="cart">
            <div className="close" onClick={handleToggleCart}>
                [close]
            </div>
            <h2>Shopping Cart</h2>
            {cart && cart.length ? (
                <div>
                    {cart.map((item) => (
                        <CartItem key={item._id} item={item} onChange={onChange} />
                    ))}

                    <div className="flex-row space-between">
                        <strong>Total: ${calculateTotal()}</strong>

                        {Auth.loggedIn() ? (
                            <button onClick={submitCheckout}>Checkout</button>
                        ) : (
                            <span>(log in to check out)</span>
                        )}
                    </div>
                </div>
            ) : (
                <h3>
                    <span role="img" aria-label="shocked">
                        😱
                    </span>
                    You have not added anything to your cart yet!
                </h3>
            )}
        </div>
    );
};

const mapDispatchToProps = { addMultipleItemsToCart, toggleCart, updateCartQuantity, removeFromCart };
export default connect(null, mapDispatchToProps)(Cart);
