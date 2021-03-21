//-----------------------------------------------------------------------------
//  使用时请保留该信息，非常感谢
//-----------------------------------------------------------------------------
//  角色设定生成器
//  Character Generator
//
//  作者：熊豆(kumame)
//  站点：https://github.com/kumame/Tools
//-----------------------------------------------------------------------------

$("document").ready(function(){
    //绘制地图块
    $("iframe").css({"width":mapsize+'px',"height":mapsize+'px'});
    for (i = 1; i < 3; i++) {$('#box'+i).css("background-image","url("+mapimg[i]+")");}
    //判断DB数据是否存在或者需要更新
    if(localStorage.DBversion < DBversion || !localStorage.DBversion){
        //json文件加载列表
        var DBload = [];
        DBload.push($.get('./db/body.json'));
        DBload.push($.get('./db/area.json'));
        DBload.push($.get('./db/soul.json'));
        //json数据本地化处理
        $.when.apply($, DBload).then(function(DB1,DB2,DB3){
            makeLS(DB1);makeLS(DB2);makeLS(DB3);
            function makeLS(DBnum){
                for(i=0; i < Object.keys(DBnum[0]).length; i++){
                    LStitle = Object.keys(DBnum[0])[i];
                    localStorage.setItem(LStitle,JSON.stringify(DBnum[0][LStitle]));
                }
            }
            return loadAPP();
        },function(){$("#warning").css("display","block").text("数据库加载失败，请检查浏览器或网络环境")});
        //更新版本号
        localStorage.DBversion = DBversion;
    }else{loadAPP();}
});
//载入程序
function loadAPP(){
    $.getScript('app/app.js',function(){
            //初始触发随机
            var iframe = document.getElementById("box1");
            if(!iframe.attachEvent){iframe.onload=function(){$('#Rseed').click();}}
        })
}