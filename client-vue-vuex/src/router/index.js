import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home'),
        meta: {
            user: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login'),
        meta: {
            guest: true
        }
    },
    {
        path: '/employees',
        name: 'employees',
        component: () => import('@/views/Employees'),
        meta: {
            admin: true
        }
    },
    {
        path: '/employees/:id',
        name: 'employeeDetails',
        component: () => import('@/views/EmployeeDetails'),
        meta: {
            admin: true
        }
    },
    {
        path: '/profile',
        name: 'profileDetails',
        component: () => import('@/views/ProfileDetails'),
        meta: {
            user: true
        }
    },
    { path: '*', redirect: '/' }
];

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes
});

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('loggedUser'));

    if (to.matched.some(records => records.meta.guest)) {
        if (user) {
            return next({ name: 'home' });
        }

        return next();
    }

    if (!user) {
        return next({ name: 'login' });
    }

    const isAdmin = user.roles && user.roles.includes('admin');
    const isUser = user.roles && user.roles.includes('user');

    if (to.matched.some(records => records.meta.admin)) {
        if (!isAdmin) {
            return next({ name: 'login' });
        }
    } else if (to.matched.some(records => records.meta.user)) {
        if (!(isAdmin || isUser)) {
            return next({ name: 'login' });
        }
    }

    return next();
});

export default router;
