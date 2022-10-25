/**
 * @file : IITP_LOGIN_V001.js 로그인 화면
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};
var _onRestore = function(){
	init.setView();
};

var init = {
	setView : function(){
		if(!isEmpty(MAPI.data.storage("g","LOGIN_ID"))){
			 $("#loginId").val(MAPI.data.storage("g","LOGIN_ID"));
		}
		if(!isEmpty(MAPI.data.param("g","loginId"))){
             $("#loginId").val(MAPI.data.param("g","loginId"));
             MAPI.data.param("r","loginId");
        }
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
        })
		$("#loginBtn").on('click',function(){
		    if(isEmpty($("#loginId").val())){
		        MAPI.pop.alert("아이디를 입력해주세요.");
		        return;
		    }
		    if(isEmpty($("#password").val())){
                MAPI.pop.alert("비밀번호를 입력해주세요.");
                return;
            }
//
//		    var USER_ARR = isEmpty(MAPI.data.storage("g","JOIN_USER_ARR")) ? [] : MAPI.data.storage("g","JOIN_USER_ARR");
//		    var isAbleLogin = false;
//		    var password = "";
//		    var loginUserInfo = {};
//            if(USER_ARR.length > 0){
//                for(var i = 0; i < USER_ARR.length; i++){
//                    if(USER_ARR[i].loginId == $("#loginId").val()){
//                        isAbleLogin = true;
//                        password = USER_ARR[i].password;
//                        loginUserInfo = USER_ARR[i];
//                        break;
//                    }
//                }
//            }else{
//                MAPI.pop.alert("가입된 사용자가 없습니다.");
//                return;
//            }
//            if(isAbleLogin && (password == $("#password").val())){
            //로그인
            MAPI.net.send(
                ServerPath.LOGIN,
                {
                    loginId : $("#loginId").val(),
                    password : $("#password").val()
                },
                function(receivedData){
                    if(receivedData.code == '00'){
                        M.plugin('push').remote.registerServiceAndUser({
                            cuid: $("#loginId").val(), //사용자의 id
                            name: $("#loginId").val(), //사용자의 id 혹은 이름 등 식별 가능한 것
                            callback: function( result ) {
                                var info = M.plugin('push').info();

                                //푸시 등록 성공 여부를 확인하는 부분
                                if (result.status == 'SUCCESS' || wnIf.device == DT_IOS) {
                                    console.log('[' + info.CLIENT_UID + '/' + info.CLIENT_NAME + ']의 서비스/유저 등록을 성공 하였습니다.');

                                    MAPI.data.storage("s","LOGIN_ID",$("#loginId").val());
                                    MAPI.data.storage("s","USERTOKEN",receivedData.token);
                                    //로그인 한 아이디에 해당하는 로그인 시간 없을 때만
                                    if(isEmpty(MAPI.data.storage("g",MAPI.data.storage("g","LOGIN_ID")+"_LOGIN_TIME"))){
                                        MAPI.data.storage("s",MAPI.data.storage("g","LOGIN_ID")+"_LOGIN_TIME",moment().format(Definition.YMDFORMAT6));
                                        MAPI.pop.alert("초기 문진을 작성해주세요.",function(){
                                            var url = Type.FIRST_RESEARCH_URL;
                                            MAPI.apps.browser(url);
                                        });
                                    }else{
                                        if(isConnectDevice()){
                                             MAPI.page.html("IITP_MAIN_V001",{updateTime : (+ new Date())},"CLEAR_TOP");
                                            //getServerAllData();
                                        }else{
                                            //기기연동 화면으로 이동
                                            MAPI.page.html("IITP_DEVICE_V001",{resetType : /*"0"*/ "2"},"CLEAR_TOP"); //TODO: 나중에 타입 0으로 바꿀 것, 서버 붙인 이후에 작업
                                        }
                                    }
                                }else{
                                    MAPI.pop.alert('[' + $("#loginId").val() + ']의 푸시 서비스/유저 등록을 실패 하였습니다.');
                                }
                            }
                        });
                    }else if(receivedData.code == '10'){
                        MAPI.pop.alert("비밀번호가 일치하지 않습니다./n다시 입력해 주세요.");
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
//            }
        });
		
		$("#findBtn").on('click',function(){
			//아이디,패스워드 찾기
			MAPI.page.html("IITP_ID_V001","","NO_HISTORY");
		});
		
		$("#joinBtn").on('click',function(){
			//회원가입
			MAPI.page.html("IITP_JOIN_V001","","NEW_SCR");
		});
	}
};

function getServerAllData(){
	M.execute('getServerAllData',"serverAllResult");
}
function serverAllResult(result){
    // 서버 전송 후 메인 이동, 그래야 메인에서 바로 API 조회로 내용 조회 가능
    result.loginId = MAPI.data.storage("g","LOGIN_ID");
    MAPI.net.send(
        ServerPath.POST_RESULTS_TOTAL,
        result,
        function(receivedData){
            if(receivedData.code == '00'){
                MAPI.page.html("IITP_MAIN_V001",{updateTime : (+ new Date())},"CLEAR_TOP");
            }else{
                MAPI.pop.alert(receivedData.message);
            }
        },
        function(){
            MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
        }
    );
}
