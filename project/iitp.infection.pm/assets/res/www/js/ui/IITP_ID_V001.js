/**
 * @file : IITP_ID_V001.js 아이디 찾기
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
        if(!isEmpty(MAPI.data.param("g","type"))){
            if(MAPI.data.param("g","type") == "P"){ //비밀번호 변경 화면으로 이동
                $(".tab li").eq(1).click();
            }
        }
	},
	setEvent : function(){
        $(".tab li").on("click",function(){
            $(".tab li").removeClass("on");
            $(this).addClass("on");
            if($(".tab li.on").index() == 1){
                $("#idWrap").removeClass("none");
                $("#findIDBtn").addClass("none");
                $("#findPWBtn").removeClass("none");
            }else{
                $("#idWrap").addClass("none");
                $("#findIDBtn").removeClass("none");
                $("#findPWBtn").addClass("none");
            }
        });

        //전체 앞뒤 공백 삭제, maxLength 체크
        $("input").on("focusout",function(){
             var maxLength = $(this).attr("maxLength");
             var val = $(this).val().trim();
             if(!isEmpty(maxLength)){
                val = val.substring(0,maxLength);
             }
            $(this).val(val);
        });

        $("#findIDBtn, #findPWBtn").on("click",function(){
            var isFindId = true;
            if($(this).attr("id") == "findPWBtn"){
                isFindId = false;
            }

            if(isEmpty($("#patientNm").val())){
                MAPI.pop.alert("성명을 입력해주세요.");
                return;
            }
            if(isEmpty($("#cellPhone").val())){
                MAPI.pop.alert("휴대폰 번호를 입력해주세요.");
                return;
            }

            if(!isFindId){
                if(isEmpty($("#loginId").val())){
                    MAPI.pop.alert("아이디를 입력해주세요.");
                    return;
                }
                MAPI.net.send(
                    ServerPath.PATIENTS_FIND,
                    {
                        loginId : $("#loginId").val(),
                        patientNm : $("#patientNm").val(),
                        cellPhone : $("cellPhone").val()
                    },
                    function(receivedData){
                        if(receivedData.code == '00'){
                            if(receivedData.existYn == "Y"){ // 유저 정보 있을 경우
                                MAPI.page.html("IITP_PW_P002",{loginId :  $("#loginId").val()},"NEW_SCR",{animation:"NONE"});
                            }else{
                                 MAPI.pop.alert("환자정보가 존재하지 않습니다.");
                            }
                        }else{
                            MAPI.pop.alert(receivedData.message);
                        }
                    },
                    function(){
                        MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
                    }
                );
            }else{
                MAPI.net.send(
                    ServerPath.PATIENTS_FIND_BY_ID,
                    {
                        patientNm : $("#patientNm").val(),
                        cellPhone : $("cellPhone").val()
                    },
                    function(receivedData){
                        if(receivedData.code == '00'){
                            MAPI.page.html("IITP_ID_P001",{loginId : receivedData.loginId, patientNm : $("#patientNm").val()},"NEW_SCR",{animation:"NONE"});
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
            }
        });
	}
};