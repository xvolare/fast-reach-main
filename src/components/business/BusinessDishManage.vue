TODO
点击菜品管理，自动跳转到分页查询，这个界面要借鉴黑马苍穹外卖的UI设计，有分页查询（包括关键字查询），新增、编辑，删除菜品，删除接口的后端config代理我没配置，这个得在按钮的@click的方法里配置
TODO
新增菜品跳转到src\views\business\dishfunction\AddDishView.vue界面，编辑菜品跳转到src\views\business\dishfunction\EditDishView.vue，这个你们自己添加跳转按钮和配置路由
TODO 要注意编辑菜品和删除菜品的按钮是一个菜品一个，新增菜品只有一个 TODO
请求时候data里面的数据得根据前端设计设置，这个你们来加
<template>
  <div>
    <div>
      &nbsp;&nbsp;&nbsp;
      <div class="ss">
        <el-input v-model="input" placeholder="请输入菜品名称"></el-input>
      </div>
      &nbsp;&nbsp;&nbsp;
      <div class="ss">
        <el-select v-model="value" placeholder="请选择菜品状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
      <el-button type="primary" @click="searchDish">查询菜品</el-button>
      <span id="right">
        <el-button type="success" round @click="openDialogAdd">添加菜品</el-button>
        <el-dialog title="添加菜品信息" :visible.sync="dialogFormVisibleAdd">
          <el-form :model="form">
            <el-form-item label="菜品名称" :label-width="'120px'">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品价格" :label-width="'120px'">
              <el-input v-model="form.price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品描述" :label-width="'120px'">
              <el-input v-model="form.description" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜品状态" :label-width="'120px'">
              <el-select v-model="form.status" placeholder="请选择菜品状态">
                <el-option label="正在售卖" value="1"></el-option>
                <el-option label="停止售卖" value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="菜品图片" :label-width="'120px'">
              <input
                name="file"
                type="file"
                accept="image/png,image/gif,image/jpeg"
                @change="saveImg"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="submitFormAdd">确 定</el-button>
          </div>
        </el-dialog>
      </span>
    </div>
    <el-table :data="records" style="width: 100%">
      <el-table-column label="图片" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="菜品图片" style="width: 100%; height: auto" />
        </template>
      </el-table-column>
      <el-table-column prop="id" label="id" width="180" v-if="false"></el-table-column>
      <el-table-column prop="name" label="菜品名称" width="180"></el-table-column>
      <el-table-column prop="price" label="价格" width="120"></el-table-column>
      <el-table-column label="描述" prop="description"></el-table-column>

      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">停止售卖</span>
          <span v-else-if="scope.row.status == 1">正在售卖</span>
        </template>
      </el-table-column>
      <el-table-column label="销售次数" prop="sum" width="120"></el-table-column>
      <el-table-column label="功能" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row)">编辑</el-button>
          <el-dialog title="修改菜品信息" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="菜品名称" :label-width="'120px'">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜品价格" :label-width="'120px'">
                <el-input v-model="form.price" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜品描述" :label-width="'120px'">
                <el-input v-model="form.description" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜品状态" :label-width="'120px'">
                <el-select v-model="form.status" placeholder="请选择菜品状态">
                  <el-option label="正在售卖" value="1"></el-option>
                  <el-option label="停止售卖" value="0"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="菜品图片" :label-width="'120px'">
                <input
                  name="file"
                  type="file"
                  accept="image/png,image/gif,image/jpeg"
                  @change="update"
                />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
          </el-dialog>

          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="open(scope.row)">删除</el-button>
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
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      newImg: null,
      options: [
        {
          value: 2,
          label: "全部",
        },
        {
          value: 1,
          label: "正在售卖",
        },
        {
          value: 0,
          label: "停止售卖",
        },
      ],
      value: "",
      input: "",
      //////
      total: null,
      records: [],
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的条目数
      dialogFormVisible: false,
      dialogFormVisibleAdd: false,
      form: {
        id: null,
        name: "",
        price: "",
        description: "",
        status: null,
        image: "",
      },
      fileList: [],
    };
  },
  methods: {
    saveImg(e) {
      this.newImg = e;
    },
    open(row) {
      this.$confirm("此操作将删除该菜品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteDish(row.id),
            this.$message({
              type: "success",
              message: "删除成功!",
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //////////////////////
    deleteDish(id) {
      axios({
        //菜品删除
        url: "/api/business/dish/delete",
        method: "delete",
        headers: {
          token: localStorage.getItem("token"),
        },
        params: {
          id: id,
        },
      })
        .then((res) => {
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push("/business/login");
            return;
          }
          location.reload();
          console.log(res.data.data);
        })
        .catch((err) => {
          console.log(err.data.msg);
        });
    },
    ////////////////////////////
    searchDish() {
      axios({
        //菜品分页查询
        url: "/api/business/dish/page",
        method: "get",
        headers: {
          token: localStorage.getItem("token"),
        },
        params: {
          name: this.input, //就是输入框得到的要查询菜品的名字，默认没有
          status: this.value,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push("/business/login");
            return;
          }
          console.log(res.data.data);
          this.total = res.data.data.total;
          this.records = res.data.data.records;
        })
        .catch((err) => {
          console.log(err.data.msg);
        });
    },
    ///////////////
    submitForm() {
      this.dialogFormVisible = false;
      console.log(this.form.id);
      axios
        .post(
          "/api/business/dish/edit",
          {
            id: this.form.id,
            description: this.form.description,
            name: this.form.name,
            price: this.form.price,
            status: this.form.status,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push("/business/login");
            return;
          }
          console.log(res.data);
          location.reload();
        });
    },
    async submitFormAdd() {
      this.dialogFormVisibleAdd = false;
      var res = await axios.post(
        "/api/business/dish/add",
        {
          description: this.form.description,
          name: this.form.name,
          price: this.form.price,
          status: this.form.status,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (res.data.msg == "NOT_LOGIN") {
        this.$router.push("/business/login");
        return;
      }
      this.form.id = res.data.data;
      console.log(this.form.id);
      console.log(res.data);

      this.update(this.newImg);
      location.reload();
    },

    openDialog(row) {
      this.dialogFormVisible = true;
      this.form = row;
    },
    openDialogAdd() {
      this.dialogFormVisibleAdd = true;
      this.form = {
        id: null,
        name: "",
        price: "",
        description: "",
        status: null,
        image: "",
      };
    },
    update(e) {
      let file = e.target.files[0];
      console.log(this.form.id);
      let param = new FormData(); //创建form对象
      param.append("file", file); //通过append向form对象添加数据
      param.append("id", this.form.id);
      console.log(param.get("file")); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        }, //这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
      }; //添加请求头
      axios.post("/api/business/dish/upload", param, config).then((response) => {
        if (response.data.msg == "NOT_LOGIN") {
          this.$router.push("/business/login");
          return;
        }
        console.log(response.data);
      });
    },
    changePage() {
      axios({
        //菜品分页查询
        url: "/api/business/dish/page",
        method: "get",
        headers: {
          token: localStorage.getItem("token"),
        },
        params: {
          name: null, //就是输入框得到的要查询菜品的名字，默认没有
          page: this.currentPage,
          status: 2,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.msg == "NOT_LOGIN") {
            this.$router.push("/business/login");
            return;
          }
          console.log(res.data.data);
          this.total = res.data.data.total;
          this.records = res.data.data.records;
        })
        .catch((err) => {
          console.log(err.data.msg);
        });
    },
  },
  mounted() {
    this.changePage();
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 20;
  }
}

.bg-purple-dark {
  background: #99a9bf;
}

.ss {
  display: inline-block;
}

#right {
  display: inline-block;
  float: right;
}
</style>
