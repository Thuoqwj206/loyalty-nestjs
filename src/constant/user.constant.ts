export const USER_CONSTANTS = {
    MIN_OTP: 100000,
    MAX_OTP: 900000,
    OTP_EXPIRE_TIME: 60000,
    CURRENT_TRY_TIME: 30000,
    FIXED_POINT_ADDED: (price: number): number => (price - (price % 100000)) / 1000,
    PRICE_BONUS_LEVEL: 100000,
    FIRST_BONUS_RATE: 0.1,
    FIRST_BONUS_LIMIT: 5000,
    SECOND_BONUS_RATE: 0.2,
    SECOND_BONUS_LIMIT: 10000,
    RANK_DIFF: {
        'BRONZE': 5,
        'SILVER': 10,
        'GOLD': 15
    },
    GOLD_POINT: 5000,
    SILVER_POINT: {
        MIN: 2000,
        MAX: 5000
    },
    TOKEN_EXPIRE_TIME: 43200000
};