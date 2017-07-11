/**
 * Created by v-biyaoyao on 2017/6/10.
 */
let host = "/api";
let Rxports = {
    adminLogin: host + '/passport/admin/login.do', //管理员登录
    posterList: host + '/admin/poster/list.do', //海报模板列表
    posterAdd: host + '/admin/poster/add.do', //添加海报模板
    posterUpdate: host + '/admin/poster/%/update.do', //更新海报模板
    posterDetail: host + '/admin/poster/%/detail.do', //海报模板详情
    posterHidden: host + '/admin/poster/%/hidden.do', //隐藏海报模板
    posterShow: host + '/admin/poster/%/show.do', //显示海报模板
    posterPreview: host + '/admin/poster/%/preview.do', //海报预览
    posterTagAdd: host + '/admin/poster/%/tag/add.do', //海报添加标注
    posterTagUpdate: host + '/admin/poster/tag/%/update.do', //修改海报标注
    posterTagHidden: host + '/admin/poster/tag/%/hidden.do', //隐藏海报标注
    posterTagShow: host + '/admin/poster/tag/%/show.do', //显示海报标注
    utilQiniuToken: host + '/util/qiniu/token', //七牛token
    userPosterList: host + '/user/poster/list.do', //用户获取海报列表
    userPosterDetail: host + '/user/poster/%/detail.do', //用户获取海报详情
    userPosterDiv: host + '/user/poster/%/diy.do', //用户div
	adminPosterDiv: host + '/admin/poster/%/diy.do', //用户div


}
export default Rxports;
