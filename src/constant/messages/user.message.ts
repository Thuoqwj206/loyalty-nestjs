export const USER_MESSAGES = {
    INVALID_EMAIL: 'Please enter a valid email',
    EMPTY_EMAIL: 'Email is required',
    INVALID_PASSWORD: 'Please enter a valid password',
    EMPTY_PASSWORD: 'Password is required',
    INVALID_OTP: 'Please enter a valid OTP',
    NOT_FOUND: 'User not found',
    EMPTY_OTP: 'OTP is required',
    INVALID_NAME: 'Please enter a valid name',
    EMPTY_NAME: 'Name is required',
    LOGOUT: 'Logout successfully',
    INVALID_PHONE: 'Please enter a valid phone number',
    EMPTY_PHONE: 'Phone number is required',
    EMPTY_POINT: 'Point number is required',
    DELETED: 'Deleted Successfully',
    DEAD_OTP: 'You are not accepted, please login later',
    SENT_OTP: 'The OTP verification code is sent to your phone number. It would expire after 1 minute',
    USER_ALREADY_EXISTS: 'User already exists',
    RECEIVE_OTP: `Your OTP is `,
    ATTEMPT_TIME: (currentTry: number) => {
        return `Wrong OTP, you have ${3 - currentTry} times left`
    }

};