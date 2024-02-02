export const ORDER_MESSAGES = {
    NOT_FOUND: 'Order not found',
    EXISTED_ORDER_NUMBER: 'Order number already exists',
    INVALID_USER_ID: 'Please enter a valid user ID',
    EMPTY_USER_ID: 'User ID is required',
    INVALID_STORE_ID: 'Please enter a valid store ID',
    EMPTY_STORE_ID: 'Store ID is required',
    NOT_FOUND_USER: 'User not found',
    ORDER_CANNOT_OVERRIDE: 'Order cannot be overridden',
    NOT_FOUND_ITEM: 'Item not found',
    ITEM_QUANTITY_INSUFFICIENT: 'Item does not have enough quantity',
    ORDER_FAILED: (error: string) => `Order Failed: ${error}`,
    ITEM_IN_CART: 'This item is already in cart'
};