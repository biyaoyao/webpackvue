<template>
    <div class="signinpanel">
        <div class="row">
            <div class="col-sm-7">
                <div class="signin-info">
                    <div class="logopanel m-b">
                        <h1>[ DIY海报后台管理系统 ]</h1>
                    </div>
                    <div class="m-b"></div>
                    <h4>欢迎使用 <strong>后台管理系统</strong></h4>
                    <ul class="m-b">
                    </ul>
                </div>
            </div>
            <div class="col-sm-5">
                <form name="myForm" novalidate>
                    <h4 class="no-margins">登录：</h4>
                    <p class="m-t-md">登录后台管理系统</p>
                    <input type="text" id="nickname" required v-model='admin.account' value="admin"
                           onclick="JavaScript:this.value=''" class="form-control uname" placeholder="用户名"/>
                    <input id="password" required v-model='admin.password' value="密码" onclick="JavaScript:this
                    .value=''" type="password" class="form-control pword m-b" placeholder="密码"/>
                    <a href="#">&nbsp;</a>
                    <a @click="login()" class="btn btn-success btn-block">登录</a>
                </form>

            </div>
        </div>
        <div class="signup-footer">
            <div class="pull-left">
                &copy; 2015 All Rights Reserved. biyaoyao.com
            </div>
        </div>
    </div>
</template>
<style>

</style>
<script>
    import 'assets/admin/css/login.min.css';
import 'assets/js/global';
import Lib from 'assets/js/Lib';
import api from 'assets/js/api';
export default{
    data(){
        return{
            admin:{
                account:'',
                password:''
            }
        }
    },
    components:{

    },
    created(){
        $('body').addClass('signin');
        $('body').removeClass('fixed-sidebar full-height-layout gray-bg');
    },
    methods:{
        login(){
            this.$vux.loading.show({
                text: '登陆中...'
            });
            const data =this.admin;
            $.ajax({
                'url':api.adminLogin,
                'data':data,

                'success':(res)=>{
                    if(res.code===200){
                        this.$vux.loading.hide();
                        location.href='/admin/home';
                    }else{
                        alert(res.errMsg);
                        this.$vux.loading.hide();
                    }
                },
                'error':(error)=>{
                    this.$vux.loading.hide();
                    alert('网络出错');
                }
            });
        }
    }
}

</script>
