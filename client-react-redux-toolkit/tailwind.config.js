module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        fontSize: {
            sm: '0.8rem',
            base: '1rem',
            xl: '1.25rem',
            '2xl': '1.563rem',
            '3xl': '1.953rem',
            '4xl': '2.441rem',
            '5xl': '3.052rem',
            '6xl': '3.8rem'
        },
        extend: {
            backgroundImage: theme => ({
                'gradient-ellipse-header': `radial-gradient(ellipse at top left, ${theme.colors.gray['400']}, ${theme.colors.gray['800']})`
            })
        }
    },
    plugins: []
};
