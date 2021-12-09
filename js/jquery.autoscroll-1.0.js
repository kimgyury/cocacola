// jquery.autoscroll-1.0.js 
// 자동 스크롤 JS

//////// 전역변수 구역 //////////////////
var pno=0;// 현재 페이지 번호(첫페이지 0)
var totpno=5;//전체 페이지개수
var prot=0;//막기상태값(0-허용,1-막기)

/// 현재 페이지 window 폭//
var winW=$(window).width();
var mobsts=0;//0-DT, 1-mob
if(winW<1000)mobsts=1;//폭이 1000보다작으면 mobile임!
console.log(mobsts);
////////////////////////////////////

$(function(){/// jQB ///////////////////////////
	
	/////////// 모바일일때 전체 메뉴 배경 비디오를 삭제하고 배경 이미지로 대체함!(이유는 모바일에서는 동영상 자동 재상지원불가!) //////
	if(mobsts===1){
		/// 1. 기존 동영상 태그를 지운다.
		$("#menu>video").remove();
		/// 2. 배경이미지 넣기
		$("#menu").css({
			background: "url(images/mobile/ban04.jpg) no-repeat center/cover"
		});//// css ///
		
		////// 모바일일때 배너 배경이미지 모바일 전용으로 변경해서 불러오기!!!(이유: 모바일 화면에서 너무 큰 DT 이미지를 불러오면 로딩시간, 사용용량등에서 매우 불리하다!)////
		$(".draggable>li").each(function(idx,ele){
			// idx는 0번부터 순서대로 도는 순번!
			if(idx===0)idx=6;//처음것만 변경하기!
			$(this).css({
			backgroundImage:"url(images/mobile/ban0"+idx+".jpg)"
			});/// css ///
			
		});//////// each ////////////////////
		
		
		
	}////// 모바일일때 if문 ////////////////////////
	
	
	
	


	/*
	[자동스크롤 구현!]

	1.기능: 위나 아래로 스크롤할때 페이지가 위나 아래 페이지로 자동으로 이동 애니메이션됨.

	2. 마우스 휠을 움직여서 스크롤할때 발생하는 이벤트는 무엇일까?
		-> mousewheel (크롬, 오페라, ie, 사파리)
		-> DOMMouseScroll (파이어폭스 전용)

	3. 마우스 휠 이벤트와 함수를 연결하는 방법

	- 기존에 click 이벤트와 함수를 연결할때:
	$(선택자).click(함수) -> 제이쿼리가 만들어서 제공하는 방법임.

	- 일반적으로 쓰이는 이벤트와 함수를 연결하는법
	(1) bind(이벤트명, 함수)
		예) $(선택자).bind("click",함수);
	(2) on(이벤트명, 함수)
		예) $(선택자).on("click", 함수);

	- bind와 on 메서드의 차이는?
		: on 메서드는 연속해서 발생하는 이벤트일 경우 bind보다 처리가 더 효과적으로 구현되어 있다.
	*/

	///스크롤이벤트는 document 문서전체에 설정함.
	$(document)// 이벤트를 다중 사용가능함!
	.on("mousewheel DOMMouseScroll", 
	function(e){
		
		// 모바일일때 작동안함
		if(mobsts===1)return true;//true 값을 리턴해야 스크롤이됨!
		////////////////////////////////
		
		
//			console.log("스크롤중~!");
		// 1. 스크롤 기본이동 막기(파라미터e를 써야함!)
		e.preventDefault();


		///////// 스크롤이동중 잠금장치!!!/////////
		if(prot===1){return false;}// 돌아가!
		prot=1;// 처음들어온 신호가 잠금!
		////////////////////////////////////////////////




		// 2. ie 구버전 구분하기
		var evt = window.event || e;
		// 변수 = 변수1 || 변수2
		// 둘중에 true인 변수가 할당된다.
		// window.event - ie8 이전버전용임.

		// 3. 마우스휠 이벤트에서 가장 중요한 개념!
		/*
		 -> wheelDelta 란? 
		(ie,chrome용), opera는 detail을 사용
		-마우스 이벤트에 따라 발생하는 이벤트 횟수 및 방향과 이동거리 등을 리턴해주는 속성
		- 만약에 wheelDelta를 click이벤트에 적용하면 클릭횟수를 리턴함
		- 마우스 휠이벤트일 경우 스크롤 방향과 이동거리를 리턴해 준다.(+는 윗방향, -는 아랫방향)
		*/
		var delta=evt.detail?evt.detail:evt.wheelDelta;
		// 조건연산자를 사용하여 detail이 treu면 (opera면) 그대로 쓰고, false이면 (opera가 아니면) wheelDelta를 변수에 할당하라!
		//console.log(delta);

		//// 파이어폭스를 위한 별도처리 /////////
		// 1. 파이어폭스는 스크롤처리시 방향이반대
		// 2. 파이어폭스는 detail처리시 
		//    originalEvent.detail 로 사용함!
		if(/Firefox/i.test(navigator.userAgent)){
			delta=-evt.originalEvent.detail;
		}///////////////////////////////////////////////
		/// 정규표현식.test(값) -> 해당값이 정규표현식에 맞으면 treu를 return, 틀리면 false
		// navigator.userAgent -> 현재 브라우저 이름을 리턴함!


		////////////////////////////////////
		if(delta>0){// 윗방향(양수)				
			//페이지번호 감소
			pno--;
			//첫페이지고정!
			if(pno===-1){pno=0;} 				
		}/// if문///////////////////////
		else{// 아랫방향(음수)
			// 페이지번호 증가
			pno++;
			//끝페이지고정!
			if(pno===totpno){pno=totpno-1;} 
		}/// else문 //////////////////////
		//////////////////////////////////
		console.log(pno);


		///// 4. 해당순번 페이지 높이값 구하기 //////
		var pagepos=$(".page").eq(pno).offset().top;

		//// 5. 페이지 이동 애니메이션 설정하기 /////
		$("html,body").animate({
			scrollTop: pagepos+"px"
		},800,"easeInOutCirc",function(){
			prot=0;//이동애니후 잠금풀기!
		});///// ani ////////

		/// 6.GNB메뉴, 블릿메뉴 class변경하기 함수호출
		chgMenu();
		///// 페이지 액션 함수 호출!!!!
		pageAction();


	});////////////// 마우스휠 이벤트 함수 /////////////
	////////////////////////////////////////////////////////





	// GNB의 a링크를 클릭하면 해당 위치로 스크롤 애니메이션 하기
	$("#gnb a,#bnavi a").click(function(e){
		// 기본이동 막기
		// href 속성에 "#아이디명" 을 쓰면 현재 페이지의 해당 아이디 시작위치로 이동하는 것은 기본 기능이다. 이것을 막자!
		e.preventDefault();

		/// 전역 페이지 번호에 클릭된 li의 순번을 넣어서 일치시켜준다!!
		var idx=$(this).parent().index()+1;//클릭된a부모li순번
		pno=idx;//클릭된 메뉴 li순번=현재페이지순번

		// 클릭된 a태그의 href값으로 이동할 id요소의 위치값을 알아낸다.
		var cid=$(this).attr("href");//href값
		console.log(cid);
		var pagepos=$(cid).offset().top;
		// 현재 선택된 아이디의 top위치값을
		// offset().top 으로 알아낼 수 있다.(숫자로)
		console.log(pagepos);


		// 스크롤 애니메이션
		$("html,body").stop().animate({
			scrollTop: pagepos+"px"
		},800,"easeInOutCirc");

		// 이동원리: scrollTop 속성은 오른쪽에 있는 스크롤 바의 높이값을 말한다.
		// 이것을 animate 시키면 스크롤 이동과정을 애니메이션 해준다.

		// 비교해서 알아둘것
		// -> scrollLeft (가로스크롤)

		/// GNB메뉴, 블릿메뉴 class변경하기 함수호출
		chgMenu();
		///// 페이지 액션 함수 호출!!!!
		pageAction();

	});///////// click ///////////////////


	

	////// 각 페이지 액션을 위한 초기 설정 /////
	if(mobsts===0){/// 모바일이 아닐 경우만 셋팅 /////
		/// 1. MEN Page
		$("#cont1>ul>li:first-child>img").css({
			top: "15%", opacity:0
		});//공유
		$("#cont1>ul>li:last-child>h1").css({
			top: "70%", opacity:0
		});//글자
	
		/// 2. WOMEN Page
		$("#cont2>ul>li:last-child>img").css({
			top: "15%", opacity:0
		});//여자
		$("#cont2>ul>li:first-child>h1").css({
			top: "70%", opacity:0
		});//글자

		/// 3. Style page
		$("#cont3>ul>li>img").css({
			top: "15%", opacity:0
		});/// 남자,여자 이미지 공통
		$("#cont3>ul>li:eq(1)>h1:eq(0)").css({
			top: "50%", opacity:0
		});/// 남자글자
		$("#cont3>ul>li:eq(1)>h1:eq(1)").css({
			top: "90%", opacity:0
		});/// 여자글자
	}/// 모바일이 아닐 경우 /////////////////////////////
	




});//////// jQB ///////////////////////////////////

