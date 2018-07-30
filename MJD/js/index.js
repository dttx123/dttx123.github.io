window.onload = function () {
    //1-倒计时
    downTime();
    //2-头部滚动变色
    header();
    //3-京东快报无缝滚动
    news();
    //4-轮播图（定时器+触屏滑动） 
    banner();
}

//1-倒计时
function downTime() {
    var time = 5 * 60 * 60;  //秒数
    var spans = document.querySelectorAll('.time span:nth-child(2n+1)');
    console.log(spans);
    
    //先执行一次
    setTime();
    //定时器切换时间
    setInterval(function () {
        //改变时间
        time--;  
        setTime();
    },1000);

    //设置时间的方法
    function setTime()  {
          //判断数据是否合理
          if (time < 0) {
            time = 24 * 60 * 60;
        }

        //获取时分秒    
        var h = Math.floor(time / 3600);              //小时
        var m = Math.floor(time % 3600 / 60);         //分钟
        var s = time % 60;                            //秒数 



        //将时间转成00:00:00 格式 
        h = h < 10 ? '0' + h: h;
        m = m < 10 ? '0' + m: m;
        s = s < 10 ? '0' + s: s;

        // console.log(h);
        // console.log(m);
        // console.log(s);

        spans[0].innerHTML = h;
        spans[1].innerHTML = m;
        spans[2].innerHTML = s;
    }
}

//2-头部滚动变色
//根据页面卷曲的高度 和 轮播图高度比值， 动态设置 header 颜色  
function header() {
    //1-获取轮播图的高度
    var bannerHeight = document.querySelector('.jd-banner').offsetHeight;
    console.log(bannerHeight);    
    var header = document.querySelector('.jd-header');
    //2-获取页面滚动的高度
    window.onscroll = function (){
        var top = document.documentElement.scrollTop;       
        //3-求比值
        var value = top / bannerHeight; 
        //透明度不能超过1 
        if(value > 1) {
            value = 1;
        }
        // console.log(value);
        //4-设置给header 
        header.style.background = 'rgba(222, 24, 27, ' + value + ')';
    }
 
}

//3-京东快报 无缝滚动
// 实现： 每次向上滚动 一个li的高度（30px) ,并且将当前显示li之前 li标签，移动最后面；
function news() {
    var ul = document.querySelector('.jd-news .info');
    //用定时器 进行切换动画
    setInterval(function () {
        //添加过渡
        ul.style.transition = 'transform 0.5s';
        ul.style.webkitTransition = 'transform 0.5s';
        //进行位移
        ul.style.transform = 'translateY(-30px)';
        ul.style.webkitTransform =  'translateY(-30px)';
    }, 2000);

    //在动画完成后，将第一li标签移动到最后面
    
    //animationend  transitionend 
    //css3属性兼容处理  
    ul.addEventListener('transitionend', appendLi);
    ul.addEventListener('webkitTransitionEnd', appendLi);

    function appendLi() {
         // 将第一li标签移动到最后面
         ul.appendChild(this.querySelector('li:first-child'));
         ul.style.transition = 'none';
         ul.style.webkitTransition = 'none';
         //将ul 位移 
         ul.style.transform = 'translateY(0px)';
         ul.style.webkitTransform = 'translateY(0px)';
    }
}

//4-轮播图
//4-1 定时器切换轮播图
//4-2 触屏滑动轮播图
//index

