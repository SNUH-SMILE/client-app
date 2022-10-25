/**
 * @file : IITP_PW_P002.js 비밀번호 재설정
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
        //전체 앞뒤 공백 삭제, maxLength 체크
        $("input").on("focusout",function(){
             var maxLength = $(this).attr("maxLength");
             var val = $(this).val().trim();
             if(!isEmpty(maxLength)){
                val = val.substring(0,maxLength);
             }
            $(this).val(val);
        });

        $(".confirm").on("click",function(){
            if(isEmpty($("#password").val())){
                MAPI.pop.alert("새 비밀번호를 입력해주세요.");
                return;
            }
            if(isEmpty($("#repassword").val())){
                MAPI.pop.alert("비밀번호 확인을 입력해주세요.");
                return;
            }

            if($("#password").val() == $("#repassword").val()){
                MAPI.pop.alert("동일한 비밀번호를 입력해주세요.");
                return;
            }
            MAPI.net.send(
                ServerPath.PATIENT_PASSWORD,
                {
                    loginId : MAPI.data.param("g","loginId"),
                    password : $("#password").val()
                },
                function(receivedData){
                    if(receivedData.code == '00'){
                        MAPI.page.html("IITP_LOGIN_V001",{loginId : MAPI.data.param("g","loginId")},"CLEAR_TOP",{animation:"NONE"});
                    }else if(receivedData.code == '11'){
                        MAPI.pop.alert("환자정보가 존재하지 않습니다./n회원가입을 진행해 주세요.");
                    }else{
                        MAPI.pop.alert(receivedData.message);
                    }
                },
                function(){
                    MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
                }
            );
        });
	}
};