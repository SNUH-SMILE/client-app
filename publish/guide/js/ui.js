$(window).ready(function(event){
      //높이값 적용
      //setresize();
});

//팝업 추가할때 아래 setresize() 실행해주세요.
function setresize(){
      //데이터박스
      var allH = $('body').height() - $('.header').height() - $('.footer').height();
      $(".scrollBox").css("height",allH);
}

// 버튼 토글
$('.btn-round.open').click(function(event){
  if ( $(this).hasClass('open') ) {
    $(this).removeClass('open');
    $(this).addClass('close');
  } else{
    $(this).removeClass('close');
    $(this).addClass('open');
  }
});

$('.btn-opensub').click(function(event){
  if ( $(this).hasClass('open') ) {
    $(this).removeClass('open');
    $(this).addClass('close');
  } else{
    $(this).removeClass('close');
    $(this).addClass('open');
  }
});
 