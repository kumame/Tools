//-----------------------------------------------------------------------------
//  使用时请保留该信息，非常感谢
//-----------------------------------------------------------------------------
//  角色设定生成器
//  Character Generator
//
//  作者：熊豆(kumame)
//  站点：https://github.com/kumame/Tools
//-----------------------------------------------------------------------------
//  Age = 左侧box纵坐标
//  RF  = 左侧box横坐标
//  Lo  = 右侧box纵坐标
//  La  = 右侧box横坐标
//-----------------------------------------------------------------------------

//坐标选择生成
function GenC(){
    var GenC = [];
    for(i = 1; i < 3; i++){GenC[i] = $('#box'+i).contents().find("#xynote").val();}
    GenC_=(GenC.join(",").replace(/^,/,'')).split(",");
    DNAmix(GenC_[0],GenC_[1],GenC_[2],GenC_[3]);
}
//随机生成
$("#Rseed").click(function(){
    var Mapdata = [];
    for (i = 0; i < 4; i++) {
       Mapdata[i] = Math.round((Math.floor(Math.random() * (Math.floor(mapsize) - Math.ceil(1))) + Math.ceil(1))/BSZH);
    }
    for (k = 1; k < 3; k++) {
        k==1?p=0:p=k;
         var box = $('#box'+k).contents();
         box.find("#x-a, #x-f").css("left",Mapdata[p+0]+"%");
         box.find('#y-a, #y-f').css("top",Mapdata[p+1]+"%");
         box.find("#xynote").val(Mapdata[p+0]+","+Mapdata[p+1]);
         box.find("#SelectCursor").css({"left":(Mapdata[p+0]-ZBYZ)+"%","top":(Mapdata[p+1]-ZBYZ)+"%"});
    }
    DNAmix(Mapdata[0],Mapdata[1],Mapdata[2],Mapdata[3])
});
var DBzone=JSON.parse(localStorage.zone);
var DBregion=JSON.parse(localStorage.region);
var DBrace=JSON.parse(localStorage.race);
//因子混合
function DNAmix(Age,RF,Lo,La){
    //web自定义设置，不用删除 -->
    RACE = $('#switch-RACE').val();
    hybrid = $('#switch-hybrid').val();
    EYCL123 = $('#switch-EYCL123').val();
    F_B_B = $('#switch-F_B_B').val();
    F_B_M = $('#switch-F_B_M').val();
    F_B_S = $('#switch-F_B_S').val();
    F_B_BS = $('#switch-F_B_BS').val();
    B_L_D = $('#switch-B_L_D').val();
    heightMIN= parseInt($('#switch-heightMIN').val());
    heightMAX= parseInt($('#switch-heightMAX').val());
    Cname = $('#CharacterName').val();
    $('.Cname').text(Cname);
    //web自定义设置 * 结束 <--
    //种族
    var htmlRACE ='';
    if(RACE==1) htmlRACE = RACE_F(Age,RF,Lo,La);
    //异色瞳
    var htmlEC123 = '';
    if(Math.round((EYCL123*(RF*0.1))*100) >= RandomInt(1000)) htmlEC123 = '，其中一只是<em>'+ BOXfilter1(localStorage.eyeColor) +'</em>异瞳';

    //输出
    var DNAhtml = '';
        DNAhtml += '<div class="card P-T4 BGtype2"><p>来自<u>'+AREA_F("region",Lo)+AREA_F("zone",La)+'</u>'+ htmlRACE +'。</p>';
        DNAhtml += '<p>身高<u>'+BodyHeight(La)+'</u>公分、'+ BOXfilter1(localStorage.bodyType) +'、肤色 <u>'+ BOXfilter2(localStorage.bodyColor,RF,Lo,La) +'</u>'+LimbD()+'。</p>';
        DNAhtml += '<p>'+FaceBox()+'，<u>'+BOXfilter1(localStorage.faceBrow)+'</u>之下是一双<u>'+ BOXfilter1(localStorage.eyeLook) +'</u>的<u>'+ BOXfilter1(localStorage.eyeShape) +'</u>，虹膜呈<u>'+ BOXfilter2(localStorage.eyeColor,RF,Lo,La) +'</u>'+ htmlEC123 +'。</p>';
        DNAhtml += '<p>'+HairBox(Age,RF,Lo,La)+'</p></div>';
        DNAhtml += '<div class="card MaT1 BGtype1"><p>'+PersonaBox()+'。</p>';
        DNAhtml += '<p>'+SkillBox(Age,RF,Lo,La)+'。</p></div>';
    $("#DNAout").html(DNAhtml);
    BoxBG(Age,RF);
}
//地区
function AREA_F(DBname,LoLa){
    var htmlArea = '';
    var DBget = DBname=="zone"? DBget = DBzone : DBget = DBregion;
    var caseSwitch=[];
    for(i=0; i< DBget.length; i++){
        caseSwitch[i] = i==0 ? caseSwitch[i] = LoLa <= DBget[i].LL : caseSwitch[i] = LoLa > DBget[(i-1)].LL && LoLa <= DBget[i].LL;
        switch(true){
            case(caseSwitch[i]==true):
                htmlArea += DBget[i].obj;
        }
    }
    return htmlArea;
}
//种族
function RACE_F(Age,RF,Lo,La){
    var race_BOX_d = BOXfilter3(localStorage.race,Age,RF,Lo,La);
    var RACE_d = '，是<u>'+yaoshouleixing(race_BOX_d)+race_BOX_d+'</u>';
    if(hybrid>0 && RF>=hybridRF && hybrid>=RandomInt(100) && race_BOX_d==DBrace[(Embryo-1)].obj) RACE_d +=hunxue();
    return RACE_d;
}
//妖、兽类型
function yaoshouleixing(R_box){
    var Yaoshou ='';
    if(R_box=='妖' || R_box=='兽人') var Yaoshou = BOXfilter1(localStorage.race2);
    return Yaoshou;
    
}
//混血
function hunxue(){
    var HBmix = DBrace.filter(item => item.RF>=hybridRF);
    var HBmix_d = HBmix[RandomInt(HBmix.length)].obj;
    return '，有<em>'+Math.round(Math.random()*(80-1+1)+1)+'%</em>的<u>'+yaoshouleixing(HBmix_d)+HBmix_d+'</u>血统';
}
//身高
function BodyHeight(La){
    var SG_R = Math.random()*(heightMAX - heightMIN + 1) + heightMIN;
    if(La<=DBzone[(REDAI-2)].LL){
        SGYZ = (-La+(DBzone[(REDAI-2)].LL))*0.01;
    }else if(La>DBzone[(REDAI-1)].LL){
        SGYZ = (La-DBzone[(REDAI-1)].LL)*0.01;
    }else{
        SGYZ = 0;
    }
    return Math.round(SG_R*SGYZ+SG_R);
}
//肢体伤痕、残缺
function LimbD(){
    htmlLD='';
    if(RandomInt(100)<=F_B_BS) htmlLD += '，'+BOXfilter1(localStorage.bodyPlace)+'有伤痕';
    if(RandomInt(100)<=B_L_D){
        LorR = RandomInt(2)==1? '左':'右';
        DorP = RandomInt(2)==1? '缺失':'义肢';
        var JOINT = RandomInt(2)==1?  JOINT = new Array('腕以下','肘以下',"臂整体") : JOINT = new Array('踝以下','膝以下',"腿整体");
        htmlLD += '，'+LorR+JOINT[RandomInt(3)]+DorP;
    }
    return '<i>'+htmlLD+'</i>';
}
//脸型、痣、伤、胡须
function FaceBox(){
    R_feature ='';
    if(RandomInt(100)<=F_B_F) R_feature +='、面部有雀斑';
    if(RandomInt(100)<=F_B_B) R_feature +='、'+BOXfilter1(localStorage.faceBeard)+'';
    if(RandomInt(100)<=F_B_M) R_feature +='、'+BOXfilter1(localStorage.faceMole)+'有痣';
    if(RandomInt(100)<=F_B_S) R_feature +='、'+BOXfilter1(localStorage.faceMole)+'有伤痕';
    return '脸型<u>'+BOXfilter1(localStorage.faceType)+'</u><i>'+R_feature+'</i>';
}
//发色,渐变、挑染应随Age增高而减少
function HairBox(Age,RF,Lo,La){
    var htmlHBox = '';
    if(RandomInt(1000)<=RandomIF(H_B_CG[0],Age) || RandomInt(1000)<=RandomPF(H_B_CG[1],RF)) htmlHBox += '渐变<em>'+BOXfilter4(localStorage.hairColor,Age,RF,Lo,La)+'</em>的 ';
    HairL=BOXfilter1(localStorage.hairLength);
    if(HairL.includes('寸头')==true){
        const CTLX = ['圆','方','毛','板'];
        htmlHBox += CTLX[RandomInt(4)]+HairL;
    }else{
        const ZJLQ = ['直','卷','乱','翘'];
        htmlHBox += HairL+ZJLQ[RandomInt(4)]+'发、'+BOXfilter1(localStorage.hairBangs);
    }
    if(paichufaxing(HairL)!=true) htmlHBox +='、梳着'+BOXfilter1(localStorage.hairStyle);
    if(RandomInt(1000)<=RandomIF(H_B_CG[0],Age) || RandomInt(1000)<=RandomPF(H_B_CG[1],RF)) htmlHBox +='，发中有挑染'+'<em>'+BOXfilter4(localStorage.hairColor,Age,RF,Lo,La)+'</em>';
    return '<u>'+BOXfilter4(localStorage.hairColor,Age,RF,Lo,La)+'</u>'+htmlHBox+'。';
    //排除发型中不适合混合的
    function paichufaxing(H_B_S){
        const PCFX=['寸头','超短','短'];
    if(PCFX.includes(H_B_S)){return true;}
    }
}
//性格特质
function PersonaBox(){
    var htmlHBox='';
    var mold_r = RandomInt(2);
    var traits_r = RandomInt(2);
    htmlHBox += mold_r==0 ? BOXfilter1(localStorage.moldP) : BOXfilter1(localStorage.moldN);
    htmlHBox += mold_r==traits_r ? guoduyu = ' 又 ': guoduyu=' 但 ';
    htmlHBox += traits_r==0 ? BOXfilter1(localStorage.traitsP) : BOXfilter1(localStorage.traitsN);
    if(traits_r==0 && RandomInt(100)<=7) htmlHBox +='，<em>只不过容易'+BOXfilter1(localStorage.traitsE)+'</em>';
    return htmlHBox;
}
//特长爱好
function SkillBox(Age,RF,Lo,La){
    var htmlHBox='';
    htmlHBox +='精通<u>'+BOXfilter4(localStorage.skill,Age,RF,Lo,La)+'</u>';
    if(RandomInt(100)<=20){
        htmlHBox +='和<u>'+BOXfilter4(localStorage.skill,Age,RF,Lo,La)+'</u>';
        if(RandomInt(100)<=5) htmlHBox +='，还有<u>'+BOXfilter4(localStorage.skill,Age,RF,Lo,La)+'</u>';
    }
    htmlHBox +='，喜欢<u>';
    htmlHBox +=BOXfilter4(localStorage.hobby,Age,RF,Lo,La)+'</u>';
    if(RandomInt(100)<=20){
        htmlHBox +='和<u>'+BOXfilter4(localStorage.hobby,Age,RF,Lo,La)+'</u>';
    }
    return htmlHBox;
}

