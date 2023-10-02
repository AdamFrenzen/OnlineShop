const Product = require('../models/product.model');

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
    let product
    try {
        product = await Product.findById(req.body.productId);
    } catch (error) {
        next(error);
        return;
    }
    res.locals.cart.addItem(product);
    req.session.cart = res.locals.cart;

    res.status(201).json({
        message: 'cart updated',
        newTotalItems: res.locals.cart.totalQuantity
    });
}

function updateCartItem(req, res) {
    const cart = res.locals.cart;

    const updateItemData = cart.updateCartItem(req.body.productId, req.body.quantity);

    req.session.cart = cart;

    res.json({
        message: 'Item updated',
        updateCartData: {
            newTotalQuantity: cart.totalQuantity,
            newTotalPrice: cart.totalPrice,
            updatedItemPrice: updateCartItem.updatedItemPrice
        }
    })
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCartItem: updateCartItem
}