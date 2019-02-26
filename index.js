function c() {
    console.log.apply(this, arguments);
};
Vue.component("footerr", {
    template: `<div class="footerr" @click="returnToList">利豪所有<br>{{this.footerrContent}}</div>`,
    props:['losContentFlag'],
    computed:{
        footerrContent(){
            if(this.losContentFlag){
                return '点我返回'
            }
            return '但转载别说是我的，毕竟菜。'
        }
    },
    methods: {
        returnToList(){
            if(this.losContentFlag){
                this.$emit('returntolist');
            }
        }
    }
});
const box = new Vue({
    el: "#box",
    data: {
        filename: [],//所有文件名(解析index.html上面的字符串)
        target: '',//跳转路径
        blackflag: false,//黑色遮罩flag
        blackcontent: '',//黑色内容
        losContentFlag: false,//显示缓存flag
        losContent:'',//缓存内容
        img_flag:false,//缓存图片flag
        md_flag : false,//md格式文件flag
        allow_word : ['txt','md'],//允许的文字格式
        allow_img : ['png','webp','jpg','gif','bmp','jpeg']//允许的图片格式
    },
    components: {
        headerr: {
            template: `<div class='headerr'>利豪的笔记</div>`
        },
    },
    methods: {
        alongpress(el){
            this.appearBlack(this.filename[el.getAttribute('alongpress')].title);
        },
        appearBlack(string){
            this.blackcontent = string;
            this.blackflag = true;
        },
        handleBlack() {
            this.blackflag = false;
        },
        ajax(method,url,content) {
            let ajax = new XMLHttpRequest();
            return new Promise( (resolve, reject) => {
                ajax.onreadystatechange = function () {
                    if( ajax.readyState == 4){
                        if( ajax.status == 200) {
                            resolve(ajax.responseText);
                        }else {
                            reject(ajax.status);
                        }
                    }
                };
                ajax.open(method,url);
                ajax.send(content);
            });
        },
        addlos(index) {
            const temp = this.filename[index].title;
            if(this.checkFileNameType(temp)=="img"){
                this.imgToBese64(this.target + temp).then(res=>{
                    localStorage.setItem(temp,res);
                    this.filename[index].islos = true;
                });
            }else {
                this.ajax('get',this.target + temp).then((res) =>{
                    localStorage.setItem(temp,res);
                    this.filename[index].islos = true;
                }).catch( (res)=>{
                    console.log(res);
                });
            }
        },
        spanlongpress(el){
            const index = el.getAttribute('spanlongpress');
            const temp = this.filename[index].title;
            if(this.checkFileNameType(temp)){
                this.addlos(index);
                if(localStorage.getItem('firstlos') == null){
                    localStorage.setItem('firstlos',false);
                    this.appearBlack('再次点击一下，清除缓存~');
                };
            }else{
                this.appearBlack('不建议并拒绝缓存非txt/md/图片文件');
            }
        },
        spanclick(index){
            const temp = this.filename[index].title;
            if(localStorage.getItem(temp) != null){
                localStorage.removeItem(temp);
                this.filename[index].islos = false;
            }else {
                this.appearBlack('长按左边序号进行缓存哦(目前仅支持txt/md/图片)');
            }
        },
        handlerA(obj){
            const temp = this.filename[obj.index].title;
            if(obj.islos){
                //如果缓存了
                if(/\.md$/.test(temp)){
                    this.md_flag = true;
                    this.losContent = marked(localStorage.getItem(temp));
                }else if(this.checkFileNameType(temp) == "img"){
                    //如果该文件类型是图片
                    this.img_flag = true;
                    this.losContent = localStorage.getItem(temp);
                }else {
                    this.losContent = localStorage.getItem(temp).replace(/\n|\r\n/g,"<br/>");
                }
                this.losContentFlag = true;
                if(localStorage.getItem('firstlosc') == null){
                    localStorage.setItem('firstlosc',false);
                    this.appearBlack('点击底部返回~');
                };
            }else {
                //没缓存就跳转
                window.open(this.target + temp);
            }
        },
        returntolist(){
            //初始化内容
            this.losContentFlag=false;
            this.losContent='';
            this.img_flag=false;
            this.md_flag = false;
        },
        checkFileNameType(temp){
            //返回 true (txt/md)、 img(图片格式) 、 false（双非）
            const lowercase_type = /.(\w+)$/.exec(temp)[1].toLocaleLowerCase();
            let allow_flag = false; 
            this.allow_word.forEach(item=>{
                if( item.toLocaleLowerCase() == lowercase_type){
                    allow_flag = true;
                }
            });
            if(!allow_flag){
                this.allow_img.forEach(item=>{
                    if( item.toLocaleLowerCase() == lowercase_type){
                        allow_flag = 'img';
                    }
                });
            }
            return allow_flag;
        },
        imgToBese64(url){
            let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            img = new Image;
            img.crossOrigin = 'Anonymous';
            img.src = url;
            return new Promise(ok=>{
                img.onload = function(){
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img,0,0);
                    const dataURL = canvas.toDataURL('image/png');
                    ok(dataURL);
                    canvas = null;
                };
            })
        }
    },
    created() {
        this.target = mynode.default.target;
        mynode.data.split("\n").forEach((item, index) => {
            let temp = item.split('	')[0];
            if (temp.length >= 1 && !(/^\s*$/.test(temp))) this.filename.push({title:temp,islos:false});
        });
        this.filename = this.filename.map((item,index)=>{
            item['index'] = index;
            for(let key in localStorage){
                if(item.title == key){
                    item.islos = true;
                }
            }
            return item
        });
    },
    mounted(){
        if(localStorage.getItem('firstopen') == null){
            localStorage.setItem('firstopen',false);
            this.appearBlack('长按序号可以缓存哦');
        };
    }
});

// 执行标准
// this.filename = [
//     {
//         title: 'filename',
//         islos: false
//     }
// ]
// 存储格式
// localStorage.setItem('filename','content')
// firstopen: true  =>提醒长按序号
// firstlosc: true	=>提醒底部点击返回
// firstlos: true	=>提醒单击序号取消缓存