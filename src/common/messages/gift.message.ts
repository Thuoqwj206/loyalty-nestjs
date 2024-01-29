export const GIFT_MESSAGES = {
  NOT_FOUND: 'Not found any gift',
  EXISTED_GIFT_NAME: 'Existed Gift Name',
  REDUCTION_QUANTITY_GREATER_THAN_AVAILABLE: (quantity: number, availableQuantity: number) =>
    `Reduction quantity (${quantity}) is greater than the number of gift available (${availableQuantity})`,
  INVALID_NAME: 'Please enter a valid name',
  EMPTY_NAME: 'Please enter a name',
  INVALID_IMAGE: 'Please enter a valid input',
  INVALID_POINT_REQUIRED: 'Please enter a number',
  EMPTY_POINT_REQUIRED: 'Please enter a number',
  INVALID_EXPIRATION_DATE: 'Please enter a valid expiration date',
  INVALID_QUANTITY_AVAILABLE: 'Please enter a number',
  EMPTY_QUANTITY_AVAILABLE: 'Please enter a number',
  NOT_ACCEPTED: 'GiftOrder can not be override',
  DEAD_OTP: 'You are not accepted, please login later'
};