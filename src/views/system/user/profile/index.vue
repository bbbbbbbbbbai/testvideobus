<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab" @tab-click="getUser()">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getSessionUserInfo } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userInfo, resetPwd },
  data() {
    return {
      user: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getSessionUserInfo().then(response => {
        this.user = response.data;
      });
    }
  }
};
</script>
