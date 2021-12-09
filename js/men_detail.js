//상태체크 전역변수
var mob = 0; // 모바일인지 아닌지 상태(0-아님, 1-모바일)
var autocall, autocallT;
var bsts=0;//배너작동중 상태값(0-휴식,1-활동)
//////////////////////////////////////
//신상품 정보 전역변수 셋팅
var sinsang = {
	"m1":"[남성]카모전판프린트 PQ 티셔츠^DMTS7K731-MG^99,000원",
	"m2":"[남성]빅로고 컬러 블럭 PQ 티셔츠^DMTS7G731-BK ^89,000원",
	"m3":"[남성]빅로고 컬러 블럭 PQ 티셔츠^DMTS7G731-WH ^89,000원",
	"m4":"[남성]부분 스트라이프 PQ 티셔츠^DMTS77731-NY ^99,000원",
	"m5":"[남성]웰딩포인트 트레이닝 하프팬츠^DMTB61731-MD ^89,000원",
	"m6":"[남성]블럭형 풀집업 래쉬가드^DMSW21731-GR ^99,000원",
	"m7":"[남성]블럭형 풀집업 래쉬가드^DMSW21731-KA ^99,000원",
	"m8":"[남성]베이직 솔리드 래쉬가드^DMSW15731-BK ^49,000원",
	"m9":"[남성]남성 루즈핏 슬리브리스^DMSL6C731-MG ^59,000원"
};

//////////////////////////////////////////////////////////////////
///페이지 로딩시 파라미터 변수 받아서 페이지 셋팅하기///
var param = location.href;//전체 Url
				
//console.log(param.indexOf("?"));//물음표 존재여부
//indexOf(문자) -> 만일 찾는 문자열이 없으면 -1이 나온다.
if(param.indexOf("?")===-1){//물음표가 없으면
	location.href = "men.html";//첫페이지로 돌려보내기!
}
// 문자 자르기 내장함수 : split(자를기준문자)
// -----> 자르고 나면 배열이됨, 왜? 잘라서 여러개니까
// 자른 기준문자열은 없어진다. 왜? 그걸로 잘라으니까
// 배열 호출방법 : 변수명[순번] - 순번은 0번부터
param = param.split("?")[1].split("=")[1];//값만추출

//console.log(param);//콘솔에 찍기


//페이지 셋팅///////////////
jQuery(document).ready(function($){
	"use strict";
	//// 1-1. 큰이미지 변경하기 
	$("#bigimg").attr("id",param);//아이디변경하기
	$("#"+param).attr("src","images/"+param+"-1.jpg");
	
	//// 1-2. 썸네일 변경하기
	var hcode='<a href="images/'+param+'-1.jpg" data-large="images/'+param+'-1.jpg"><img src="images/'+param+'-1.jpg" alt="썸네일" /></a>';
	hcode+='<a href="images/'+param+'-2.jpg" data-large="images/'+param+'-2.jpg"><img src="images/'+param+'-2.jpg" alt="썸네일" /></a>';
	hcode+='<a href="images/'+param+'-3.jpg" data-large="images/'+param+'-3.jpg"><img src="images/'+param+'-3.jpg" alt="썸네일" /></a>';
	hcode+='<a href="images/'+param+'-4.jpg" data-large="images/'+param+'-4.jpg"><img src="images/'+param+'-4.jpg" alt="썸네일" /></a>';
	hcode+='<a href="images/'+param+'-5.jpg" data-large="images/'+param+'-5.jpg"><img src="images/'+param+'-5.jpg" alt="썸네일" /></a>';
	hcode+='<a href="images/'+param+'-6.jpg" data-large="images/'+param+'-6.jpg"><img src="images/'+param+'-6.jpg" alt="썸네일" /></a>';
	
	///썸네일 html변경
	// 그리고 큰이미지의 id명과 동일한 class명을 썸네일 박스에 주면 작은 이미지 클릭시 큰이미지가 변경된다.
	// multizoom 플러그인에서 처리함!
	$(".thumbs").html(hcode).addClass(param);
	
	/// 2. 상품명 변경하기
	$("#gtit").text(sinsang[param].split("^")[0]);

	//// 3-1. 상품 가격 변경하기
	$("#gprice").text(sinsang[param].split("^")[2]);
	
	/// 3-2. 토탈가격 초기 셋팅
	$("#total").text(sinsang[param].split("^")[2].replace("원",""));//"원" 빼고 넣기

	//// 4. 상품 코드 변경하기
	$("#gcode").text(sinsang[param].split("^")[1]);
	
	/////5. 상품 상세 이미지 셋팅하기
	for(var i=0; i<6; i++){
		$(".dimgs").append('<img src="images/'+param+'-'+(i+1)+'.jpg" alt="상세이미지">');
	}/// for /////
	
	
	
});//jQB///
	



/////// multizoom 플러그인 적용////////
jQuery(document).ready(function($){
	$("#"+param)//변경된 아이디 적용
	.addimagezoom({
		zoomrange: [2,10], //확대범위[최소비율, 최대비율]
		largeimage: "images/"+param+"-1.jpg",//확대로볼이미지
		magnifiersize: [700, 700], //확대화면 크기[가로,세로]
		magnifierpos: "right", //확대화면 위치(공간확보 필수)
		cursorshade: true, //사진위확대범위 표시자(true보임)
		cursorshadecolor: "#000", //확대범위표시 색상
		cursorshadeopacity: 0.4 //확대범위 투명도
	});//이미지 확대 셋팅
	
	/////수량증감 버튼 클릭시 계산함수 호출하기/////
	jQuery(".chg_num>img").click(function(){
		var idx = jQuery(this).index();//이미지순번
		sumit(idx);//idx가 0이면 수량증가, 1이면 감소		
	});//////click////
	
	
	
});///jQB///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

jQuery(document).ready(function(e) {
    if(jQuery(window).width() <= 1100) mob=1;
	else mob=0;
//	console.log("잘나오니?");
});
jQuery(window).resize(function(){
    if(jQuery(window).width() <= 1100) mob=1;
	else mob=0;
//console.log(mob);
});


//////////////////////////////////////////////////////
///////////////수량증감함수///////////////////////
var num=1;
function sumit(sts){//alert(sts);
	if(sts==0)num++;
	else num--;
	if(num==0)num=1;//한계수
	var target= document.getElementById("sum");
	target.value = num;
	
	//가격계산
	var price = document.getElementById("gprice");//기본가격
	var total = document.getElementById("total");//토탈
//	price = price.innerHTML.split(",");
//	price = price[0]+price[1].replace("원","");//숫자만추출	
	console.log(price);
	price = price.innerHTML.replace(/,/g,"").replace("원","");//숫자만추출
	console.log(price);
	price = Number(price)*num;	//토탈계산
	console.log(price);
	price = numberWithCommas(price);//점찍어서 오기
	console.log(price);
	total.innerHTML = price;	
}

//정규식함수(숫자 세자리마다 콤마해주는 기능)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}










