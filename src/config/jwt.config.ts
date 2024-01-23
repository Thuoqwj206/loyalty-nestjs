export const jwtConfig = {
    global: true,
    secret: 'key',
    signOptions: { expiresIn: '1d' },
}