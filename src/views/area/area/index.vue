<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                        <el-form-item label="区域名称" prop="name">
                            <el-input
                                    v-model="queryParams.name"
                                    placeholder="请输入区域名称"
                                    clearable
                                    @keyup.enter.native="handleQuery"
                            />
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input
                                    v-model="queryParams.remark"
                                    placeholder="请输入备注"
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
                        v-hasPermi="['area:area:save']"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['area:area:remove']"
                >删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="areaList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
            <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="ID" align="center" prop="id" sortable="custom"/>
                    <el-table-column label="区域名称" align="center" prop="name" sortable="custom"/>
                    <el-table-column label="备注" align="center" prop="remark" sortable="custom"/>
                    <el-table-column label="创建时间" align="center" prop="updateInfo.createdTime" width="180" sortable="custom">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.updateInfo.createdTime) }}</span>
                        </template>
                    </el-table-column>
                        <el-table-column label="创建人" align="center" prop="updateInfo.creator" sortable="custom"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['area:area:update']"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['area:area:remove']"
                    >删除</el-button>
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

        <!-- 添加或修改区域管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                                <el-form-item label="区域名称" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入区域名称" />
                                </el-form-item>
                                <el-form-item label="备注" prop="remark">
                                    <el-input v-model="form.remark" placeholder="请输入备注" />
                                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { listArea, getArea, delArea, addArea, updateArea } from "@/api/area/area";

    export default {
        name: "Area",
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
                // 区域管理表格数据
                    areaList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    page: 1,
                    limit: 10,
                    name: null,
                    remark: null,
        },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                        name: [
                        { required: true, message: "区域名称不能为空", trigger: "blur" }
                    ],
            }
        };
        },
        created() {
            this.getList();
        },
        methods: {
            /** 查询区域管理列表 */
            getList() {
                this.loading = true;
                listArea(this.queryParams).then(response => {
                    this.areaList = response.data.rows;
                    this.total = response.data.count;
                    this.loading = false;
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
                        id: null,
                        name: null,
                        remark: null,
                        createdTime: null,
                        creator: null,
                        creatorId: null,
                        lastOperator: null,
                        lastOperatorId: null,
                        updateTime: null
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
                this.ids = selection.map(item => item.id)
                this.single = selection.length!==1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加区域";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids
                getArea(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改区域";
                });
            },
            /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.id != null) {
                            updateArea(this.form).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addArea(this.form).then(response => {
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
                const ids = row.id || this.ids;
                this.$modal.confirm('是否确认删除区域管理编号为"' + ids + '"的数据项？').then(function() {
                    return delArea(ids);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                }).catch(() => {});
            },
            /** 表格字段排序 */
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
