

## 前言
众所周知vue带打包时会将文件单独打包到dist文件夹下，这会导致页面第一次加载的时候速度慢的离谱，主要原因就是页面的资源还在请求和下载，

<font style="color:#404040;"></font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574145791135-7369db2e-730f-4f57-9698-84bc20786f6b.png)



<font style="color:#404040;">先挂载到服务器上试试</font>

<font style="color:#404040;"></font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574145818314-3c4221d6-6935-40ca-8d79-41d4d82b5ef2.png)



<font style="color:#404040;">首屏页面整整加载了 9s 光加载那个大文件就花了 8s</font>

<font style="color:#404040;">这必须得做个优化了，没有用户能忍受 9s的白屏而不关闭页面的</font>





## 分析
**<font style="color:#FA541C;">vuecli 2.x</font>**<font style="color:#404040;">自带了分析工具,只要运行 </font>



```shell
npm run build --report
```





<font style="color:#404040;">如果是</font>** ****<font style="color:#FA541C;">vuecli 3</font>**<font style="color:#404040;">的话，先安装插件                 </font>



```shell
npm intall webpack-bundle-analyzer –save-dev
```





<font style="color:#404040;">然后在</font>** ****<font style="color:#FA541C;">vue.config.js</font>**** **<font style="color:#404040;">中对 webpack 进行配置</font>



```javascript
chainWebpack: config => {
  /* 添加分析工具*/
  if (process.env.NODE_ENV === "production") {
    if (process.env.npm_config_report) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)
        .end();
      config.plugins.delete("prefetch");
    }
  }
};
```



<font style="color:#404040;">再运行 </font>



```shell
npm run build --report
```



<font style="color:#404040;">会在浏览器打开一个项目打包的情况图，便于直观地比较各个 bundle文件的大小</font>

<font style="color:#404040;"></font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146202239-18f7dd09-11ee-4d5c-83c8-dc34236b32b8.png)



<font style="color:#404040;">可以看到 项目中所有的依赖，所有的路由，都被打包进了同一个文件中</font>

<font style="color:#404040;">另外，在浏览器中，也可以通过 </font>**<font style="color:#F5222D;">converge</font>**<font style="color:#404040;">来查看代码的使用状况</font>

<font style="color:#404040;"></font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146239510-44eaf94d-f44c-489d-bdfb-b40af5b2096a.png)

<font style="color:#404040;">红色的是下载了但未使用的部分</font>



## 路由懒加载
<font style="color:#404040;">当打包构建应用时，JavaScript包会变得非常大，影响页面加载。</font>

<font style="color:#404040;">如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。</font>

<font style="color:#404040;">在一开始就下载完所有路由对应的组件文件，这明显是不合适的，这就像下载一个 app 了，所以我们就需要使用路由懒加载</font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146283809-0952913a-aeef-4518-8976-ad6e12882887.png)



<font style="color:#404040;">在 router.js文件中，原来的静态引用方式</font>



```javascript
import ShowBlogs from '@/components/ShowBlogs'

routes:[ path: 'Blogs', name: 'ShowBlogs', component: ShowBlogs ]
```



<font style="color:#404040;">改为</font>



```javascript
routes:[ path: 'Blogs',name: 'ShowBlogs',component: () => import('./components/ShowBlogs.vue')
```



<font style="color:#404040;">以函数的形式动态引入，这样就可以把各自的路由文件分别打包，只有在解析给定的路由时，才会下载路由组件</font>

<font style="color:#404040;"></font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146342322-64759e61-d239-40cf-bd46-258c359c30ea.png)



<font style="color:#404040;">首屏需要加载的文件变成了橙色的部分，被小弟们分流出去了 300k</font>



<font style="color:#404040;">如果是在 vuecli 3 中，我们还需要多做一步工作，因为 vuecli 3 默认开启 </font>**<font style="color:#F5222D;">prefetch</font>**<font style="color:#404040;"> (预先加载模块)，提前获取用户未来可能会访问的内容，在首屏会把这十几个路由文件，都一口气下载了，所以我们要关闭这个功能，在 </font>**<font style="color:#F5222D;">vue.config.js</font>**<font style="color:#404040;"> 中设置</font>



