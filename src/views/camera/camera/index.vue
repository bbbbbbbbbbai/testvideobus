<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                        <el-form-item label="编号" prop="code">
                            <el-input
                                    v-model="queryParams.code"
                                    placeholder="请输入编号"
                                    clearable
                                    @keyup.enter.native="handleQuery"
                            />
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker
                                    v-model="daterangeCreatedTime"
                                    style="width: 340px"
                                    value-format="timestamp"
                                    type="datetimerange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="创建人" prop="creator">
                            <el-input
                                    v-model="queryParams.creator"
                                    placeholder="请输入创建人"
                                    clearable
                                    @keyup.enter.native="handleQuery"
                            />
                        </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    size="mini"
                    @click="handleQuery"
                    >搜索</el-button
                    >
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                    >重置</el-button
                    >
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
                        v-hasPermi="['camera:camera:save']"
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
                        v-hasPermi="['camera:camera:remove']"
                >删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="cameraList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
            <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="ID" align="center" prop="id" width="80" sortable="custom"/>
                    <el-table-column label="编号" align="center" prop="code" sortable="custom"/>
                    <el-table-column label="经度" align="center" prop="longitude" sortable="custom"/>
                    <el-table-column label="纬度" align="center" prop="latitude" sortable="custom"/>
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
                            v-hasPermi="['camera:camera:update']"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['camera:camera:remove']"
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

        <!-- 添加或修改摄像头信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                                <el-form-item label="编号" prop="code">
                                    <el-input v-model="form.code" placeholder="请输入编号" />
                                </el-form-item>
                                <el-form-item label="经度" prop="longitude">
                                    <el-input v-model="form.longitude" placeholder="请输入经度" />
                                </el-form-item>
                                <el-form-item label="纬度" prop="latitude">
                                    <el-input v-model="form.latitude" placeholder="请输入纬度" />
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
    import { listCamera, getCamera, delCamera, addCamera, updateCamera } from "@/api/camera/camera";

    export default {
        name: "Camera",
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
                // 摄像头信息表格数据
                    cameraList: [],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                        // 纬度时间范围
                        daterangeCreatedTime: [],
                // 查询参数
                queryParams: {
                    page: 1,
                    limit: 10,
                    code: null,
                    createdTime: null,
                    creator: null,
        },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
            }
        };
        },
        created() {
            this.getList();
        },
        methods: {
            /** 查询摄像头信息列表 */
            getList() {
                this.loading = true;
                this.addDateRange(this.queryParams, this.daterangeCreatedTime, 'CreatedTime')
                listCamera(this.queryParams).then(response => {
                    this.cameraList = response.data.rows;
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
                        code: null,
                        longitude: null,
                        latitude: null,
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
                        this.daterangeCreatedTime = [];
                this.resetForm("queryForm");
                this.handleQuery();
            },
            setQuery(queryParams) {
                this.queryParams = Object.assign(this.queryParams, queryParams);
                this.daterangeCreatedTime = this.fillDateRange(this.queryParams, 'CreatedTime');
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
                this.title = "添加摄像头信息";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids
                getCamera(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改摄像头信息";
                });
            },
            /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.id != null) {
                            updateCamera(this.form).then(response => {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            });
                        } else {
                            addCamera(this.form).then(response => {
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
                this.$modal.confirm('是否确认删除摄像头信息编号为"' + ids + '"的数据项？').then(function() {
                    return delCamera(ids);
                }).then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                }).catch(() => {});
            }
        }
    };
</script>
