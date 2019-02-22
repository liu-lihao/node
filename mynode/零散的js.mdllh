# Array.prototype.reduce()

一直听说`reduce()`很难，今天搞定它~

```
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
```
//求和（求积同理）
var arr = [1, 3, 5, 7, 9];
arr.reduce((prev,cur)=>{
  return prev + cur
}); // 25
```
```
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

```
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
```
  window.addEventListener('hashchange', e => {
    //这里加上判断，并可以通过动态加载js实现按需加载js。
  }, false);
```
按需加载js:
   ```
document.body.appendChild(document.createElement("script")).src="test-router.js";
```