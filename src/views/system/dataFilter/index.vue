<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="过滤类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择任务组名" clearable>
          <el-option
            v-for="dict in dict.type.sys_data_filter"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="条件头" prop="head">
        <el-input
          v-model="queryParams.head"
          placeholder="请输入条件头"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="条件体" prop="body">
        <el-input
          v-model="queryParams.body"
          placeholder="请输入条件体"
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
          v-hasPermi="['system:dataFilter:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:dataFilter:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataFilterList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" align="center"/>
      <el-table-column label="编号" prop="id"  width="90" align="center" sortable="custom"/>
      <el-table-column label="过滤类型" width="200" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_data_filter" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="类型编号" prop="type" width="250"  sortable="custom" align="center"/>
      <el-table-column label="条件头" prop="head" align="center"  sortable="custom" :show-overflow-tooltip="true"/>
      <el-table-column label="条件体" prop="body" align="center"  sortable="custom" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true"/>
      <el-table-column label="创建人" prop="updateInfo.creator" align="center" :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" prop="updateInfo.createdTime" sortable="custom" align="center">
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
            v-hasPermi="['system:dataFilter:update']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dataFilter:remove']"
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="过滤类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择过滤类型">
                <el-option
                  v-for="dict in dict.type.sys_data_filter"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条件头" prop="head">
              <el-input v-model="form.head" placeholder="请输入条件头"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="条件体" prop="body">
              <el-input v-model="form.body" placeholder="请输入条件体"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
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
  import {listDataFilter, addDataFilter, updateDataFilter, delDataFilters} from "@/api/system/dataFilter";

  export default {
    name: "Dict",
    dicts: ['sys_data_filter'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 角色表格数据
        dataFilterList: [],
        // 非多个禁用
        multiple: true,
        ids: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          page: 1,
          limit: 10,
          type: undefined,
          head: undefined,
          body: undefined,
          sortField: undefined,
          sortType: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          type: [
            {required: true, message: "过滤类型不能为空", trigger: "blur"}
          ],
          head: [
            {required: true, message: "条件头不能为空", trigger: "blur"}
          ],
          body: [
            {required: true, message: "条件体不能为空", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        listDataFilter(this.queryParams).then(response => {
            this.dataFilterList = response.data.rows;
            this.total = response.data.count;
            this.loading = false;
          }
        );
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加过滤配置";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.form = row;
        this.open = true;
        this.title = "修改过滤配置";
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm(ids instanceof Array ? '确定删除这些配置吗？' : '是否确认删除编号为"' + row.id + '"的配置？').then(function () {
          return delDataFilters(ids);
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
            if (this.form.id !== undefined) {
              updateDataFilter(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDataFilter(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.reset();
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
        this.form = {};
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
        this.multiple = !selection.length;
      },

      handleSortChange(sort) {
        if (sort.order) {
          this.queryParams.sortField = sort.prop;
          this.queryParams.sortType = sort.order === 'ascending' ? 'asc' : 'desc';
        } else {
          this.queryParams.sortField = null;
          this.queryParams.sortType = null;
        }
        this.getList();
      }
    }
  };
</script>
