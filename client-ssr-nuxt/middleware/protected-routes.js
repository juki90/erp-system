export default function ({ store, redirect, route }) {
    const routes = {
        guest: ['login', 'forgot-password', 'forgot-password-token'],
        user: ['index', 'profile'],
        admin: ['index', 'profile', 'employees', 'employees-id']
    };

    if (!routes.guest.includes(route.name) && !store.getters.getLoggedUser) {
        return redirect('/login');
    }

    if (
        routes.guest.includes(route.name) &&
        (store.getters.isAdmin || store.getters.isUser)
    ) {
        return redirect('/');
    }

    if (
        !routes.user.includes(route.name) &&
        store.getters.isUser &&
        !store.getters.isAdmin
    ) {
        return redirect('/');
    }

    if (
        !routes.admin.includes(route.name) &&
        !store.getters.isAdmin &&
        store.getters.isUser
    ) {
        return redirect('/');
    }
}
