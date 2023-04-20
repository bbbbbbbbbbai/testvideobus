<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
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
          v-hasPermi="['system:role:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="角色编码" prop="code"/>
      <el-table-column label="角色名称" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="updateInfo.createdTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateInfo.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >删除
          </el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown" v-hasPermi="['system:role:allocatePermission', 'system:role:allocateUser']">
              <el-dropdown-item command="handleMenuScope" icon="el-icon-circle-check"
                                v-hasPermi="['system:role:allocatePermission']">分配权限
              </el-dropdown-item>
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"
                                v-hasPermi="['system:role:allocateUser']">分配用户
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配分配权限对话框 -->
    <el-dialog :title="title" :visible.sync="openMenuScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色编码">
          <el-input v-model="form.code" :disabled="true"/>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="form.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="分配权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="false"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMenuScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listRole,
    getRole,
    getRolePermissionIds,
    delRole,
    addRole,
    updateRole,
    updateRolePermission,
    changeRoleStatus
  } from "@/api/system/role";
  import {listMenu} from "@/api/system/menu";

  export default {
    name: "Role",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 角色表格数据
        roleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        openMenuScope: false,
        menuExpand: false,
        menuNodeAll: false,
        // 菜单列表
        menuOptions: [],
        // 查询参数
        queryParams: {
          page: 1,
          limit: 10,
          name: undefined,
          code: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "name"
        },
        // 表单校验
        rules: {
          name: [
            {required: true, message: "角色名称不能为空", trigger: "blur"}
          ],
          code: [
            {required: true, message: "角色编码不能为空", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询角色列表 */
      getList() {
        this.loading = true;
        listRole(this.queryParams).then(response => {
            this.roleList = response.data.rows;
            this.total = response.data.count;
            this.loading = false;
          }
        );
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加角色";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        getRole(row.id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改角色";
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        this.$modal.confirm('是否确认删除角色' + row.name + '？').then(function () {
          return delRole(row.id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      },

      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateRole(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addRole(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        if (this.$refs.menu != undefined) {
          this.$refs.menu.setCheckedKeys([]);
        }
        this.menuExpand = false,
          this.menuNodeAll = false,
          this.form = {
            id: undefined,
            code: undefined,
            name: undefined,
            menuIds: []
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
      // 更多操作触发
      handleCommand(command, row) {
        switch (command) {
          case "handleMenuScope":
            this.handleMenuScope(row);
            break;
          case "handleAuthUser":
            this.handleAuthUser(row);
            break;
          default:
            break;
        }
      },

      /** 分配权限操作 */
      handleMenuScope(row) {
        this.reset();
        const roleId = row.id
        getRole(roleId).then(response => {
          this.form = response.data;
          this.openMenuScope = true;
          this.setAllMenuTreeselect(roleId);
          this.title = "分配权限";
        });
      },
      setAllMenuTreeselect(roleId) {
        listMenu().then(response => {
          this.menuOptions = this.handleTree(response.data, "id");
          this.setRoleMenus(roleId);
        });
      },
      setRoleMenus(roleId) {
        getRolePermissionIds(roleId).then(response => {
          let roleMenus = response.data;
          this.$nextTick(() => {
            roleMenus.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              })
            })
          });
        });
      },
      // 树权限（展开/折叠）
      handleCheckedTreeExpand(value) {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      },
      // 树权限（全选/全不选）
      handleCheckedTreeNodeAll(value) {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      },
      // 选中的菜单节点数据
      getMenuAllCheckedKeys() {
        // 目前被选中的菜单节点
        let checkedKeys = this.$refs.menu.getCheckedKeys();
        // 半选中的菜单节点
        let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
        checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
        return checkedKeys;
      },
      /** 提交按钮（数据权限） */
      submitMenuScope: function () {
        let roleId = this.form.id;
        let permissionIds = this.getMenuAllCheckedKeys().join(',');
        updateRolePermission({roleId, permissionIds}).then(response => {
          this.$modal.msgSuccess("修改权限成功");
          this.openMenuScope = false;
          this.getList();
        }).catch(() => {
        });

      },
      // 取消按钮（数据权限）
      cancelDataScope() {
        this.openMenuScope = false;
        this.reset();
      },

      /** 分配用户操作 */
      handleAuthUser: function (row) {
        const roleId = row.id;
        this.$router.push("/system/role-auth/user/" + roleId);
      }
    }
  };
</script>
