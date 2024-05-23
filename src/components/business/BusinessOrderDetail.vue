<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px" style="background-color: #f5f5f5; padding: 20px">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>订单详情</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button> -->
            </div>
          </template>
          <div v-if="order">
            <el-descriptions border :column="1">
              <el-descriptions-item label="总价格">{{
                order.totalPrice
              }}</el-descriptions-item>
              <el-descriptions-item label="订单状态">{{
                getStatusLabel(order.status)
              }}</el-descriptions-item>
              <el-descriptions-item label="订单地址">{{
                order.address
              }}</el-descriptions-item>
              <!-- <el-descriptions-item label="订单创建时间">{{
                order.orderDate
              }}</el-descriptions-item> -->
            </el-descriptions>
          </div>
          <div v-else>
            <el-skeleton :loading="true" rows="4"></el-skeleton>
          </div>
        </el-card>
      </el-aside>
      <el-main style="padding: 20px">
        <el-card shadow="hover">
          <template #header>菜单详情</template>
          <div class="block text-center">
            <el-carousel motion-blur>
              <el-carousel-item v-for="dish in dishes" :key="dish.id">
                <img :src="dish.image" alt="菜品图片" style="height: 100%;width:100%"/>
              </el-carousel-item>
            </el-carousel>
          </div>

          <el-divider>菜品详细</el-divider>
          <div v-if="dishes.length > 0">
            <p v-for="dish in dishes" :key="dish.id">
              {{ dish.id }} . {{ dish.name }}:{{ dish.description }}
            </p>
          </div>
          <div v-else>
            <el-skeleton :loading="true" rows="4"></el-skeleton>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BusinessOrderDetail",
  data() {
    return {
      order: null,
      dishes: [],
      orderId: null, // Initialize as null
      statusList: [
        { value: "0", label: "未接单" },
        { value: "1", label: "已结单" },
        { value: "2", label: "派送中" },
        { value: "3", label: "已完成" },
      ],
    };
  },
  mounted() {
    this.orderId = this.$route.query.id; // Get the ID from the URL
    this.fetchOrderDetails();
  },
  watch: {
    "$route.query.id": function (newId) {
      this.orderId = newId;
      this.fetchOrderDetails(); // Fetch new order details when ID changes
    },
  },
  methods: {
    fetchOrderDetails() {
      if (this.orderId) {
        axios
          .get("/api/business/order/page/detail", {
            headers: {
              token: localStorage.getItem("token"),
            },
            params: {
              orderId: this.orderId,
            },
          })
          .then((response) => {
            this.order = response.data.data;
            console.log("Order details:", this.order);
            if (this.order && this.order.orderedDishes) {
              this.fetchDishes(this.order.orderedDishes);
            }
          })
          .catch((error) => {
            console.error("Error fetching order details:", error);
          });
      }
    },
    fetchDishes(orderedDishes) {
      const dishIds = JSON.parse(orderedDishes);
      const token = localStorage.getItem("token");
      const dishRequests = dishIds.map((id) =>
        axios.get(`/api/business/dish/order/dish`, {
          headers: {
            token: token,
          },
          params: {
            id: id,
          },
        })
      );
      Promise.all(dishRequests)
        .then((responses) => {
          this.dishes = responses.map((response) => response.data.data);
          console.log("Dishes:", this.dishes);
        })
        .catch((error) => {
          console.error("Error fetching dishes:", error);
        });
    },
    getStatusLabel(status) {
      const statusObj = this.statusList.find((item) => item.value === status.toString());
      return statusObj ? statusObj.label : "未知状态";
    },
  },
};
</script>

<style scoped>
.common-layout {
  font-family: "Arial", sans-serif;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  height: auto;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
  height: auto;
}
</style>
