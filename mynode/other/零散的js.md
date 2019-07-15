# Array.prototype.reduce()

一直听说`reduce()`很难，今天搞定它~

```javascript
const arr = ['天','安','门'];
const result = arr.reduce((prev,cur,index,array)=>{
  console.log('出现次数');//只出现2次。
  return `←${prev}${cur}→`;
});
console.log(arr,result);//["天", "安", "门"] "←←天安→门→"
```
- 分析：
   1. 从数组的第二项开始迭代（**第一项不会调用函数**）
   2. 第二项调用函数的返回值为：`←天安→`
   3. 将第二项的返回值作为函数第一个参数`prev` ，传递给 数组的第三项。
   4. 第三项调用函数的返回值为：`←` `←天安→` `门→`，其中`←天安→`：为第上一项的函数返回值。
   5. 得到结果。
   6. ps:reduceRight()的结果仅仅是将arr.reverse()。

## 运用实例
```javascript
//求和（求积同理）
var arr = [1, 3, 5, 7, 9];
arr.reduce((prev,cur)=>{
  return prev + cur
}); // 25
```
```javascript
//等同于Array.prototype.join(',')
const arr = ['天','安','门'];
const result = arr.reduce((prev,cur,index,array)=>{
  return `${prev},${cur}`;
});
const result2 = arr.join(',');
console.log(result,result2);//天,安,门 天,安,门
```
---
# 同一浏览器实现多个标签页通信

最优方式：使用`localStorage`，监听`storage`。

```javascript
  window.addEventListener('storage', e => {
    console.log(e);
  }, false);
```
- 触发条件:
   1. `localStorage`发生变化(`sessionStorage`无效)。
   2. `localStorage.clear()`，若本身为空，则不会触发。
   3. 同一个html不会触发，需在服务器上不同的html，即域名、端口、协议相同的不同页面。

---

# hash路由的实现

原理：url中`#`号及其后面的内容不会作为有效网址，并且当#号及其后面内容发生改变是会触发`hashchange`事件。
```javascript
  window.addEventListener('hashchange', e => {
    //这里加上判断，并可以通过动态加载js实现按需加载js。
  }, false);
```
按需加载js:
```javascript
document.body.appendChild(document.createElement("script")).src="test-router.js";
```
---

# Promise

简单地说Promise就是个能异步执行的对象。

```javascript
//典型例子
const promise = new Promise((ok,no)=>{
  if(true){
    ok('得到的结果');
  }else if(false){
    no('失败的结果');
  }
});
promise.then(res=>{
  console.log(res);//得到的结果
}).catch(res){
  console.log(res);//失败的结果
}
```

## Promise.all / Promise.race

all：全部 / race：竞争

```javascript
const promise_a = new Promise( ok =>{ 
  //复杂计算 需要2s
  ok('a') 
});
const promise_b = new Promise( ok =>{
  //复杂计算 需要1.5s
  ok('b')
});
//all 当我们需要同时获得a和b的结果，以便计算或比较时，使用all
Promise.all([promise_a,promise_b]).then(res=>{
  //会等待全部promise执行完后
  //耗时2s
  console.log(res);//['a','b'],res以数组的方式按照顺序
});
//race 当我们只需要最快那个的结果时，使用race
Promise.race([promise_a,promise_b]).then(res=>{
  //只要有任意一个promise执行完，其他的仍在继续执行，但执行结果将被丢弃。
  //耗时1.5s
  console.log(res);//'b',仅会得到一个最快的结果。
});
```
## 串行
(x+x) * 2  
```javascript
// 0.5秒后返回input*input的计算结果:
function multiply(input) {
    return new Promise(function (ok, no) {
        log('calculating ' + input + ' x ' + input + '...');
        setTimeout(ok, 500, input * input);
    });
}

// 0.5秒后返回input+input的计算结果:
function add(input) {
    return new Promise(function (ok, no) {
        log('calculating ' + input + ' + ' + input + '...');
        setTimeout(ok, 500, input + input);
    });
}

var p = new Promise(function (ok, no) {
    log('start new Promise...');
    ok(123);
});

p.then(multiply)
 .then(add)
 .then(multiply)
 .then(add)
 .then(function (result) {
    log('Got value: ' + result);
});
// start new Promise...
// calculating 123 x 123...
// calculating 15129 + 15129...
// calculating 30258 x 30258...
// calculating 915546564 + 915546564...
// Got value: 1831093128
```

# Array.sort()

一直以为它的作用仅仅是纯数字数组排序，直到最近才发现我错了，原来它对不太多的各种数据排序都很方便。

- 默认情况：
 1. 默认排序规则：字符串方式
 2. 默认排序顺序：递增
 3. Demo：
    ```javascript
    [2,6,4,10].sort(); //  [10, 2, 4, 6]
    ```
- 传入比较函数：
 1. 比较函数：
    ```javascript
    function compare (value1,value2){//递增排序
      if(value1 < value2) return -1;
      if(value1 > value2) return 1;
      return 0;
      //如果希望小的数字在左边(arr[0]最小),则对value1来说，小的话要放到左边去，返回<0的数。
      //如果希望大的数字在左边(arr[0]最大),则对value1来说，小的话要放到右边去，返回>0的数。
      //相等的话返回0。
      //总的来说：两个参数比较，随便返回-1/1，0不用管，不是想要的顺序就换了一下-1/1就行了。
    }
    ```
 2. Demo：
    ```javascript
    let arr2 = [{"num":2},{"num":6},{"num":4},{"num":10}];
    arr2.sort((v1,v2) =>v1.num - v2.num);
    console.log(arr2);//[{"num":2},{"num":4},{"num":6},{"num":10}]
    ```
