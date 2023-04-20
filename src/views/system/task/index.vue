<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item label="订阅者代码" prop="subscriber">
        <el-input
          v-model="queryParams.subscriber"
          placeholder="请输入订阅者代码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订阅者名称" prop="subscriberName">
        <el-input
          v-model="queryParams.subscriberName"
          placeholder="请输入订阅者名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务参数" prop="params">
        <el-input
          v-model="queryParams.params"
          placeholder="请输入任务参数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择执行状态" clearable>
          <el-option label="完成" value="FINISH"></el-option>
          <el-option label="失败" value="FAIL"></el-option>
          <el-option label="等待中" value="WAITING"></el-option>
          <el-option label="执行中" value="EXECUTING"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始执行时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 340px"
          value-format="timestamp"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          icon="el-icon-thumb"
          size="mini"
          :disabled="!batchExecute"
          @click="handleRun"
          v-hasPermi="['system:task:execute']"
        >批量执行</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务编号" width="90" align="center" prop="id" />
      <el-table-column label="订阅者名称" align="center" prop="subscriberName" :show-overflow-tooltip="true"  width="190"/>
      <el-table-column label="任务参数" align="center"  prop="params" :show-overflow-tooltip="true" />
      <el-table-column label="执行次数" align="center" prop="executeTimes" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="finishTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.finishTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败时间" align="center" prop="failTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.failTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 'FINISH'">完成</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status == 'FAIL'">失败</el-tag>
          <el-tag v-else-if="scope.row.status == 'WAITING'">等待中</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 'EXECUTING'">执行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="updateInfo.creator" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="updateInfo.createdTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateInfo.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-caret-right"
            @click="handleRun(scope.row)"
            v-hasPermi="['system:task:execute']"
            :disabled="!(scope.row.status=='FAIL')"
          >执行一次</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >任务详细</el-button>
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

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" :visible.sync="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号：">{{ form.id }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订阅者名称：">{{ form.subscriberName }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="订阅者代码：">{{ form.subscriber }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务参数：">{{ form.params }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行次数：">{{ form.executeTimes }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行状态：">
              <span type="success" v-if="form.status == 'FINISH'">完成</span>
              <span type="danger" v-else-if="form.status == 'FAIL'">失败</span>
              <span v-else-if="form.status == 'WAITING'">等待中</span>
              <span type="warning" v-else-if="form.status == 'EXECUTING'">执行中</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间：">
              {{ form.startTime != null ? parseTime(form.startTime) : '' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间：">
              {{ form.finishTime != null ? parseTime(form.finishTime) : '' }}
            </el-form-item>
          </el-col>

          <el-col :span="12" v-if="form.status == 'FAIL'">
            <el-form-item label="失败时间：">
              {{ form.failTime != null ? parseTime(form.failTime) : '' }}
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.status == 'FAIL'">
            <el-form-item label="异常信息：">
              {{form.exceptionMsg}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTask, executeTasks} from "@/api/system/task";

export default {
  name: "Task",
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
      // 定时任务表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      form: {},
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: "",
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        subscriber: undefined,
        subscriberName: undefined,
        params: undefined,
        status: undefined
      },
      dateRange: [],
      batchExecute: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      this.addDateRange(this.queryParams, this.dateRange);
      listTask(this.queryParams).then(response => {
        this.taskList = response.data.rows;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      this.batchExecute = selection.length >= 1 && selection.every(item => item.status == 'FAIL');
    },
    /* 立即执行一次 */
    handleRun(row) {
      const taskIds = row.id || this.ids;
      this.$modal.confirm(taskIds instanceof Array ? '确定要立即执行一次这些任务吗？' : '确认要立即执行一次编号为"' + row.id + '"的任务吗？').then(function() {
        return executeTasks(taskIds);
      }).then(() => {
        this.$modal.msgSuccess("执行成功");
        this.getList();
        this.batchExecute = false;
      }).catch(() => {});
    },
    /** 任务详细信息 */
    handleView(row) {
      this.form = row;
      this.openView = true;
    }
  }
};
</script>
