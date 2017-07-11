import Vue from 'vue';
import Router from 'vue-router';
import loginApp from '../views/admin/login/loginApp';
import adminHome from '../views/admin/home/homeApp';
import userDiv from '../views/user/div/divApp';
Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        name: 'loginApp',
        component: loginApp
    }, {
        path: '/admin/login',
        name: 'index',
        component: loginApp
    }, {
        path: '/admin/home',
        name: 'adminHome',
        component: adminHome
    }, {
        path: '/user/div',
        name: 'userDiv',
        component: userDiv
    }
   ]
})
