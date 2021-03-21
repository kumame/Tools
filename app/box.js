$("document").ready(function(){
	//绘制地图
	$("#box").css({"width":mapsize+'px',"height":mapsize+'px'});
	$("#SelectCursor").css({"width":(ZBYZ*2)+"%","height":(ZBYZ*2)+"%"});
	//坐标操作
	$("#box").bind('click mousemove',function(e){
		var X=Math.round((e.pageX-$(this).offset().left)/BSZH);
		var Y=Math.round((e.pageY-$(this).offset().top)/BSZH);
		if(e.type=="click"){
			$("#y-f").css("top",Y +"%");$("#x-f").css("left",X +"%");
			$("#xynote").val(X+","+Y);
			$("#SelectCursor").css({"left":(X-ZBYZ)+"%","top":(Y-ZBYZ)+"%"});
			window.parent.GenC();
		}else{
			$("#y-a").css("top",Y +"%");$("#x-a").css("left",X +"%");
		}
	})
});