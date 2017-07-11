<template>
	<div >
		<input @change="uploadImgae($event)"  id="upload"
		       style="display:none"
		       type="file" ></input>
		<div style="max-width:640px;margin:auto">

			<div class="ad" ><img @click="goto(poster.posterAdUrl)" :src="poster.posterAdImage" /></div>
			<div id="canvas">
				<div class="canvas" >
					<div class="layout "
					     v-for="(layout,index) in  layoutList"
					     :key="index" :style="layoutSizePosition(layout)"
					     v-if="layout.tag.tagType==='0'"
					     @click="selectImage(layout,index)"
					     >
						<div v-if="layout.tag.tagContent!=''" class="operator-box">
							<a href="javascript:" @click.stop="delLayout(layout)" title="刪除布局">x</a>
						</div>
						<div class="layout-content" style="text-align:center;padding-top:15px">
							<template v-if="layout.tag.tagContent===''">
                                    <i style="cursor:pointer;font-size:20px;margin-top:10px" class="el-icon-plus"></i>
							</template>

							<img v-if="layout.tag.tagContent!=''" style="max-width:100%;max-width:100%" :src="layout
							.tag.tagContent">
						</div>

					</div>

					<div class="layout "
					     v-for="(layout,index) in  layoutList"
					     :key="index" :style="layoutSizePosition(layout)"
					     v-if="layout.tag.tagType==='1'"
					>

						<div class="layout-content" style="text-align:left;padding-left:5px">
							<template v-if="layout.tag.tagType==='1'&&layout.tag.tagContent.indexOf(layout.tag
							.tagKeyword)>-1">
								{{layout.tag.tagContent.split(layout.tag.tagKeyword)[0]}}
									<el-input
									v-model="layout.tag.content" style="max-width:80px;height:28px" type="mini"
									:placeholder="layout.tag.tagKeyword"></el-input>
								{{layout.tag.tagContent.split(layout.tag.tagKeyword)[1]}}
							</template>

							<template v-if="layout.tag.tagType==='1'&&layout.tag.tagContent.indexOf(layout.tag
							.tagKeyword)===-1">
								{{layout.tag.tagContent}}
							</template>

						</div>

					</div>
				</div>
				<!--<img id="posterPreviewImage"  :src="poster.posterPreviewImage" />-->
			</div>
			<div>
				<br>
				<el-button type="primary" @click="save()">开始制作</el-button>

			</div>

		</div>

		<br>

	</div>
</template>
<style  >
	.layout .el-input .el-input__inner {
		height:28px;
	}
	.ad {

	}
   .ad img{
		width:100%;
	}
    a.tablelink{
        color:#337ab7;
    }
    .button-box {
        padding: 10px;
    }

    .button-box button {
        background: #2196F3;
        color: #fff;
        padding: 5px 10px;
        border: 0;
        border-radius: 4px;
    }

    .canvas {
        position: relative;
    }

    .layout {
        border: 1px solid #d7d8da;
        border-radius: 4px;
        margin-top: 4px;
        position: absolute;
        touch-action: none;
        background: #f2f2f2;


    }

     .layout  .layout-content{
		overflow: hidden;
        max-height: 100%;
     }
    .operator-box a{
    	float: right;
	    width: 15px;
	    height: 15px;
	    background: #9E9E9E;
	    text-align: center;
	    line-height: 10px;
	    border-radius: 20px;
	    margin-right: -4px;
	    margin-top: -4px;
	    color: #fff;
	    text-decoration: none;
	    font-size: 12px;
	    cursor: pointer;
    }
    .operator-box a:hover{
    	background: #FF5722;
    }
    .resizable-handle {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        bottom: 0;
        right: 0;
        cursor: nwse-resize;
    }

    .resizable-handle:after {
        content: "";
        position: absolute;
        width: 10px;
        height: 10px;
        bottom: 10px;
        right: 10px;
        border-bottom: 2px solid #c6c6c6;
        border-right: 2px solid #c6c6c6;
        border-bottom-right-radius: 2px;
        transition: opacity .2s;
        opacity: 1;
    }
