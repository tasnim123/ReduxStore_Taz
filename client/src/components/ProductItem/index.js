import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { pluralize } from '../../utils/helpers';
import { idbPromise } from '../../utils/helpers';
import { updateCartQuantity, addToCart } from '../../store/actions';

function ProductItem(props) {
    const { image, name, _id, price, quantity, updateCartQuantity, addToCart } = props;
    const cart = useSelector((state) => state.cart);

    const handleAddToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === _id);
        if (itemInCart) {
            updateCartQuantity(_id, parseInt(itemInCart.purchaseQuantity) + 1);
            idbPromise('cart', 'put', {
                ...itemInCart,
                purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
            });
        } else {
            addToCart({ image, name, _id, price, quantity, purchaseQuantity: 1 });
            idbPromise('cart', 'put', { image, name, _id, price, quantity, purchaseQuantity: 1 });
        }
    };

    return (
        <div className="card px-1 py-1">
            <Link to={`/products/${_id}`}>
                <img alt={name} src={`/images/${image}`} />
                <p>{name}</p>
            </Link>
            <div>
                <div>
                    {quantity} {pluralize('item', quantity)} in stock
                </div>
                <span>${price}</span>
            </div>
            <button onClick={handleAddToCart}>Add to cart</button>
        </div>
    );
}

const mapDispatchToProps = { updateCartQuantity, addToCart };
export default connect(null, mapDispatchToProps)(ProductItem);
