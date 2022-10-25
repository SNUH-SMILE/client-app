/**
 * @file : IITP_DEVICE_V001.js 기기 연결 화면
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
		
	},
	setEvent : function(){
		$("#deviceScanBtn").on("click",function(){
			MAPI.page.html("IITP_DEVICE_V002",{type : "C", resetType : MAPI.data.param("g","resetType")},"NEW_SCR"); //기존 기기
		});
		$("#okBtn").on("click",function(){
		    if(MAPI.data.param("g","backPageFlag") == "T"){
		        MAPI.page.back();
		    }else{
		        MAPI.page.html("IITP_MAIN_V001",{updateTime : (+ new Date())},"NEW_SCR");
		    }
        });
	}
};

var _onRestore = function(){
	var param = MAPI.data.param("g");
	if(param.result == "SUCCESS"){
        $("#okBtn").prop("disabled",false);
	}
};