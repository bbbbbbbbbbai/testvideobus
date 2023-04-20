<template>
  <div class="app-container home">
    <div class="container">
        <div id="map"></div>
    </div>
    <div>
      <el-dialog :title="'摄像头['+  queryParams.cameraCode +']视频列表'" :visible.sync="dialogTableVisible">
      <el-table :data="videoList" v-loading="loading" @sort-change="handleSortChange">
        <el-table-column label="ID" align="center" prop="id" sortable="custom" width="60" />
      <el-table-column
        label="车牌号"
        align="center"
        prop="carNo"
        sortable="custom"
        width="90"
      />
      <el-table-column
        label="文件名"
        align="center"
        prop="name"
        sortable="custom"
      />
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
</el-dialog>

    </div>
  </div>
</template>

<script>
import { listAllCamera } from "@/api/camera/camera";
import {
  listVideo,
} from "@/api/video/video";
export default {
  name: "Index",
  data() {
    return {
      // 遮罩层
      loading: true,
      cameras: [],
      latLngList: [],
			points:[],
			pointsList:[],
      videoList: [],
        dialogTableVisible: false,
        total:0,
        queryParams: {
          page: 1,
          limit: 10,
          cameraCode: null,
        }
    };
  },
  mounted() {
        var map = new BMap.Map("map", {
        coordsType: 5 // coordsType指定输入输出的坐标类型，3为gcj02坐标，5为bd0ll坐标，默认为5。
                        // 指定完成后API将以指定的坐标类型处理您传入的坐标
        });          // 创建地图实例  
        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
        map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别  
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        // 判断当前浏览器是否支持绘制海量点
        if (document.createElement('canvas').getContext) {
          // 在mounted里面执行,经纬度的坐标才能获取到
          this.getCameras(map); //这里是获取内容列表
        } else {
          alert('请在chrome,safari,ie8+以上浏览器运行！');
        }
    },
  methods: {
    async getCameras(map) {
      var that = this;
      listAllCamera().then(response => {
        that.cameras = response.data;
        var myIcon = new BMap.Icon("https://static.tianyancha.com/patent/abstractPic/CN/S/305/820/CN305820949S_000035.jpg", new BMap.Size(23, 25), {
            imageSize: new BMap.Size(37, 37), // 引用图片实际大小  
        }); 
        var labelStyle = {
            color: "#fff",
            backgroundColor: "#333",
            border: "0",
            fontSize: "12px",
            opacity: "0.5",
            borderRadius: "5px",
            padding: "3px",
        };
        for(var i = 0; i < that.cameras.length; i++) {
          var point  = new BMap.Point(that.cameras[i].longitude,that.cameras[i].latitude);
          that.pointsList.push(point)
          var lab = new BMap.Label(that.cameras[i].code, {
              position: point,
              offset: new BMap.Size(-22, -32)
          });
          lab.setStyle(labelStyle);          
          var marker = new BMap.Marker(point, {icon: myIcon});
          // 给标记点加入自定义参数
          marker.customData = {cameraCode: that.cameras[i].code}
          marker.addEventListener('click', (event) => {that.showVideoList(event)})
          map.addOverlay(lab);
          map.addOverlay(marker);
        }
        map.setViewport(that.pointsList);
      })
    },
    goTarget(href) {
      window.open(href, "_blank");
    },
    
    showVideoList(event) {
      let cameraCode = event.currentTarget.customData.cameraCode;
      this.queryParams.cameraCode = cameraCode;
      this.queryParams.page = 1;
      this.getList();
      this.dialogTableVisible = true;
    },

    getList() {
      this.loading = true;
      listVideo(this.queryParams).then((response) => {
        this.videoList = response.data.rows;
        this.total = response.data.count;
        this.loading = false;
      });
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
    handlePreview(row) {
        window.open(process.env.VUE_APP_BASE_API + "/video/video/preview?videoId=" + row.id, "_blank"); // 新窗口打开
    },
    handleDownload(row) {
        window.open(process.env.VUE_APP_BASE_API + "/video/video/down?videoId=" + row.id, "_blank"); 
        this.getList();
    },
  },

};
</script>

<style scoped lang="scss">
 .container {
        position: relative;
    }
    #map {
        position: fixed;
        left: 0;
        right: 0;
        width: 100%;
        height: 90vh;
    }
    </style>

