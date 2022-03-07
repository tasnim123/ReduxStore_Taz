export const UPDATE_PRODUCTS = 'UPDATE_PRODUCTS';

export const ADD_TO_CART = 'ADD_TO_CART';
export const ADD_MULTIPLE_TO_CART = 'ADD_MULTIPLE_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const TOGGLE_CART = 'TOGGLE_CART';

export const UPDATE_CATEGORIES = 'UPDATE_CATEGORIES';
export const UPDATE_CURRENT_CATEGORY = 'UPDATE_CURRENT_CATEGORY';

export const updateCurrentCategory = (id) => {
    return {
        type: UPDATE_CURRENT_CATEGORY,
        currentCategory: id,
    };
};

export const updateCurrentCategories = (categoryData) => {
    return {
        type: UPDATE_CATEGORIES,
        categories: categoryData,
    };
};

export const updateCategories = (categories) => {
    return {
        type: UPDATE_CATEGORIES,
        categories: categories,
    };
};

////////////////// Products Action Creators  //////////////////////////////////
export const updateProducts = (products) => {
    return {
        type: UPDATE_PRODUCTS,
        products: products,
    };
};

/////////////////// Cart Action Creators /////////////////////////////////////
export const addMultipleItemsToCart = (cart) => {
    return { type: ADD_MULTIPLE_TO_CART, products: [...cart] };
};

export const toggleCart = () => {
    return { type: TOGGLE_CART };
};

export const updateCartQuantity = (_id, quantity) => {
    return {
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: quantity,
    };
};

export const addToCart = (product) => {
    return {
        type: ADD_TO_CART,
        product: product,
    };
};

export const removeFromCart = (id) => {
    return {
        type: REMOVE_FROM_CART,
        _id: id,
    };
};
