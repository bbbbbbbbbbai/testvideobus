<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
    <el-form-item label="摄像头编号" prop="cameraCode">
        <el-input
          v-model="queryParams.cameraCode"
          placeholder="请输入摄像头编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号" prop="carNo">
        <el-input
          v-model="queryParams.carNo"
          placeholder="请输入车牌号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入文件编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下载次数" prop="downloadTimes">
        <el-input
          v-model="queryParams.downloadTimes"
          placeholder="请输入下载次数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件后缀名" prop="ext">
        <el-input
          v-model="queryParams.ext"
          placeholder="请输入文件后缀名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文件名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传人" prop="uploader">
        <el-input
          v-model="queryParams.uploader"
          placeholder="请输入上传人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreatedTime"
          style="width: 240px"
          value-format="timestamp"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['video:video:save']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['video:video:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="videoList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" sortable="custom" width="60" />
      <el-table-column
        label="摄像头编号"
        align="center"
        prop="cameraCode"
        sortable="custom"
        width="120"
      />
      <el-table-column
        label="车牌号"
        align="center"
        prop="carNo"
        sortable="custom"
        width="90"
      />
      <el-table-column
        label="文件编号"
        align="center"
        prop="code"
        sortable="custom"
        width="180"
      />
      <el-table-column
        label="下载次数"
        align="center"
        prop="downloadTimes"
        sortable="custom"
        width="100"
      />
      <el-table-column
        label="文件后缀名"
        align="center"
        prop="ext"
        sortable="custom"
        width="120"
      />
      <el-table-column
        label="文件名"
        align="center"
        prop="name"
        sortable="custom"
      />
      <el-table-column
        label="文件大小"
        align="center"
        prop="readsize"
        sortable="custom"
        width="120"
      />
      <el-table-column
        label="上传人"
        align="center"
        prop="uploader"
        sortable="custom"
        width="120"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="updateInfo.createdTime"
        width="180"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.updateInfo.createdTime)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
         
        <template slot-scope="scope">
            <el-button
            size="mini"
            type="text"
            icon="el-icon-video-camera"
            @click="handlePreview(scope.row)"
            v-hasPermi="['video:video:preview']"
            >预览</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-hasPermi="['video:video:download']"
            >下载</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-sugar"
            @click="handleComment(scope.row)"
            v-hasPermi="['video:video:comment']"
            >评论</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['video:video:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['video:video:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <!-- 添加或修改视频信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="摄像头" prop="cameraCode">
            <el-select
                v-model="form.cameraCode"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="listRemoteCamera"
                :loading="loading">
                <el-option
                v-for="item in this.cameraOptions"
                :key="item.id"
                :label="item.code"
                :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNo">
            <el-select
                v-model="form.carNo"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="listCars"
                :loading="loading">
                <el-option
                v-for="item in this.cars"
                :key="item.id"
                :label="item.code"
                :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="form.id == null" label="选择视频" prop="file">
            <el-upload
                class="upload-demo"
                ref="upload"
                :multiple="true"
                :action="uploadFileUrl"
                :before-upload="handleBeforeUpload"
                :on-remove="handleRemoveFile"
                :file-list="fileList"
                :limit="20"
                :data="{'carNo': form.carNo, 'cameraCode': form.cameraCode}"
                :headers="headers"
                :on-success="handleUploadSuccess"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
                <div slot="tip" class="el-upload__tip">只能上传mp4/avi/flv文件，且不超过500M</div>
            </el-upload>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改视频信息对话框 -->
    <el-dialog title="评论视频" :visible.sync="showCommentForm" width="500px" append-to-body>
      <el-form ref="commentForm" :model="commentForm" :rules="rules" label-width="80px">
        <el-form-item label="评论内容" prop="content">
          <el-input type="textarea" v-model="commentForm.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCommentForm">确 定</el-button>
        <el-button @click="cancelComment">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listVideo,
  getVideo,
  delVideo,
  addVideo,
  updateVideo
} from "@/api/video/video";
import { remoteCars } from "@/api/car/car";
import { listRemoteCamera } from "@/api/camera/camera";
import { addComment } from "@/api/comment/comment";

