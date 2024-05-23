<template>
  <div>
    <h1>展示报表数据</h1>
    
    <div style="display: flex;">
      <el-table :data="turnoverData" style="width: 50%" stripe>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="turnover" label="营业额" width="180"></el-table-column>
      </el-table>
      <div ref="turnoverChart" style="width: 50%; height: 400px;"></div>
    </div>

    <div style="display: flex;">
      <el-table :data="orderData" style="width: 50%" stripe>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="orders" label="订单数" width="180"></el-table-column>
      </el-table>
      <div ref="orderChart" style="width: 50%; height: 400px;"></div>
    </div>

    <div style="display: flex;">
      <el-table :data="dishNumData" style="width: 50%" stripe>
        <el-table-column prop="name" label="菜品名称" width="180"></el-table-column>
        <el-table-column prop="sales" label="销售量" width="180"></el-table-column>
      </el-table>
      <div ref="dishNumChart" style="width: 50%; height: 400px;"></div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-ui';
import * as echarts from 'echarts';

export default {
  data() {
    return {
      dateList: [], // 日期列表
      turnoverList: [], // 营业额，与日期列表一一对应
      orderNumList: [], // 每天订单数
      nameList: [], // 所有菜品名称
      numberList: [], // 所有菜的销量

      turnoverData: [],
      orderData: [],
      dishNumData: [],
    };
  },
  methods: {
    initTurnoverChart() {
      const chart = echarts.init(this.$refs.turnoverChart);
      const option = {
        xAxis: { type: 'category', data: this.turnoverData.map(item => item.date) },
        yAxis: { type: 'value' },
        series: [{ data: this.turnoverData.map(item => item.turnover), type: 'bar' }]
      };
      chart.setOption(option);
    },
    initOrderChart() {
      const chart = echarts.init(this.$refs.orderChart);
      const option = {
        xAxis: { type: 'category', data: this.orderData.map(item => item.date) },
        yAxis: { type: 'value' },
        series: [{ data: this.orderData.map(item => item.orders), type: 'bar' }]
      };
      chart.setOption(option);
    },
    initDishNumChart() {
      const chart = echarts.init(this.$refs.dishNumChart);
      const option = {
        xAxis: { type: 'category', data: this.dishNumData.map(item => item.name) },
        yAxis: { type: 'value' },
        series: [{ data: this.dishNumData.map(item => item.sales), type: 'bar' }]
      };
      chart.setOption(option);
    }
  },
  watch: {
    turnoverData() {
      this.initTurnoverChart();
    },
    orderData() {
      this.initOrderChart();
    },
    dishNumData() {
      this.initDishNumChart();
    }
  },
  mounted() {
    axios({ // 分天营业额统计
      url: '/api/business/report/turnover',
      method: 'get',
      headers: {
        "token": localStorage.getItem('token'),
      }
    }).then(res => {
      this.dateList = res.data.data.dateList;
      this.turnoverList = res.data.data.turnoverList;
      this.turnoverData = this.dateList.map((date, index) => ({
        date: date,
        turnover: this.turnoverList[index]
      }));
    }).catch(err => {
      console.log(err.data.msg);
      ElMessage.error('数据加载失败');
    });

    axios({ // 每天订单数
      url: '/api/business/report/user',
      method: 'get',
      headers: {
        "token": localStorage.getItem('token')
      }
    }).then(res => {
      console.log("Received data:", res.data.data); // 打印整个数据对象以查看结构
      this.orderNumList = res.data.data.orderNumList;
      this.dateList = res.data.data.dateList;
      this.orderData = res.data.data.dateList.map((date, index) => ({
        date: date,
        orders: res.data.data.orderNumList[index]
      }));
      console.log("Processed order data:", this.orderData); // 打印处理后的数据，查看是否正确组装
    }).catch(err => {
      console.log(err.data.msg);
      ElMessage.error('数据加载失败');
    });

    axios({ // 所有菜的销量
      url: '/api/business/report/top',
      method: 'get',
      headers: {
        "token": localStorage.getItem('token')
      }
    }).then(res => {
      this.nameList = res.data.data.nameList;
      this.numberList = res.data.data.numberList;
      this.dishNumData = res.data.data.nameList.map((name, index) => ({
        name: name,
        sales: res.data.data.numberList[index]
      }));
    }).catch(err => {
      console.log(err.data.msg);
      ElMessage.error('数据加载失败');
    });

    this.$nextTick(() => {
      this.initTurnoverChart();
      this.initOrderChart();
      this.initDishNumChart();
    });
  }
};
</script>

<style>

</style>
