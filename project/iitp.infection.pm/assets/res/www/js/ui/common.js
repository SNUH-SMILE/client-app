(function(window, undefined) {
var exitAppFlag = false;
M.onBack(function(e) {
    var stackLength = M.info.stack().length;
    if(stackLength == 1){	//stack 크기가 1이면 최초 페이지로 간주 app 종료
        if(!exitAppFlag){
            exitAppFlag = true;
            M.pop.instance("앱을 종료하시려면 한번 더 뒤로가기를 눌러주세요");
            setTimeout(function(){
                exitAppFlag = false;
            }, 2000);
        }else{
             M.sys.exit();
        }
    }else{
        M.page.back();
    }

});

})(window);