# 利豪工具集合

## 图片转base64

```
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
//使用方法：
imgToBese64('https://xxx.png').then(res=>{
    console.log(res);//获得结果
})
```
---
## Ajax

```
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
}
//使用方法：
ajax('GET/POST','接口','参数').then(res=>{
    console.log(res);//获得成功结果
}).catch(res=>{
    console.log(res);//获得失败结果
})
```
---