import { getToken } from "@/utils/auth";

import axios from 'axios'

export default {
  name: "Video",
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
      // 视频信息表格数据
      videoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 车牌号时间范围
      daterangeCreatedTime: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 10,
        cameraCode: null,
        carNo: null,
        code: null,
        downloadTimes: null,
        ext: null,
        name: null,
        uploader: null,
        createdTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cameraCode: [{ required: true, message: "摄像头不能为空", trigger: "blur" }],
        carNo: [{ required: true, message: "车牌号不能为空", trigger: "blur" }]
      },
      cars: [],
      fileList: [],
      fileType: ['mp4', 'avi', 'flv'],
      fileSize: 500,
      headers: {
        Authorization: getToken(),
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/video/video/upload", // 上传的图片服务器地址
      commentForm: {},
      showCommentForm: false,
      cameraOptions: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询视频信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (
        null != this.daterangeCreatedTime &&
        "" != this.daterangeCreatedTime
      ) {
        this.queryParams.beginCreatedTime =
          this.daterangeCreatedTime[0];
        this.queryParams.endCreatedTime =
          this.daterangeCreatedTime[1];
      }
      listVideo(this.queryParams).then((response) => {
        this.videoList = response.data.rows;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    listCars(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        remoteCars({"code": query}).then(response => {
                            this.cars = response.data;
                        });
                    }, 200);
                } else {
                    this.cars = [];
                }
            },
    
    listRemoteCamera(query) {
        if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                listRemoteCamera({"code": query}).then(response => {
                    this.cameraOptions = response.data;
                });
            }, 200);
        } else {
            this.cars = [];
        }
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
        carNo: null,
        code: null,
        downloadTimes: null,
        ext: null,
        mime: null,
        name: null,
        path: null,
        readsize: null,
        size: null,
        uploader: null,
        uploadertoken: null,
        createdTime: null,
        creator: null,
        creatorId: null,
        lastOperator: null,
        lastOperatorId: null,
        updateTime: null,
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加视频信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getVideo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改视频信息";
      });
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.$modal.loading("正在上传文件，请稍候...");
      
      return true;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateVideo(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            // if(this.fileList.length <= 0) {
            //     this.$message('请选择视频文件');
            // }
            this.$refs.upload.submit();
          }
        }
      });
    },
    handleUploadSuccess() {
        this.$modal.closeLoading();
        this.$modal.msgSuccess("上传成功");
        this.open = false;
        this.getList();
        this.fileList=[];
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除视频信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delVideo(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 表格字段排序 */
    handleSortChange(sort) {
      if (sort.order) {
        this.queryParams.sortField = sort.prop;
        this.queryParams.sortType = sort.order === "ascending" ? "asc" : "desc";
      } else {
        this.queryParams.sortField = null;
        this.queryParams.sortType = null;
      }
      this.getList();
    },

    handleRemoveFile(index) {
        console.log(index)
    },
    handlePreview(row) {
        window.open(process.env.VUE_APP_BASE_API + "/video/video/preview?videoId=" + row.id, "_blank"); // 新窗口打开
    },
    handleDownload(row) {
        window.location.href=process.env.VUE_APP_BASE_API + "/video/video/down?videoId=" + row.id;
        this.getList();
    },
    handleComment(row) {
        this.commentForm.videoCode = row.code;
        this.showCommentForm = true;
    },
    cancelComment() {
      this.commentForm = {};
      this.showCommentForm = false;
    },
    submitCommentForm() {
      this.$refs["commentForm"].validate((valid) => {
        if (valid) {
          if (this.commentForm.videoCode != null) {
            addComment(this.commentForm).then((response) => {
              this.$modal.msgSuccess("评论成功");
              this.showCommentForm = false;
              this.getList();
            });
          }
        }
      });
    }
  },
};
</script>
