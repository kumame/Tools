(function () {
	'use strict';

	var byId = function (id) { return document.getElementById(id); },

		loadScripts = function (desc, callback) {
			var deps = [], key, idx = 0;

			for (key in desc) {
				deps.push(key);
			}

			(function _next() {
				var pid,
					name = deps[idx],
					script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = desc[deps[idx]];

				pid = setInterval(function () {
					if (window[name]) {
						clearTimeout(pid);

						deps[idx++] = window[name];

						if (deps[idx]) {
							_next();
						} else {
							callback.apply(null, deps);
						}
					}
				}, 30);

				document.getElementsByTagName('head')[0].appendChild(script);
			})()
		},

		console = window.console;


	if (!console.log) {
		console.log = function () {
			alert([].join.apply(arguments, ' '));
		};
	}


	Sortable.create(byId('foo'), {
		group: "words",
		animation: 150,
		store: {
			get: function (sortable) {
				var order = localStorage.getItem(sortable.options.group);
				return order ? order.split('|') : [];
			},
			set: function (sortable) {
				var order = sortable.toArray();
				localStorage.setItem(sortable.options.group, order.join('|'));
			}
		},
		onAdd: function (evt){ console.log('onAdd.foo:', [evt.item, evt.from]); },
		onUpdate: function (evt){ console.log('onUpdate.foo:', [evt.item, evt.from]); },
		onRemove: function (evt){ console.log('onRemove.foo:', [evt.item, evt.from]); },
		onStart:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
		onSort:function(evt){ console.log('onStart.foo:', [evt.item, evt.from]);},
		onEnd: function(evt){ console.log('onEnd.foo:', [evt.item, evt.from]);}
	});


})();

//加载
function load(){
	if(localStorage.prefix) $("#prefix").val(window.localStorage.prefix);
	if(localStorage.suffix) $("#suffix").val(window.localStorage.suffix);
	if(localStorage.names) $("#names").val(window.localStorage.names);
	if(localStorage.layernum) $("#layernum").text(localStorage.layernum);
	if(localStorage.layerbox) $("#foo").html(localStorage.layerbox);
}

//自动保存
var autosave = window.setInterval(function(){$('#save').click()},60000);

//键盘监听
function keyDown(e){
	currKey = e.keyCode||e.which||e.charCode;
	if(currKey == 83 && (e.ctrlKey||e.metaKey)){
		$('#save').click();
		return false;
	}
}
document.onkeydown = keyDown;

//缓存
$("#save").click(function(){
	localStorage.prefix = $("#prefix").val();
	localStorage.suffix = $("#suffix").val();
	localStorage.names = $("#names").val();
	localStorage.layernum = $("#layernum").text();
		//获取楼层列表
		var layerbox = '';
		$("#foo li").each(function(){layerbox +='<li><i onclick="remove(this);"></i><select><option>'+$(this).children("select").val()+'</option></select><textarea rows="3">'+$(this).children("textarea").val()+'</textarea></li>';});
	localStorage.layerbox = layerbox;
	$("#upsave").text(new Date().toLocaleTimeString('en-US',{hour12:false}));
});

//添加
$("#add").click(function(){
	var names = $("#names").val().split(/\s|，|,/);
	var namelist='';
	for (i=0;i<names.length;i++){namelist += "<option>"+names[i]+"</option>";}
	var addlist = $("#foo").text();
	var html ='<li><i onclick="remove(this);"></i><select>'+namelist+'</select><textarea rows="3"></textarea></li>';
  $("#foo").append(html);
  $("#layernum").html(Number($("#layernum").text())+1);
});

//移除
function remove(ts){
	$(ts).parent().remove();
	$("#layernum").html(Number($("#layernum").text())-1);
}

//输出
$("#relod,#bbcode,#html").click(function(){
	var i=1;
	var bnt =$(this).attr('id');
	var outdetail ='';
	$("#foo li").each(function(){
		if(bnt=='bbcode'){
			var suffix = $("#suffix").val();
			if(suffix!="") suffix="[color=#aaaaaa]"+$("#suffix").val()+"[/color]";
			outdetail +="[sup]"+$("#prefix").val()+i+++"[/sup] [b]"+$(this).children("select").val()+"[/b] "+suffix+'\n'+$(this).children("textarea").val()+'\n\n'+"[hr]"+'\n';
		}else if(bnt=='html'){
			if(suffix!="") suffix="<font style='color:#aaa;'>"+$("#suffix").val()+"</font>";
			outdetail +="<sup>"+$("#prefix").val()+i+++"</sup> <b>"+$(this).children("select").val()+"</b> "+suffix+"<br>"+'\n'+$(this).children("textarea").val()+"<br><br><hr>"+'\n';
		}else{outdetail +=$("#prefix").val()+i+++" "+$(this).children("select").val()+" "+$("#suffix").val()+'\n'+$(this).children("textarea").val()+'\n\n\n';}
		
	});
  $("#outdetail").html(outdetail);
});

//复制
$("#copy").click(function(){
	$("#echo").html("已复制到剪切板 "+new Date().toLocaleTimeString('en-US',{hour12:false}));
	var clipboard = new Clipboard('#copy');
});