**参考官网的做法：**



```javascript
// vue.config.js
module.exports = {
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')

    // 或者
    // 修改它的选项：
    config.plugin('prefetch').tap(options => {
      options[0].fileBlacklist = options[0].fileBlacklist || []
      options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
      return options
    })
  }
}
```





<font style="color:#404040;">当 </font>**<font style="color:#F5222D;">prefetch</font>**<font style="color:#404040;"> 插件被禁用时，你可以通过 webpack 的内联注释手动选定要提前获取的代码区块：</font>



```javascript
import(/* webpackPrefetch: true */ './someAsyncComponent.vue')
```



<font style="color:#404040;">设置完毕后，首屏就只会加载当前页面路由的组件了</font>



## UI库按需加载
****

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146423445-f1f0ea40-26d1-4248-b6f4-2d40653babba.png)



<font style="color:#404040;">首屏需要加载的依赖包，其中 </font>**<font style="color:#404040;">element-ui</font>**<font style="color:#404040;"> 整整占了 568k</font>

<font style="color:#404040;">原本的引进方式引进了整个包：</font>



```javascript
import ElementUI from 'element-ui'
Vue.use(ElementUI)
```



<font style="color:#404040;">但实际上我用到的组件只有按钮，分页，表格，输入与警告</font>

<font style="color:#404040;">所以我们要按需引用：</font>



```javascript
import { Button, Input, Pagination, Table, TableColumn, MessageBox } from 'element-ui';
Vue.use(Button)
Vue.use(Input)
Vue.use(Pagination)
Vue.prototype.$alert = MessageBox.alert
```



<font style="color:#404040;">注意 MessageBox 注册方法的区别，并且我们虽然用到了 alert，但并不需要引入 Alert 组件</font>

<font style="color:#404040;">在</font>**<font style="color:#F5222D;"> .babelrc</font>**<font style="color:#404040;">文件中添加（ vue-cli 3 要先安装 </font>**<font style="color:#F5222D;">babel-plugin-component </font>**<font style="color:#404040;">)：</font>



```javascript
plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
```



![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146553564-073c8931-142c-4144-a1a3-81f7e9bf06e3.png)



<font style="color:#404040;">element-ui 小了很多，不过看到那个显眼的 table.js 后想到， table组件只有后台管理页面用到了，不需要全局注册，所以我们删除 main.js 中 Table和 TablColumn 的引用，并在后台组件中局部注册</font>



```javascript
import { Table, TableColumn } from "element-ui";

components: {
    "el-table": Table,
    "el-table-column": TableColumn }
```



![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146592995-ac617014-dd72-4d9a-b609-c1d6f307b949.png)



<font style="color:#404040;">table就被拆分到了路由文件中，组件重复打包，可以看到上图，有两个路由文件都引用了 codemirror.js造成重复下载</font>



<font style="color:#404040;">我们可以在 webpack 的 config 文件中，修改 </font>**<font style="color:#F5222D;">CommonsChunkPlugin</font>**<font style="color:#404040;"> 的配置</font>



```javascript
minChunks: 3
```



<font style="color:#404040;">把3改为2，就会把使用2次及以上的包抽离出来，放进公共依赖文件，不过由于首页也有复用的组件，所以首页也会下载这个公共依赖文件</font>

<font style="color:#404040;"></font>

![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146643662-dd29ca12-8d60-48cc-ac2f-4f04e7243f30.png)



<font style="color:#404040;">首页下载了黄色和灰色部分</font>

<font style="color:#404040;">拆了半天，又回到原点</font>

<font style="color:#404040;">当然，我们可以继续折腾 </font>**<font style="color:#F5222D;">CommonsChunkPlugin</font>**<font style="color:#404040;"> 的配置来解决这个问题</font>

