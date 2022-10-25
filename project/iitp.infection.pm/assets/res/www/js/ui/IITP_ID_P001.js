/**
 * @file : IITP_ID_P001.js 아이디 찾기 결과 표시
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
        $(".block").html(MAPI.data.param("g","patientNm")+'님의<br class="tb_none">아이디는<br><em class="fc-main1"> '+MAPI.data.param("g","loginId")+'</em> 입니다.');
	},
	setEvent : function(){

        $(".confirm").on("click",function(){
            MAPI.page.html("IITP_ID_V001",{type:"P", loginId : MAPI.data.param("g","loginId")},"NO_HISTORY",{animation:"NONE"});
        });

        $(".confirm").on("click",function(){
            MAPI.page.html("IITP_LOGIN_V001",{loginId : MAPI.data.param("g","loginId")},"CLEAR_TOP",{animation:"NONE"});
        });
	}
};