//筛选器
//类型1：基本随机筛选
function BOXfilter1(DBbox){
    var B_F1 = JSON.parse(DBbox);
    return B_F1[RandomInt(B_F1.length)].obj;
}
//类型2：LoLa坐标阈值范围，小于RF坐标
function BOXfilter2(DBbox,RF,Lo,La){
    var B_F2= (JSON.parse(DBbox).filter(item => item.GS==1 || item.Lo>= Lo-ZBYZ && item.Lo <= Lo+ZBYZ && item.La>= La-ZBYZ && item.La <= La+ZBYZ)).filter(item2 => item2.GS==1 || item2.RF <= RF);
    return B_F2[RandomInt(B_F2.length)].obj;
}
//类型3：全系参照，取坐标阈值范围
function BOXfilter3(DBbox,Age,RF,Lo,La){
    var B_F3 = (((JSON.parse(DBbox)).filter(item3 => item3.GS==1 || item3.Lo==null&&item3.La==null || item3.Lo>= Lo-ZBYZ && item3.Lo <= Lo+ZBYZ && item3.La>= La-ZBYZ && item3.La <= La+ZBYZ)).filter(item2 => item2.GS==1 || item2.Age==null || item2.Age>= Age-RFYZ && item2.Age <= Age+RFYZ && item2.RF>= RF-RFYZ && item2.RF <= RF+RFYZ)).filter(item => item.GS==1 || item.RF <= RF);
    return B_F3[RandomInt(B_F3.length)].obj;
}
//类型4：全系参照，LoLa坐标阈值范围，大于Age坐标，小于RF坐标
function BOXfilter4(DBbox,Age,RF,Lo,La){
    var B_F4 = ((JSON.parse(DBbox)).filter(item3 => item3.GS==1 || item3.Lo==null&&item3.La==null || item3.Lo>= Lo-ZBYZ && item3.Lo <= Lo+ZBYZ && item3.La>= La-ZBYZ && item3.La <= La+ZBYZ)).filter(item2 => item2.GS==1 || item2.Age >= Age || item2.RF <= RF);
    return B_F4[RandomInt(B_F4.length)].obj;
}

