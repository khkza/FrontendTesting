import { createRouter, createWebHistory } from "vue-router";
// import Dashboard from '../pages/master/Dashboard.vue';
 import List from '../pages/master/ResultList.vue';
 import Contact from '../pages/master/ContactUs.vue';
 import Region from '../pages/master/RegionList.vue';
 import HomePage from "../pages/master/HomePage.vue";
 import Township from "../pages/master/TownshipList.vue";
import StartPage from "../pages/master/StartPage.vue";

const router = createRouter({
    history: createWebHistory(),
    routes :[
        {
            path:'/',
            name:'home',
            component:HomePage
        },
        // {
        //     path:'/dashboard',
        //     name:'dashboard',
        //     component: Dashboard
        // },
         {
             path:'/resultlist',
             name:'resultlist',
             component: List
        },
        {
            path:'/contact',
            name:'contactus',
            component: Contact
       },
       {
        path: '/region',
        name:'regionlist',
        component: Region
       },
    
       {
        path: '/township',
        name:'townshiplist',
        component: Township
       },
       {
        path: '/start',
        name:'start',
        component: StartPage
       },
    ],
});
export default router;