<font style="color:#404040;">但在新版 webpack中， </font>**<font style="color:#F5222D;">CommonsChunkPlugin</font>**<font style="color:#404040;"> 被自由度更高，更高级的 SplitChunksPlugin 代替</font>

<font style="color:#404040;">这也是为什么我要把项目迁移到 </font>**<font style="color:#F5222D;">vuecli 3（使用 webpack4）</font>**

<font style="color:#404040;">默认就做了优化，首页只会下载灰色的部分（ 235K）</font>



## gzip
<font style="color:#404040;">拆完包之后，我们再用 gzip做一下压缩</font>



<font style="color:#404040;">安装 </font>**<font style="color:#F5222D;">compression-webpack-plugin</font>**



```shell
npm i compression-webpack-plugin -D
```





<font style="color:#404040;">在 </font>**<font style="color:#F5222D;">vue.config.js</font>**** **<font style="color:#404040;">中引入并修改 webpack 配置</font>



```javascript
const CompressionPlugin = require('compression-webpack-plugin')

configureWebpack: config => {
  if (process.env.NODE_ENV === "production") {
    // 为生产环境修改配置...
    config.mode = "production";
    return {
      plugins: [
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, //匹配文件名
          threshold: 10240, //对超过10k的数据进行压缩
          deleteOriginalAssets: false //是否删除原文件
        })
      ]
    };
  }
};
```





![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146775296-37b961f2-20c8-47a5-aae4-13ecd8450bf8.png)



<font style="color:#404040;">可以看到 200k以上的文件被压缩到了 100k以内</font>

<font style="color:#404040;">在服务器我们也要做相应的配置</font>

<font style="color:#404040;">如果发送请求的浏览器支持 </font>**gzip**<font style="color:#404040;">，就发送给它 gzip格式的文件</font>

<font style="color:#404040;">我的服务器是用 express 框架搭建的</font>



<font style="color:#404040;">只要安装一下</font>** ****<font style="color:#F5222D;">compression</font>**** **<font style="color:#404040;">就能使用</font>



```javascript
const compression = require('compression')
app.use(compression())
```



<font style="color:#404040;">注意，后面这一句，要放在所有其他中间件注册之前</font>



## 最终效果


![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146817318-763b469e-3a95-4bab-8b81-50439544f5fd.png)

<font style="color:#404040;">首屏加载资源198k，加载时间1s，相比原来速度提升了90%</font>



## 后记：css是否要拆分
<font style="color:#404040;">vuecli 3和 vuecli2.x还有一个区别是</font>

<font style="color:#404040;">vuecli 3会默认开启一个 css分离插件 </font>**<font style="color:#F5222D;">ExtractTextPlugin</font>**

<font style="color:#404040;">每一个模块的 css文件都会分离出来，整整13个 css文件，而我们的首页就请求了4个，花费了不少的资源请求时间</font>

<font style="color:#404040;"></font>

<font style="color:#404040;">我们可以在 </font>**<font style="color:#F5222D;">vue.config.js</font>**<font style="color:#404040;"> 中关闭它</font>



```javascript
 css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: false,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
},
```





![](//cdn.nlark.com/yuque/0/2019/png/583553/1574146872432-23a085bd-d353-40ae-a8e6-3e9310a4ceb3.png)



<font style="color:#404040;">打包出来的文件中，直接就没有了 css 文件夹</font>

<font style="color:#404040;">取而代之的是整合起来的一个 js文件，负责在一开始就注入所有的样式</font>

<font style="color:#404040;">首屏加载文件数减少，但体积变大，最终测下来速度没有太大差异</font>

<font style="color:#404040;">所以，是否要css拆分就见仁见智，具体项目具体分析吧</font>



## 总结
<font style="color:#404040;">性能优化是一个非常令人愉悦的过程，同时也是个深坑，有着太多东西，本篇文章开了个头，希望能对大家有所帮助</font>

