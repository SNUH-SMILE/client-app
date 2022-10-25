/**
 * @file : IITP_LOGIN_V002.js 주민등록번호 인증 화면
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
		$("#confirmBtn").on('click',function(){
			var ssn = $("#ssnInput").val();
			if(ssn.length != 13){
			    MAPI.pop.alert("주민등록번호 13자리를 입력하여 주세요.");
			    return;
			}
            //주민번호정규식
            var juminRule=/^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))[1-4][0-9]{6}$/;

            if(!juminRule.test(ssn)) {
                MAPI.pop.alert("주민등록번호가 올바르지 않습니다.");
                return;
            }

            if(!$("#ssnCheckbox").prop("checked")){
                MAPI.pop.alert("개인정보 수집 동의 해주세요");
                return;
            }
            MAPI.data.storage("s","IS_SAVE_SSN",'Y');
			//로그인
            MAPI.page.html("IITP_LOGIN_V001","","CLEAR_TOP");

//			MAPI.net.send(
//				ServerPath.IDENTITY,
//				{
//
//				},
//				function(receivedData){
//					if(receivedData.code == '200'){
//						MAPI.data.storage("s","LOGIN_ID",$("#idInput").val());
//
//						//기기 연동 기록 있을 경우
//						if(MAPI.data.storage("g","IS_SAVE_DEVICE") == 'Y'){
//							//메인 화면으로 이동
//							MAPI.page.html("IITP_MAIN_V001","","NEW_SCR");
//						}else{
//							//기기연동 화면으로 이동
//							MAPI.page.html("IITP_DEVICE_V001","","NEW_SCR");
//						}
//					}else if(receivedData.code == '403'){
//						MAPI.pop.alert("아이디 또는 비밀번호가 일치하지 않습니다./n다시 입력해 주세요.");
//					}
//				},
//				function(){
//					MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
//				}
//			);
		});
	}
};