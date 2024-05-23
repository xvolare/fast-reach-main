<template>
  <div id="manage">
    <el-container>
      <el-header class="custom-header">速味达外卖系统欢迎您</el-header>
      <el-container>
        <el-aside width="200px" class="">
          <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff"
            active-text-color="#ffd04b" :router=flag>
            <el-menu-item index="/customer/manage/order">
              <i class="el-icon-menu"></i>
              <span slot="title">点餐</span>
            </el-menu-item>
            <el-menu-item index="/customer/manage/history">
              <i class="el-icon-menu"></i>
              <span slot="title">历史订单查询</span>
            </el-menu-item>
            <el-menu-item index="/customer/manage/editinfo">
              <i class="el-icon-menu"></i>
              <span slot="title">修改资料</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex2: '',
      flag: true, // router配置，默认不要动
    };
  },
  methods: {
    created () {
      this.activeIndex2 = this.$route.path
    }
  },
  mounted () {

  }
}
</script>

<style>
#manage {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 100%;
}

.el-container {
  height: 100%;
}

.el-menu {
  height: 100%;
}

.custom-header {
  padding: 40px 0;
  background: linear-gradient(to right, #ff9966, #ff5e62);
  color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
}

.custom-header {
  font-size: 30px;
  font-weight: bold;
  color: #530e0e;
  line-height: 0.2;
}

.custom-side {
  padding: 40px 0;
  background: linear-gradient(to right, #ff9966, #ff5e62);
  color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