</style>
<script>
import 'assets/js/global';
import Lib from 'assets/js/Lib';
import api from  'assets/js/api';
import { querystring } from 'vux'
//import Bmob from  'bmob';

    export default{

        data(){
             return {
                tagIndex:-1,
                ids:[],
                rmIds:[],
                query:querystring.parse(),
                token:null,
                uptokenUrl:api.utilQiniuToken,
                poster: {
                  posterName: '',
                  posterImage: '',
                  posterAdImage:'http://or9e69tre.bkt.clouddn.com/poster_ad_image0.jpg',
                  posterAdUrl:'http://u4458945.viewer.maka.im/pcviewer/TZLZYCER',
                  posterWidth: '',
                  posterHeight: ''
                },
                list:[],
                tagType:[
                    {
                        label:'文字',
                        value:'1'
                    },
                    {
                        label:'图片',
                        value:'0'
                    }
                ],
                fontSize:[],
                fontFamily:[
                '宋体',
                'Arial',
                'Tahoma',
                'Verdana',
                '微软雅黑',
                'San Francisco',
                'Times New Roman'
                ],
                tag:{
                    tagId: null,
                    tagType: '0',
                    tagLocationX: 0,
                    tagLocationY: 0,
                    tagWidth: 0,
                    tagHeight: 0,
                    tagColor: '#777',
                    tagContent: '',
                    tagKeyword: '',
                    tagFontSize: 12,
                    tagFontName: '微软雅黑',
                    tagPid: 1,
                    tagZindex: null,
                    tagHiddenStatus: 0
                },
                svg: {
                horizonNum: 40, //背景框个数
                verticalNum: 40, //背景框个数
                space: 5, //背景框间距,
                open: '',
                end: '',
                width: '',
                height: '',
                xmlns: 'http://www.w3.org/2000/svg'
            },
            position :{
                clientX:0,//鼠标拖动过程中x轴位置
                clientY:0,//鼠标拖动过程中y轴位置
                $clientX:0,//鼠标释放时x轴位置
                $clientY:0//鼠标释放时y轴位置
            },
            rect: {
                width: 0,
                height: 0,
                strokeWidth: 0.5,
                x: 0,
                y: 0
            },
            layout: { //最小布局块
                left: 0,
                tag: null,
                top: 0,
                offsetLeft: 0,
                offsetTop: 0,
                originOffsetLeft: 0,
                originOffsetTop: 0,
                col: 2,
                row: 2,
                originCol: 2,
                originRow: 2,
                width: 0,
                height: 0,
                ids: [],
                block: []
            },
            specify:true,
            layoutList: []

             };
        },
        mouted(){
            window.onresize = () => {
                //this.init();
            }
        },
        watch: {
            value(val) {
                this.showModal = val;
            },
            showModal(val) {
                if (val !== this.value) {
                    this.$emit('input', val);
                }
            },
            layoutList () {

            }
        },
        components:{

        },
        created() {
	        if(!this.query||!this.query.posterId){
	            this.query.posterId = 1;
	        }
            this.initBmob();
            this.getPoster();
			this.getList();

        },

        methods:{
			goto(url) {
				location.href = url;
			},
			getList() {
				$.ajax({
	                'url':api.userPosterList,
	                'success':(res)=>{
	                    if(res.code===200){
	                        this.$vux.loading.hide();
	                        this.list = res.data;
	                        for(let i=0;i<this.list.length;i++) {
	                            if(this.list[i].posterTagList){
		                            this.poster = this.list[i];
		                            this.getDetail(this.poster.posterId);
	                            return ;
	                            }
	                        }

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
			},
            renderList() {
                this.list = [];
                this.layoutList.forEach((layout,index)=>{
                    let tag = layout.tag||this.tag;
                    tag.tagLocationX = layout.offsetLeft;
                    tag.tagLocationY = layout.offsetTop;
                    tag.tagWidth = layout.col;
                    tag.tagHeight = layout.row;
                    tag.tagType +='';

                    this.list.push(JSON.parse(JSON.stringify(tag)));

                });
            },
            back() {
                location.href='/admin/posterList';
            },
            hideTag(tag) {
                tag.tagHiddenStatus = 1;
            },
            showTag(tag) {
                tag.tagHiddenStatus = 0;
            },
            delTag(index,tag) {
                this.list.splice(index,1);
                this.layoutList.splice(index,1);
                if(tag.tagId){
                    this.rmIds.push(tag.tagId)
                }
            },
            save() {

            //posterTagAdd
                this.$vux.loading.show({
                    text: '加载中...'
                });
                this.list = [];
                this.layoutList.forEach((layout)=>{
                    let tag = {};
                    tag.diyTid = layout.tag.tagId ;
                    tag.diyContent = layout.tag.tagContent;
                    if(layout.tag.tagType==='1'){
                        tag.diyContent = layout.tag.content;
                    }
                    this.list.push(JSON.parse(JSON.stringify(tag)));
                });

                this.list.forEach((tag)=>{

                    delete tag.content;
                });
                let data ={
                    data:JSON.stringify(this.list),
                    rmIds:this.rmIds.join(',')
                }
                if(data.rmIds===''){
                    delete data.rmIds;
                }
                console.log(JSON.stringify(data));

                $.ajax({
                    'url':api.userPosterDiv.replace('%',this.query.posterId),
                    'data':data,
                    'success':(res)=>{
                        if(res.code===200){
                            this.$message('提交成功!');
                            this.$vux.loading.hide();
							location.href = res.data;
                        }else{
                            alert(res.errMsg);
                            this.$vux.loading.hide();
                        }

                    },
                    'error':(error)=>{
                        alert('网络出错！');
                        this.$vux.loading.hide();
                    }
                });
            },
            initBmob(){
                Bmob.initialize("71435361b18a1b17e90d85e4834fa488", "c2009ad73e10d9c71f5545f191073834");
            },
            back() {
                location.href='/admin/posterList';
            },
            getPoster() {

                if(this.query.posterId){
                    this.$vux.loading.show({
                            text: '加载中...'
                    });
                    $.ajax({
                        'url':api.posterDetail.replace('%',this.query.posterId),
                        'success':(res)=>{

                            if(res.code===200){
                                this.poster = res.data;
                                this.poster.posterWidth += '';
                                this.poster.posterHeight += '';
                                //this.list =  this.poster.posterTagList;
                                this.layoutList = [];
                                res.data.posterTagList.forEach((tag)=>{
                                    this.ids.push(tag.tagId);
                                    let layout = JSON.parse(JSON.stringify(this.layout));
                                    layout.offsetLeft = tag.tagLocationX;
                                    layout.offsetTop = tag.tagLocationY;
                                    layout.col = tag.tagWidth;
                                    layout.row = tag.tagHeight;
                                    layout.tag = tag;
                                    this.layoutList.push(JSON.parse(JSON.stringify(layout)));
                                });
                                this.$vux.loading.hide();
                                this.init();
                            }else{
                                alert(res.errMsg);
                                this.$vux.loading.hide();
                            }
                        },
                        'error':(error)=>{
                            alert('网络出错');
                            this.$vux.loading.hide();
                        }
                    });
                }else{
                    alert('参数错误！');
                }
            },

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            selectImage(layout,tagIndex) {
                $('#upload').click();
                this.tagIndex = tagIndex;
            },
            uploadImgae(event) {
                var fileUploadControl = $('#upload')[0];
                if (fileUploadControl.files.length > 0) {
                    var fileObjs = fileUploadControl.files[0];
                    this.$vux.loading.show({
                            text: '文件上传中...'
                    });
                    var file = new Bmob.File(fileObjs.name, fileObjs);
                    //上传文件
                    file.save().then((obj)=> {
                        if (obj.url() == 'http://file.bmob.cn/undefined') {
                            this.uploadImgae();
                            return;
                        }

                       //http://service.find2i.com/api/emr/class/user/import.action?doctor_id=10954&url=&sc_class_id=111
                       this.layoutList[this.tagIndex].tag.tagContent = obj.url();
                       $('#upload').val('');
                       this.$vux.loading.hide();

                    }, (error)=> {
                        this.$vux.loading.hide();

                    });


                }
            },
             //初始化
            init() {
                $(document).ready(() => {

                    if (this.getScroll().scrollY) { //有垂直滚动条
                        //背景框宽度
                        //poster.posterPreviewImage
                        this.svg.width = $('.canvas').width() + this.getScrollbarWidth();
                    } else {
                        //背景框宽度
                        this.svg.width = $('.canvas').width();
                    }
                    //$('#canvas').css();
                    this.svg.height = Math.round(48 * this.svg.width / 1880); //背景框高度
                    this.svg.open = `<svg xmlns='${this.svg.xmlns}' width='${this.svg.width}' height='${this.svg.height}'>`;
                    this.svg.end = '</svg>';
                    this.initLayout();
                    this.initBackground();

                });
            },
            //获取滚动条宽度
            getScrollbarWidth() {
                let oP = document.createElement('p');
                const styles = {
                    width: '100px',
                    height: '100px',
                    overflowY: 'scroll'
                }
                let scrollbarWidth;

                for (let i in styles) {
                    oP.style[i] = styles[i];
                }

                document.body.appendChild(oP);
                scrollbarWidth = oP.offsetWidth - oP.clientWidth;
                oP.remove();
                return scrollbarWidth;
            },
            //获取滚动
            getScroll(el) {
                let elems = el ? [el] : [document.documentElement, document.body];
                let scrollX = false,
                    scrollY = false;
                for (let i = 0; i < elems.length; i++) {
                    let o = elems[i];
                    // test horizontal
                    let sl = o.scrollLeft;
                    o.scrollLeft += (sl > 0) ? -1 : 1;
                    o.scrollLeft !== sl && (scrollX = scrollX || true);
                    o.scrollLeft = sl;
                    // test vertical
                    let st = o.scrollTop;
                    o.scrollTop += (st > 0) ? -1 : 1;
                    o.scrollTop !== st && (scrollY = scrollY || true);
                    o.scrollTop = st;
                }
                // ret
                return {
                    scrollX: scrollX,
                    scrollY: scrollY
                };
            }, //初始化布局
            initLayout() {
                $(document).ready(() => {
                    const horizonNum = this.svg.horizonNum;
                    this.layoutList.forEach((layout) => {
                        const width = this.svg.width / horizonNum;
                        const height = this.svg.height;

                        layout.width = width * layout.col - layout.col ;
                        layout.height = height * layout.row  - layout.row;
                        layout.left = layout.offsetLeft * (width ) + this.svg.space;
                        layout.top = layout.offsetTop * (height );
                        layout.originCol = layout.col;
                        layout.originRow = layout.row;
                        layout.originOffsetLeft = layout.offsetLeft;
                        layout.originOffsetTop = layout.offsetTop;

                    });
                    this.renderList();

                });

            },
            //初始化背景
            initBackground() {
                $(document).ready(() => {
                    const height = this.poster.posterHeight*this.svg.width/this.poster.posterWidth;
                    const horizonNum = this.svg.horizonNum;
                    const verticalNum = parseInt(height/this.svg.height)+1;

                    //console.log("height:"+parseInt(height/this.svg.height));
                    let rectList = [];
                    for (let i = 0; i < verticalNum; i++) {
                        const x = (this.svg.width / horizonNum) * i + this.svg.space;
                        const width = (this.svg.width / horizonNum) - this.svg.space;
                        this.rect.x = x;
                        this.rect.y = this.svg.space;
                        this.rect.width = width;
                        this.rect.height = this.svg.height - this.svg.space;
                        let rect = encodeURI(`<rect stroke=\'#999\' stroke-width=\'${this.rect.strokeWidth}\' fill=\'none\' x=\'${this.rect.x}\' y=\'${this.rect.y}\' width=\'${this.rect.width}\' height=\'${this.rect.height}\'/>`);
                        rectList.push(rect);
                    }

                    //$('.canvas').css('background', `url(\"data:image/svg+xml;utf8,${this.svg.open}${rectList.join
                    //('')}${this.svg.end}\") 0px 0px /contain repeat-y`);
                    $('.canvas').css('height', `${(this.svg.height)*verticalNum-verticalNum}px`);
                    $("#posterPreviewImage").css('width',this.svg.width+'px');
                    $("#posterPreviewImage").css('height',`${(this.svg.height)*verticalNum-verticalNum}px`);
                    //$("#posterPreviewImage").css('margin-top',`-${(this.svg.height)*verticalNum-verticalNum}px`);
                    $('.canvas').css('background', `url(${this.poster.posterImage}) no-repeat`);
                    $('.canvas').css('background-size', `100% 100%`);
                });
            },
            plain(obj){
            	return JSON.parse(JSON.stringify(obj));
            },
            //添加布局
            addLayout() {
                //console.log('addLayout()');
	            let position = this.getEmptyPosition();
	            let layout = this.plain(this.layout);
	            if(position){
	                layout.offsetLeft = position.offsetLeft;
	                layout.offsetTop = position.offsetTop;
	                this.layoutList.push(layout);
	                this.initLayout();
	                this.initBackground();


	            }else {
	                this.svg.verticalNum += this.layout.row;
	                this.initLayout();
	                this.initBackground();
	                //console.error('没有可用坐标点');
	                this.addLayout();
	            }
	            this.specify = false;
            },
             //删除布局
	        delLayout(layout) {
				layout.tag.tagContent = '';
	        },
            //计算布局大小
            layoutSizePosition(layout) {
                return `width: ${layout.width}px;
                        height: ${layout.height}px;
                        top: ${layout.top}px;
                        left: ${layout.left}px;`;
            },
            //拖拽初始化
            drag(event, flag, layout) {
            	this.specify = false;
                this.dragStart(event, flag, layout);
                document.onmousemove = ($event) => {
                    this.dragOver($event);
                };
                document.onmouseup = ($event) => {
                    this.drop($event, flag, layout);
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            },
            //开始拖拽
            dragStart(event, flag, layout) {
				//console.log(event);
				this.specify = false;
                const index = this.layoutList.indexOf(layout);
                const canvas = $('.canvas');
                const curEl = canvas.find('.layout').eq(index);

                curEl.addClass('current');
                this.position.clientX = event.clientX;
                this.position.clientY = event.clientY;
                this.position.$clientX = event.clientX;
                this.position.$clientY = event.clientY;
                this.curLayout = layout;
                //this.layoutList[blgIndex] = this.layout;
                this.flag = flag;
            },
            //拖动中
            dragOver(event) {
                const offsetX = (event.clientX - this.position.clientX); //鼠标实时水平移动距离
                const offsetY = (event.clientY - this.position.clientY); //鼠标实时垂直移动距离

                let layout = this.curLayout;

                this.position.clientX = event.clientX;
                this.position.clientY = event.clientY;
                if (this.flag) { //拖动
                    layout.left = layout.left + offsetX;
                    layout.top = layout.top + offsetY;
                } else { //缩放
                    layout.width = layout.width + offsetX;
                    layout.height = layout.height + offsetY;
                }
            },
            //拖动结束
            drop(event, flag, layout) {

                const horizonNum = this.svg.horizonNum;
                const index = this.layoutList.indexOf(layout); //当前布局索引
                const width = this.rect.width; //格子宽度
                const height = this.rect.height; //格子高度
                const space = this.svg.space; //格子间距
                const $offsetX = (event.clientX - this.position.$clientX); //鼠标释放前水平移动距离
                const $offsetY = (event.clientY - this.position.$clientY); //鼠标释放前垂直移动距离
                const moveX = $offsetX % (width + space); //水平方向移动距离
                const stepX = parseInt($offsetX / (width + space)); //水平方向移动格子数量
                const moveY = $offsetY % (height + space); //垂直方向移动距离
                const stepY = parseInt($offsetY / (height + space)); //垂直方向移动格子数量
                $(".layout").removeClass('current'); //移除拖拽放大样式
                //边界及碰撞检测
                if (!this.impactDetect(index) && !this.boundaryDetect(layout)) {
                    if (this.flag) { //拖动
                        layout.offsetLeft = layout.originOffsetLeft + stepX + Math.round((moveX - space) / width);
                        layout.offsetTop = layout.originOffsetTop + stepY + Math.round((moveY - space) / height);
                        if (layout.offsetLeft < 0 || (layout.offsetLeft + layout.col) > horizonNum) {
                            layout.offsetLeft = layout.originOffsetLeft;
                        }
                        if (layout.offsetTop < 0) {
                            layout.offsetTop = layout.originOffsetTop;
                        }
                        this.calculatBackground(layout);
                    } else { //放大
                        layout.col = layout.originCol + stepX + Math.round((moveX - space) / width);
                        layout.row = layout.originRow + stepY + Math.round((moveY - space) / height);
                        if (layout.col < this.layout.col || (layout.offsetLeft + layout.col) > horizonNum) {
                            layout.col = layout.originCol;
                        }
                        if (layout.row < this.layout.row) {
                            layout.row = layout.originRow;
                        }
                        this.calculatBackground(layout);

                    }

                    this.position.clientX = event.clientX;
                    this.position.clientY = event.clientY;
                    this.position.$clientX = event.clientX;
                    this.position.$clientY = event.clientY;
                } else {
                    layout.col = layout.originCol;
                    layout.row = layout.originRow;
                    layout.offsetLeft = layout.originOffsetLeft;
                    layout.offsetTop = layout.originOffsetTop;
                }
                this.initLayout();
                this.specify = true;
                //this.boundaryDetect(layout);

            },
            //重新计算背景
	        calculatBackground(layout) {
	            let verticalNum = this.getVerticalNum();
				//console.log("verticalNum:"+verticalNum);
				//console.log("this.layout.row:"+this.layout.row);
	            if(layout.offsetTop+layout.row>=verticalNum){
	                verticalNum += this.layout.row;
	            }else if(layout.offsetTop+layout.row+this.layout.row<verticalNum){

	                if(verticalNum>this.svg.verticalNum){
	                    verticalNum = verticalNum - this.layout.row;
	                }
	            }

	            this.svg.verticalNum = verticalNum;
	            this.initBackground();
	            this.initLayout();
	        },
	        //获取最大画布高度
	        getVerticalNum() {
	            let verticalNum = this.svg.verticalNum;
	            //console.log("verticalNum:"+verticalNum);
	            this.layoutList.forEach((layout)=>{
	            	//console.log(layout.offsetTop+layout.row);
	                if(verticalNum<(layout.offsetTop+layout.row)){
	                    verticalNum = layout.offsetTop+layout.row
	                }
	            });
				//console.log("verticalNum:"+verticalNum);
	            /*if(verticalNum>=(this.svg.verticalNum-this.layout.row)){
	                verticalNum += this.layout.row;
	            }*/
	            if(this.specify){
	                if(verticalNum<(this.layout.offsetTop+this.layout.row)){
	                    verticalNum = this.layout.offsetTop+this.layout.row
	                }
	            }

	            return verticalNum;
	        },
            specifyPosition(event) { //会产生位置误差
                console.log('specifyPosition()');
                let flag = true;
                let layout = this.plain(this.layout);

                const width = this.rect.width; //格子宽度
                const height = this.rect.height; //格子高度
                const space = this.svg.space; //格子宽度
                const offsetX = event.offsetX;
                const offsetY = event.offsetY;
                const stepX = parseInt(offsetX / (width + space)); //水平方向移动格子数量
                const stepY = parseInt(offsetY / (height + space - 1)); //水平方向移动格子数量

                let occupyPosition = this.getOccupyPosition();
                let allPosition = this.getAllPosition();

                layout.offsetLeft = stepX;
                layout.offsetTop = stepY;

                let curPosition = this.getCurPosition(layout);
                let temp = {
                    offsetLeft: stepX,
                    offsetTop: stepY
                }

                temp = JSON.stringify(temp);

                if (allPosition.indexOf(temp) > -1) {
                    if (this.arrayIntersect(occupyPosition, curPosition)) {
                        flag = false;
                    }
                } else {
                    flag = false;
                }
                if (flag&&this.specify) {
                    this.layout = layout;
                    this.layoutList.push(layout);
                    this.initLayout();
                    this.initBackground();

                }
            },
            //获取获取画布第一个符合要求的坐标
            getEmptyPosition() {
                const $this = this;

                let position = {
                    offsetLeft: 0,
                    offsetTop: 0
                }
                let occupyPosition = this.getOccupyPosition();
                let allPosition = this.getAllPosition();

                for (let i = 0; i < allPosition.length; i++) {
                    let pos = allPosition[i];
                    if (occupyPosition.indexOf(pos) === -1) {
                        let curPosition = $this.getCurPosition(JSON.parse(pos));
                        if (!this.arrayIntersect(occupyPosition, curPosition)) {
                            position = pos;
                            return JSON.parse(position);
                        }
                    }
                }
            },
            //判断两个数组是否有交集
	        arrayIntersect(a,b) {
	            let include =false;

	            a.forEach((aItem)=>{
	                b.forEach((bItem)=>{
	                    if(a.includes(bItem)){
	                        include = true;
	                    }
	                });
	            });

	            return include;
	        },
            //根据左上角坐标获取布局所有坐标
            getCurPosition(pos) {
                const $this = this;

                let position = [];

                for (let y = 0; y < $this.layout.row; y++) {
                    for (let x = 0; x < $this.layout.col; x++) {
                        let pop = {};
                        pop.offsetLeft = pos.offsetLeft + x;
                        pop.offsetTop = pos.offsetTop + y;
                        position.push(JSON.stringify(pop));
                    }
                }

                return position;
            },
            //获取整个画布所有可用坐标点
            getAllPosition() {
                const $this = this;

                let position = [];
                for (let y = 0; y < this.svg.verticalNum; y++) {
                    for (let x = 0; x < this.svg.horizonNum; x++) {
                        if ((x + $this.layout.col) <= this.svg.horizonNum && (y + $this.layout.row) <= this.svg.verticalNum) {
                            let pop = {};
                            pop.offsetLeft = x;
                            pop.offsetTop = y;
                            position.push(JSON.stringify(pop));
                        }
                    }
                }

                return position;
            },
            //获取已经被占用的坐标
            getOccupyPosition() {
                let position = [];

                this.layoutList.forEach((layout) => {
                    for (let x = 0; x < layout.col; x++) {
                        for (let y = 0; y < layout.row; y++) {
                            let pop = {}
                            pop.offsetLeft = layout.offsetLeft + x;
                            pop.offsetTop = layout.offsetTop + y;
                            position.push(JSON.stringify(pop));
                        }
                    }
                });

                return position;
            },
            //边界检测
            boundaryDetect(layout) {
                let boundary = false;

                const horizonNum = this.svg.horizonNum;
                const verticalNum = this.svg.verticalNum;

                if (layout.offsetTop < 0 || layout.offsetLeft < 0) {
                    //console.warn("超出边界了");
                    boundary = true;
                }

                if (layout.offsetLeft + layout.col > horizonNum) {
                    //console.warn("超出边界了");
                    boundary = true;
                }
                if (layout.offsetTop + layout.row > verticalNum) {
                    boundary = true;
                }

                return boundary;
            },
            //检测当前移动或者拖拽布局是否与其他布局重叠
            impactDetect(index) {
                const canvasEl = $('.canvas');
                const el1 = canvasEl.find('.layout').eq(index);
                const $this = this;

                let impact = false;

                for (let i = 0; i < canvasEl.find('.layout').length; i++) {
                    if (index !== i) {
                        const el2 = canvasEl.find('.layout').eq(i);
                        if ($this.touchDetect(el1, el2, index, i).impact) {
                            impact = true;
                        }
                    }
                }

                return impact;
            },
            //两个元素碰撞检测
            touchDetect(el1, el2, index1, index2) {
                let touch = {};

                const t1 = el1.offset().top;
                const l1 = el1.offset().left;
                const r1 = el1.offset().left + el1.width();
                const b1 = el1.offset().top + el1.height();

                const t2 = el2.offset().top;
                const l2 = el2.offset().left;
                const r2 = el2.offset().left + el2.width();
                const b2 = el2.offset().top + el2.height();

                if (b1 < t2 || l1 > r2 || t1 > b2 || r1 < l2) { // 表示没碰上
                    //console.log("恭喜您，没碰上b!");
                    touch.impact = false;
                    touch.index1 = index1;
                    touch.index2 = index2;
                } else {
                    touch.impact = true;
                    touch.index1 = index1;
                    touch.index2 = index2;
                    //console.warn(`layout${index1}和layout${index2}碰上了。。。。。。。。`);
                }

                return touch;
            }
        }
    }

</script>
