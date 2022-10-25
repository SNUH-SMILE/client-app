/**
 * @file : IITP_SETTING_V001.js 설정
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
	    if(wnIf.device == DT_ANDROID){
	        $("#watchLangKorean").closest("li").removeClass("none");
	        $("#watchLangKorean").prop("checked",getLang());
	    }
        if(!isConnectDevice()){
            $("#disconnectBtn").parent().addClass("none");
        }
        $("#version span").text("버전 : "+M.info.app("app").version);
	},
	setEvent : function(){
        $("#watchLangKorean").on("change",function(){
            if(!$(this).prop("checked")){
                MAPI.pop.alert("한국어로 설정하는 것만 가능합니다.");
                $(this).prop("checked",true);
            }else{
                setLang();
            }
        });
        $("#updateInfoBtn").on("click",function(){
            MAPI.page.html("IITP_SETTING_V002","","NEW_SCR");
        });
        $("#disconnectBtn").on("click",function(){
            MAPI.pop.confirm("디바이스 연결을 끊으면 다음 로그인 시 다시 연결해야 합니다.",
                function(){
                    M.execute("exBandDisconnect");
                    $("#disconnectBtn").parent().addClass("none");
                },"");
        });

        $("#logoutBtn").on("click",function(){
            MAPI.pop.confirm("로그아웃 하시겠습니까?",
                            function(){MAPI.page.html("IITP_LOGIN_V001");},"");

        });
	}
};

function getLang(){
    return M.execute("exWNGetBandLang") == 3; //한국어 3
}

function setLang(){
    M.execute("exWNSetBandLang",3);
}