//4-1 定时器切换轮播图
// 1-利用定时器 累加 index 
// 2-ul根据index 来切换轮播图 
//思考： 1- 谁改变index的值   2- 如何根据index 产生动画效果  3-对index的范围控制 
function banner() {

    //1-获取需要标签  
    var banner = document.querySelector('.jd-banner');  //轮播图
    var ul = banner.querySelector('ul');  
    var points = banner.querySelectorAll('ol li'); //小圆点 
    var bannerWidth = banner.offsetWidth; //全屏宽度

    //2-定义需要变量 index
    var index = 1; 

    //3-定时器切换轮播图
    var timer = setInterval(turn, 1000);

    function turn() {
         //切换 index
         index++;
         //添加过渡
         ul.style.transition = 'transform 0.4s';
         //ul根据index的值进行切换  
         // ul移动距离 = -index * w;
         ul.style.transform = 'translateX('+ (-index * bannerWidth) +'px)';
    }

    //4-在某一屏过渡完成之后，对判断index值是否越界
    ul.addEventListener('transitionend', function() {
        //判断index值是否越界
        if (index >= 9) {
            index = 1;
            //让ul瞬移到 第一张进行重合替换 
            ul.style.transition = 'none';
            ul.style.transform = 'translateX('+ (-index * bannerWidth) +'px)';
        }

        if (index <=0 ) {
            index = 8;
            //让ul瞬移到 和最后一张进行重合替换 
            ul.style.transition = 'none';
            ul.style.transform = 'translateX('+ (-index * bannerWidth) +'px)';
        }

        //通过上面 判断，index 一定在安全范围之内，可以直接使用
        //小圆点的索引值 比 对应的轮播图索引值 小1 
        setPoint(index -1);
    })

    //5-切换小圆点 
    //index当前突出显示索引值
    function setPoint(index) {
        //1-排他
        points.forEach(function(v) {
            v.classList.remove('current');
        })
        //2-突出显示自己
        points[index].classList.add('current');
    }


    //6- 实现触屏切换轮播效果
    // 6-1 触屏开始
        //1-清除定时器    2-记录手指触屏起始x坐标 
    // 6-2 触屏移动
        //1- 记录鼠标移动x坐标值 
        //2- 计算移动距离差值
        //3- ul跟着手指移动 
    // 6-3 触屏结束
        //1-判断手指 左滑 还是 右滑  ，改变index值 
        //2-如果移动距离小于屏幕宽度 1/3 index值不变（吸附回去）
        //3-如果移动距离小于屏幕宽度 1/3 切换图片 上一张 或者下一张
        //4-触屏结束后，定时器开启
    //定义需要变量存放数据
    var startX = 0;
    var moveX = 0; 
    var distanceX = 0;

    //触屏开始
    banner.ontouchstart = function (e) {
        //1-清除定时器    
        clearInterval(timer);
        //2-记录手指触屏起始x坐标 
        startX = e.targetTouches[0].clientX; 
    }
    //触屏移动
    banner.ontouchmove = function (e) {
        //1- 记录鼠标移动x坐标值 
        moveX = e.targetTouches[0].clientX; 
        //2- 计算移动距离差值
        distanceX = moveX -startX 
        console.log(distanceX);        
        //3- ul跟着手指移动 
        //让ul跟着手指实时移动，不需要过渡
        ul.style.transition = 'none';
        //ul移动距离 = 之前移动距离 + distanceX;
        //指定移动距离 = -index * w ;
        //ul移动距离 = -index * w + distanceX;
        var x = -index * bannerWidth + distanceX; //ul要移动的距离 
        ul.style.transform = 'translateX(' + x +'px)';
    }
    //触屏结束
    banner.ontouchend = function () {
        //判断是否要切换轮播图，
        //如果移动距离大于屏幕宽1/3 切换轮播, 要改变index的值  
        if(Math.abs(distanceX) > bannerWidth/3) {
           //要切换 上一张 还是下一张？
           if (distanceX > 0) {
                //右滑， 上一张  
                index--;
           } 

           if (distanceX < 0) {
              //左滑 ，下一张
               index++; 
           }
        }

        //切换 
        //添加过渡
        ul.style.transition = 'transform 0.4s';
        //ul根据index移动到指定位置         
        ul.style.transform = 'translateX('+ (-index * bannerWidth) +'px)';

        //开启定时器：
        timer = setInterval(turn, 1000);

        //数据重置
        startX = 0;
        moveX = 0; 
        distanceX = 0;
    }
}






















// ;(function () {
//     //1-由于轮播的li标签全部定位 脱标，父盒子高度为0 ，
//     //并且图片自适应布局无法设置固定高度，遂用js动态设置高度;
//     function setBannerHeight() {
//         document.querySelector('.jd-banner').style.height 
//             = document.querySelector('.jd-banner ul img').offsetHeight + 'px';
//     }

//     setBannerHeight(); //设置高度

//     //当屏幕尺寸变化时动态设置banner高度
//     window.onresize = function () {
//         setBannerHeight(); //设置高度
//     }
// })();