//随机计算，指定位数
function RandomInt(num){
  return parseInt(Math.random()*num);
}
//随机系数，值越大结果越大
function RandomPF(F,V){
  return parseInt(Math.round((F*(V*0.1))*100));
}
//随机系数，值越大结果越小
function RandomIF(F,V){
  return parseInt(Math.round((F/(V*0.1))*100));
}

//修改生成颜色，不使用删除即可
function BoxBG(X,Y){
    $('#box1, .card').css("background-color","hsl("+(X+Y)*1.8+" "+((Y-50)*0.1+30)+"% "+((X-50)*0.1+50)+"%)");
    $('.card').css("color","hsl("+(X+Y)*1.8+" 66% 93%)");
    $("#DNAout u").css("border-color","hsl("+(X+Y)*1.8+" 44% 70%)");
    $("#DNAout em").css("background-color","hsl("+(X+Y)*1.8+" 30% 45%)");
    $("#DNAout i").css("background-color","hsl("+(X+Y)*1.8+" 33% 54%)");
}

//web页面自定义控制，不使用删除即可
$("#switch-RACE").click(function(){
    if($('#switch-RACE').is(':checked')){
        $('#switch-RACE').val(1);
        $("#switch-hybrid").attr("disabled",false);
    }else{
         $('#switch-RACE').val(0);
         $("#switch-hybrid").attr("disabled",true);
    }
});
