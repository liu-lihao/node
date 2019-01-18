function c() {
    console.log.apply(this, arguments);
};
Vue.component("footerr", {
    template: `<div class="footerr" @click="returnToList">
利豪所有<br>{{this.footerrContent}}
</div>`,
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
var box = new Vue({
    el: "#box",
    data: {
        filename: [],
        target: '',
        touchflag: null,
        blackflag: false,
        blackcontent: '',
        losContentFlag: false,
        losContent:''
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
                ajax.send();
            });
        },
        addlos(index) {
            const temp = this.filename[index].title;
            this.ajax('get',this.target + temp).then((res) =>{
                localStorage.setItem(temp,res);
                this.filename[index].islos = true;
            }).catch( (res)=>{
                console.log(res);
            } );
        },
        spanlongpress(el){
            const index = el.getAttribute('spanlongpress');
            const temp = this.filename[index].title;
            if(/[\.txt]{1}$/.test(temp)){
                this.addlos(index);
                if(localStorage.getItem('firstlos') == null){
                    localStorage.setItem('firstlos',false);
                    this.appearBlack('再次点击一下，清除缓存~');
                };
            }else {
                this.appearBlack('不建议并拒绝缓存非txt文件');
            }
        },
        spanclick(index){
            const temp = this.filename[index].title;
            if(localStorage.getItem(temp) != null){
                localStorage.removeItem(temp);
                this.filename[index].islos = false;
            }else {
                this.appearBlack('长按左边序号进行缓存哦(目前仅支持txt)');
            }
        },
        headertest(){
            console.log(localStorage);
        },
        handlerA(obj){
            const temp = this.filename[obj.index].title;
            if(obj.islos){
                this.losContent = localStorage.getItem(temp);
                this.losContentFlag = true;
                if(localStorage.getItem('firstlosc') == null){
                    localStorage.setItem('firstlosc',false);
                    this.appearBlack('点击底部返回~');
                };
            }else {
                window.open(this.target + temp);
            }
        },
        returntolist(){
            this.losContentFlag = false;
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