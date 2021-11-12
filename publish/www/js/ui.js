
// // flex를 사용 하지 못하는 하위 버전을 지원하기 위하여 아래와 같이 높이값을 지정해주는 script를 사용합니다.
// $(window).ready(function(event){
	
// 	//scrollBox 높이값 적용
// 	var allH = $('body').height() - $('.header').height() - $('.footer').height();
// 	//scrollBox의 높이값은 body에서 header / footer를 제외한 content-wrap의 높이에서
// 	// content-wrap 내 scrollBox를 제외한 높이값을 지정한다.
// 	$('.content-wrap').children('div').not('.scrollBox').each(function(idx,div){
// 		var $div = $(div);
// 		allH -= $div.height();
// 	});
// 	$(".scrollBox").css("height",allH);
// });