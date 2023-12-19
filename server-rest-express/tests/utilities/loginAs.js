module.exports = async (request, role = 'user') => {
    const credentials = {
        admin: {
            email: 'admin@erpemployee.test',
            password: 'password'
        },
        user: {
            email: 'user@erpemployee.test',
            password: 'password'
        }
    };

    return request.post('/login').send(credentials[role]);
};
