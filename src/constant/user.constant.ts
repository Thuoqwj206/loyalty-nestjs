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
    LIMITATION_FORMULA: (price: number, rankPoint: number) => ((price - (price % USER_CONSTANTS.PRICE_BONUS_LEVEL)) / USER_CONSTANTS.PRICE_BONUS_LEVEL) * rankPoint,
    PERCENTAGE_FORMULA: (price: number, percentRate: number, limit: number) => {
        const fixedBonus = (price - (price % USER_CONSTANTS.PRICE_BONUS_LEVEL)) * limit
        const surplus = (price % USER_CONSTANTS.PRICE_BONUS_LEVEL) * percentRate
        const lastBonus = surplus > limit ? limit : surplus
        return Math.floor(fixedBonus + lastBonus)
    },
    RANK_DIFF: {
        'BRONZE': 5,
        'SILVER': 10,
        'GOLD': 15
    },
    PERCENT_DIFF: {
        'BRONZE': 0.01,
        'SILVER': 0.015,
        'GOLD': 0.02
    },
    LIMIT_DIFF: {
        'BRONZE': 5,
        'SILVER': 10,
        'GOLD': 20
    },
    GOLD_POINT: 5000,
    SILVER_POINT: {
        MIN: 2000,
        MAX: 5000
    },
    TOKEN_EXPIRE_TIME: 43200000
};