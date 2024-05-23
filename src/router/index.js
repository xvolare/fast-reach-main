import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/business/login',
    name:'商家登录',
    component:()=>import('../views/business/BusinessLoginView.vue')
  },
  {
    path:'/business/manage',
    name:'商家主控制台',
    redirect:'/business/manage/datastatistics',//重定向
    component:()=>import('../views/business/BusinessMainManageView.vue'),
     children:[
       {
        path:'/business/manage/datastatistics',
        name:'数据统计组件',
        component:()=>import('../components/business/BusinessDataStatistics.vue')
      },
      {
        path:'/business/manage/userrecharge',
        name:'数据统计组件',
        component:()=>import('../components/business/BusinessUserRecharge.vue')
      },
      {
        path:'/business/manage/dishmanage',
        name:'菜品管理组件',
        component:()=>import('../components/business/BusinessDishManage.vue')
      },
      {
        path:'/business/manage/ordermanage',
        name:'订单管理组件',
        component:()=>import('../components/business/BusinessOrderManage.vue')
      },
      {
        path:'/business/manage/orderdetail',
        name:'订单详情组件',
        component:()=>import('../components/business/BusinessOrderDetail.vue')
      },
      {
        path:'/business/manage/employeemanage',
        name:'员工管理组件',
        component:()=>import('../components/business/BusinessEmployeeManage.vue')
      }
     ]
    },
    {
      path:'/customer/login',
      name:'顾客登录',
      component:()=>import('../views/customer/CustomerLoginView.vue')
    },
    {
      path:'/customer/register',
      name:'顾客注册账号',
      component:()=>import('../views/customer/registerfunction/RegisterAccountView.vue')
    },
    {
      path:'/customer/manage',
      name:'顾客主控制台',
      redirect:'../customer/manage/order',//重定向
      component:()=>import('../views/customer/CustomerMainManageView.vue'),
       children:[
         {
          path:'/customer/manage/order',
          name:'顾客点餐界面',
          component:()=>import('../components/customer/CustomerOrder.vue')
        },
        {
          path:'/customer/manage/history',
          name:'顾客历史订单查询',
          component:()=>import('../components/customer/CustomerHistory.vue')
        },
       {
          path: '/customer/manage/editinfo',
          name: '顾客修改个人信息界面',
          component: () => import('../views/customer/editinfofunction/EditAccountView.vue')
        } 
       ]
      }
]

const router = new VueRouter({
  routes
})

export default router
