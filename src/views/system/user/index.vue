<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
          <el-form-item label="用户账号" prop="loginName">
            <el-input
              v-model="queryParams.loginName"
              placeholder="请输入用户账号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户姓名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入用户姓名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="queryParams.phone"
              placeholder="请输入手机号码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="ID" align="center" key="id" prop="id" v-if="columns[0].visible" width="60"/>
          <el-table-column label="用户账号" align="center" key="loginName" prop="loginName" v-if="columns[1].visible"
                           :show-overflow-tooltip="true" width="130"/>
          <el-table-column label="用户姓名" align="center" key="name" prop="name" v-if="columns[2].visible"
                           :show-overflow-tooltip="true" width="130"/>
          <el-table-column label="手机号码" align="center" key="phone" prop="phone" v-if="columns[3].visible" width="150"/>
          <el-table-column label="邮箱" align="center" key="email" prop="email" v-if="columns[4].visible" width="170"/>
          <el-table-column label="身份证号" align="center" key="idCard" prop="idCard" v-if="columns[5].visible"
                           width="190"/>
          <el-table-column label="状态" align="center" key="enable" v-if="columns[6].visible" width="100">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                @change="handleEnableChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="过期时间" align="center" prop="expiryDate" v-if="columns[7].visible" width="170">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expiryDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="updateInfo.createdTime" v-if="columns[8].visible"
                           width="170">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateInfo.createdTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" key="remark" prop="remark" v-if="columns[9].visible" width="200"/>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户账号" prop="loginName">
              <el-input v-model="form.loginName" placeholder="请输入用户用户账号" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户用户姓名" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" maxlength="20" show-password/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期时间" prop="expiryDate">
              <el-date-picker
                v-model="form.expiryDate"
                style="width: 200px"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="30"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" maxlength="18"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listUser, getUser, delUser, addUser, updateUser, changeUserStatus} from "@/api/system/user";

  export default {
    name: "User",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 用户表格数据
        userList: null,
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 角色选项
        roleOptions: [],
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 查询参数
        queryParams: {
          page: 1,
          limit: 10,
          loginName: '',
          name: '',
          phone: ''
        },
        // 列信息
        columns: [
          {key: 0, label: `ID`, visible: true},
          {key: 1, label: `用户账号`, visible: true},
          {key: 2, label: `用户姓名`, visible: true},
          {key: 3, label: `手机号`, visible: true},
          {key: 4, label: `邮箱`, visible: true},
          {key: 5, label: `身份证号`, visible: true},
          {key: 6, label: `状态`, visible: true},
          {key: 7, label: `过期时间`, visible: true},
          {key: 8, label: `创建时间`, visible: true},
          {key: 9, label: `备注`, visible: true}
        ],
        // 表单校验
        rules: {
          loginName: [
            {required: true, message: "用户账号不能为空", trigger: "blur"},
            {min: 2, max: 20, message: '用户账号长度必须介于 5 和 20 之间', trigger: 'blur'}
          ],
          name: [
            {required: true, message: "用户姓名不能为空", trigger: "blur"},
            {min: 2, max: 20, message: '用户姓名长度必须介于 2 和 10 之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: "密码不能为空", trigger: "blur"},
            {min: 5, max: 50, message: '密码长度必须介于 5 和 50 之间', trigger: 'blur'}
          ],
          email: [
            {
              type: "email",
              message: "请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ],
          expiryDate: [
            {
              required: true,
              message: "过期时间不能为空",
              trigger: "blur"
            }
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        listUser(this.queryParams).then(response => {
            this.userList = response.data.rows;
            this.total = response.data.count;
            this.loading = false;
          }
        );
      },
      // 用户状态修改
      handleEnableChange(row) {
        let text = row.enable ? "启用" : "停用";
        this.$modal.confirm('确认要' + text + '"' + row.name + '"用户吗？').then(function () {
          return changeUserStatus(row.id, row.enable);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function () {
          row.enable = !row.enable;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          code: undefined,
          name: undefined,
          password: undefined,
          phone: undefined,
          email: undefined,
          idCard: undefined,
          expiryDate: undefined,
          remark: undefined
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加用户";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const userId = row.id;
        getUser(userId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改用户";
        });
      },

      /** 分配角色操作 */
      handleAuthRole: function (row) {
        const userId = row.id;
        this.$router.push("/system/user-auth/role/" + userId);
      },

      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              updateUser(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addUser(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const id = row.id;
        this.$modal.confirm(`确定删除用户${row.name}？`).then(function () {
          return delUser(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      }
    }
  };
</script>