/*/////////////////////////////////////////////////////////
	함수명: chgMenu
	기능: GNB  메뉴와 블릿메뉴를 동시에 현재 페이지와 일치되게 변경한다.(class변경)
*///////////////////////////////////////////////////////////
function chgMenu(){
	/// 호출된 순간 전역변수 pno 현재페이지로변경함

	///블릿메뉴 class변경
	if(pno>0){//배너페이지(0번)을 빼고 적용함!
		
		///GNB 메뉴 class변경
		$("#gnb>li").eq(pno-1).addClass("selM")
		.siblings().removeClass("selM");
		
		
		$("#bnavi>li").eq(pno-1).addClass("selB")
		.siblings().removeClass("selB");
	}////////// 배너페이지 빼고 적용 if문 ///////////
	else{// 배너 페이지일 경우
		$("#gnb>li").removeClass("selM");
	}////////// else //////////////////////////////////////
	
	//// 배너가 있는 첫번째 페이지에서는 블릿메뉴 숨김
	if(pno===0){$("#bnavi").fadeOut(300);}
	else{$("#bnavi").fadeIn(300);}
	

}/////////  chgMenu함수 //////////////////////////////

/*/////////////////////////////////////////////////////////
	함수명: pageAction
	기능: 페이지별 액션을 셋팅한다.
*///////////////////////////////////////////////////////////
function pageAction(){
	///// 첫페이지일때 상단 메뉴 디자인 변경 ////
	if(pno===0){
		// 1. 로고 크기 변경
		$("#logo").animate({width: "15%",margin:"3% 0 1% 3%"},300);
		// 2. 가상요소 배경 투명도 변경
		$("#top").removeClass("topa");
		// 3. 메뉴 위치 변경
//		$("#gnb").animate({bottom:"15%"},300);
//		$("#ham").animate({top: $("#gnb").offset().top+"px"},300);	
	}/////// if문 ////////////////////////////
	////// 그밖의 페이지일때 상단 메뉴 디자인 변경 ////
	else{
		// 1. 로고 크기 변경
		$("#logo").animate({width: "10%",margin:"1% 0 1% 1%"},300);
		// 2. 가상요소 배경 투명도 변경
		$("#top").addClass("topa");
		// 3. 메뉴 위치 변경
//		$("#gnb").animate({bottom:"4%"},300);
//		$("#ham").animate({top: $("#gnb").offset().top+"px"},300);
	}/////////////// else문 //////////////////////////
	
	
	////////// 각 페이지 액션 설정 ///////////////////
	//2. 남자페이지
	if(pno===1){
		/// 1. MEN Page
		$("#cont1>ul>li:first-child>img")
		.delay(300)
		.animate({
			top: "0%", opacity:1
		},1500);//공유
		$("#cont1>ul>li:last-child>h1")
		.delay(600)
		.animate({
			top: "50%", opacity:1
		},1500);//글자
	}/// else if문 ///
	//3. 여자페이지
	else if(pno===2){
		/// 1. WOMEN Page
		$("#cont2>ul>li:last-child>img")
		.delay(300)
		.animate({
			top: "0%", opacity:1
		},1500);//여자
		$("#cont2>ul>li:first-child>h1")
		.delay(600)
		.animate({
			top: "50%", opacity:1
		},1500);//글자
	}/// else if문 ///
	///4. 스타일 페이지
	else if(pno===3){
		$("#cont3>ul>li>img").delay(300)
		.animate({
			top:"0%", opacity:1
		},1500,"easeOutCirc");//남자,여자 이미지 공통
		
		$("#cont3>ul>li:eq(1)>h1:eq(0)").delay(600)
		.animate({
			top: "30%", opacity:1
		},1500,"easeOutCirc");/// 남자글자
		
		$("#cont3>ul>li:eq(1)>h1:eq(1)").delay(600)
		.animate({
			top: "70%", opacity:1
		},1500,"easeOutCirc");/// 여자글자
	}/// else if문 ///
	
	
	
	
	
}///////// pageAction 함수 //////////////////////////////
////////////////////////////////////////////////////////////





