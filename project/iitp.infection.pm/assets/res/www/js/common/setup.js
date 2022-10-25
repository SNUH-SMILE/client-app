/**
 * @file : setup.js
 * @author : 
 * @date : 2017.07.24
 */

(function(window, undefined) {
 /**
 * 페이지가 시작될때 호출된다.
 * (실제적으로 페이지가 완전히 로드후 불려진다)
 */ 
M.onReady(function(e){
	console.log("readey");
//	M.plugin("push").remote.enabled(true);
	
    Global.pageName = location.href.substring( location.href.lastIndexOf("html/")+5, location.href.lastIndexOf(".") ); //자기자신 PAGEURL  EX) EMP0100
//    Global.folderName = "";

    //개발모드의 경우 하단에 페이지명 현시
    if(isDev){
        $("body").append("<div style=\"z-index:9999; position:fixed; bottom:.5rem; left:.5rem; font-size:1rem; background-color:#000000; color:#ffffff\">"+Global.pageName+"</div>");
    }

    $(".btn-back, .btn-close").on('click',function(){
        //더블 백키 방지
        if(MAPI.page.backFlag()){
            onBack();
        }
    });

//    $(".btn-set").addClass('none');
    $(".btn-set").on('click',function(){
        MAPI.page.html("IITP_SETTING_V001","","NEW_SCR");
    });

    if(isNewPush()){
        $(".btn-alim").html('알람<span class="badge"></span>');
    }else{
        $(".btn-alim").html('알람');
    }
    $(".btn-alim").on('click',function(){
        MAPI.page.html("IITP_ALARM_V001","","NEW_SCR");
    });

    $(".btn-device").on('click',function(){
         // resetType - 0 : 디바이스/디비 초기화 , 1 : 디바이스 초기화 , 2 : 초기화 없음
        MAPI.page.html("IITP_DEVICE_V001",{resetType : "2", backPageFlag : "T"},"NEW_SCR");
    });
	
    //customizing _onReady 함수 호출
    if( typeof _onReady != 'undefined' ){
        _onReady();
        if(isDev){
            $("body").append("<div style=\"z-index:9999; position:fixed; bottom:.5rem; left:.5rem; font-size:1rem; background-color:#000000; color:#ffffff\">"+Global.pageName+"</div>");
        }
    }
});

/**
 * 페이지가 숨겨 질때 호출된다.
 * (실제적으로 다음 화면으로 이동시 페이지가 숨겨질때 불려진다)
 */
M.onHide(function(e){
    console.log("M.onHide");
    //customizing _onHide 함수 호출
    if( typeof _onHide != 'undefined' ){
        _onHide();
    }
});

/**
 * 앱이 사용자에 의해서 복원되는 경우 호출
 * (App 이 background 에서 foreground로 올라올때)
 */
M.onResume(function(e){
    console.log("M.onResume");
    
    //customizing _onResume 함수 호출
	if( typeof _onResume != 'undefined' ){
	    _onResume();
	}
});

/**
 * 현재 앱에서 타앱을 호출하거나 전화 화면등의 타앱이 들어오는 경우
 * (App 이 foreground 에서 background 로 내려갈때)
 */
M.onPause(function(e){
    console.log("M.onPause");
    
    //customizing _onPause 함수 호출
    if( typeof _onPause != 'undefined' ){
        _onPause();
    }
});

/**
 * 페이지가 복원 될때 호출된다.
 * (히스토리 스택에 쌓여있는 페이지(액티비티)가 복원 될때 호출된다)06-25 16:56:34.039 3707-5292/? I/ActivityManager: START u0 {act=android.intent.action.MAIN typ=null flg=0x10000000 cmp=ComponentInfo{coMAPI.dongwha.dwmep/coMAPI.dongwha.dwmep.__Template__}} from uid 10214 on display 0
 */
M.onRestore(function(e){
    console.log("M.onRestore");

    //페이지 복원 시 바로 백키 방지
    MAPI.page.backFlag(400);
    if(isNewPush()){
       $(".btn-alim").html('알람<span class="badge"></span>');
    }else{
       $(".btn-alim").html('알람');
    }
    //customizing _onRestore 함수 호출  
    if( typeof _onRestore != 'undefined' ){
        _onRestore();
    }
});

/**
 * 페이지가 제거 될때 호출된다.
 * (스택에 있는 현재 페이지(액티비티)가 제거 될때 호출된다.
 */
M.onDestroy(function(e){
    console.log("M.onDestroy");
    
    //customizing _onDestroy 함수 호출
    if( typeof _onDestroy != 'undefined' ){
        _onDestroy();
    }
});

/**
 * 이전 화면으로 이동
 * 하드웨어 이전 키의 이벤트가 발생했을 경우 호출된다.(안드로이드)
 */
M.onBack(function(e){
    console.log("M.onBack");

    //더블 백키 방지
    if(MAPI.page.backFlag()){
        onBack();
    }
});

/**
 *
 */
//customizing _onBack 함수 호출 cusomizing 한 함수가 없으면 기본 back함수 호출
var onBack = function(){
    if(existOpenPopup() && existPopupFunc() && typeof popup.onBack != 'undefined') popup.onBack();
    else if( typeof _onBack != 'undefined' ){
        _onBack();
    }else{
        MAPI.page.back();
    }
}


//Object.assign이 없는 디바이스(젤리빈 이하 예상)의 경우 assign 함수 등록
if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(nextSource);
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
})(window);
