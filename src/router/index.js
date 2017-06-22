import Vue from 'vue';
import Router from 'vue-router';
import adminWelcome from '../views/admin/welcome/welcomeApp';

Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [ {
        path: '/admin/welcome',
        name: 'adminWelcome',
        component: adminWelcome
    }
    ]
})
