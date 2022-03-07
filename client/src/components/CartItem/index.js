import React from 'react';
import { connect } from 'react-redux';
import { idbPromise } from '../../utils/helpers';
import { removeFromCart, updateCartQuantity } from '../../store/actions';
const CartItem = (props) => {
    const { item, removeFromCart, onChange } = props;
    const handleRemoveFromCart = (item) => {
        removeFromCart(item._id);
        idbPromise('cart', 'delete', { ...item });
    };
    const handleChange = (e) => {
        onChange(e, item);
    };

    return (
        <div className="flex-row">
            <div>
                <img src={`/images/${item.image}`} alt="" />
            </div>
            <div>
                <div>
                    {item.name}, ${item.price}
                </div>
                <div>
                    <span>Qty:</span>
                    <input type="number" value={item.purchaseQuantity} onChange={handleChange} />
                    <span role="img" aria-label="trash" onClick={() => handleRemoveFromCart(item)}>
                        🗑️
                    </span>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = { removeFromCart, updateCartQuantity };
export default connect(null, mapDispatchToProps)(CartItem);
