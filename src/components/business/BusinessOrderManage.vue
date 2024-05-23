TODO
点击订单管理，自动跳转到分页查询，这个界面要借鉴黑马苍穹外卖的UI设计，有分页查询（包括根据关键字号查询），修改订单状态，删除订单，订单分页查询详情
TODO
查看订单详情跳转到src\views\business\orderfunction\DetailOrderView.vue，这个你们自己添加响应按钮和配置路由，注意是一个订单一个“查看详情”按钮
TODO 请求的时候data里面的数据得根据前端设计填充
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content ep-bg-purple">
              <el-input
                v-model="searchMap.id"
                style="width: 240px"
                placeholder="输入订单ID"
              />
            </div>
          </el-col>
          <el-col :span="6">
            <!-- <div class="grid-content ep-bg-purple">
              <el-date-picker
                v-model="searchMap.date"
                type="date"
                placeholder="选择订单日期"
                :size="size"
              />
            </div> -->
          </el-col>
          <el-col :span="6">
            <div class="grid-content ep-bg-purple">
              <!-- <el-select
                v-model="searchMap.status"
                placeholder="订单状态"
                size="large"
                style="width: 240px"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content ep-bg-purple">
              <el-button type="primary" @click="searchID(searchMap.id)">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div>
          <el-table :data="records" style="width: 100%">
            <el-table-column label="订单ID" prop="id" width="120" />
            <el-table-column label="顾客ID" prop="userId" width="120" />
            <el-table-column label="价格" prop="totalPrice" width="120" />
            <el-table-column label="状态" prop="status" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">未接单</span>
                <span v-else-if="scope.row.status === 1">已结单</span>
                <span v-else-if="scope.row.status === 2">派送中</span>
                <span v-else-if="scope.row.status === 3">已完成</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" prop="address" />
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" @click="editOrder(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteOrder(scope.row.id)">删除</el-button>
                <el-button type="text" @click="viewOrder(scope.row.id)"
                  >查看详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="changePage"
              layout="total"
              :total="total"
            />
          </div>
        </div>
        <el-dialog title="修改订单" :visible.sync="editflag">
          <el-form :model="form">
            <el-form-item label="订单ID" :label-width="formLabelWidth">
              <el-input v-model="form.id" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="顾客ID" :label-width="formLabelWidth">
              <el-input v-model="form.userId" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option
                  v-for="status in statusList"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
              <el-input v-model="form.address" autocomplete="off" disabled />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editflag = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </div>
        </el-dialog>
        <div class="example-pagination-block">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="changePage"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      records: [], // 订单数据列表
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的记录数
      editflag: false,
      form: {
        id: "",
        userId: "",
        totalPrice: "",
        status: "",
        address: "",
      },
      // 搜索条件
      searchMap: {
        id: "",
        date: "",
        status: "",
      },
      // 订单状态
      statusList: [
        { value: "0", label: "未接单" },
        { value: "1", label: "已结单" },
        { value: "2", label: "派送中" },
        { value: "3", label: "已完成" },
      ],
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  methods: {
    // 编辑订单
    editOrder(row) {
      this.editflag = true;
      console.log(this.editflag);
      this.form = {
        id: row.id,
        userId: row.userId,
        totalPrice: row.totalPrice,
        status: this.statusList[row.status].label,
        address: row.address,
      };
    },
    // 提交表单
    submitForm() {
      axios({
        url: "/api/business/order/update",
        headers: {
          token: localStorage.getItem("token"),
        },
        method: "put",
        data: {
          orderId: this.form.id,
          status: this.form.status,
        },
        // params: {
        //   orderId: this.form.id,
        //   status: this.form.status,
        //   totalPrice: this.form.totalPrice,
        //   address: this.form.address,
        //
      })
        .then((res) => {
          console.log(res.data.data);
          this.loadData(); // 刷新订单数据
          this.editflag = false; // 关闭编辑状态
        })
        .catch((err) => {
          console.log(err.data.msg);
        });
    },
    // 删除订单
    deleteOrder(id) {
      axios({
        url: "/api/business/order/delete",
        headers: {
          token: localStorage.getItem("token"),
        },
        method: "delete",
        params: {
          orderId: id,
        },
        // data: {
        //   orderId: id,
        // },
      })
        .then((res) => {
          console.log(id);
          console.log(res.data.data);
          this.loadData(); // 刷新订单数据
        })
        .catch((err) => {
          console.log(id);
          console.log(err.data.msg);
        });
    },
    // 查看订单详情
    viewOrder(id) {
      // 在这里添加响应按钮和配置路由，跳转到订单详情页
      this.$router.push({
        path: "/business/manage/orderdetail",
        query: {
          id: id,
        },
      });
    },
    searchOrders() {

      if (this.searchMap.id) {
        this.searchID(this.searchMap.id);
      }
      if (this.searchMap.status) {
        this.searchStatus(this.searchMap.status);
      } else {
        this.loadData();
      }
    },
    // 根据id查询订单
    searchID(id) {
      axios
        .get("/api/business/order/page/detail", {
          headers: {
            token: localStorage.getItem("token"),
          },
          params: {
            orderId: id,
          },
        })
        .then((res) => {
          console.log(res);
          console.log(res.data.data);
          this.total = 1;
          this.records = [res.data.data]; // 用搜索结果替换现有的records
          console.log(this.records);
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
        });
    },
    searchStatus(status) {
      axios
        .get("/api/business/order/page/detail/status", {
          headers: {
            token: localStorage.getItem("token"),
          },
          params: {
            status: status,
          },
        })
        .then((res) => {
          console.log(res);
          console.log(res.data.data);
          this.total = res.data.data.total;
          this.records = [res.data.data]; // 用搜索结果替换现有的records
        });
    },

    // 分页改变时触发
    changePage(page) {
      this.currentPage = page;
      this.loadData(); // 重新加载数据
    },
    // 加载数据
    loadData() {
      axios({
        url: "/api/business/order/page",
        headers: {
          token: localStorage.getItem("token"),
        },
        method: "get",
        params: {
          status: "1", // 根据需求填写
          page: this.currentPage, // 当前页码
          pageSize: this.pageSize, // 每页数量
          id: null, // 根据需求填写
          phone: null, // 根据需求填写
        },
      })
        .then((res) => {
          console.log(res.data.data);
          
          this.total = res.data.data.total;
          this.records = res.data.data.records;
        })
        .catch((err) => {
          console.log(err.data.msg);
        });
    },
  },
  created() {
    this.loadData(); // 初始化加载数据
  },
};
</script>
