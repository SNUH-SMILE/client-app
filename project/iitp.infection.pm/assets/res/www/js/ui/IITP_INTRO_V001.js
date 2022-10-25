/**
 * @file : IITP_INTRO_V001.js 인트로
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
		//Manifest.xml의 target 정보를 확인해 리소스 업데이트를 사용하는지 아닌지를 분기처리한다.
		if(M.info.app("manifest.resource.target") == "app"){ //리소스 업데이트 하지 않을 경우
			var ms = 500;
			if(isConnectDevice()){
			    ms = 5500;
			}
			setTimeout(function(){
				// 리소스 업데이트 SUCCESS 케이스의 결과와 동일하게 작성
				moveToMain();
			},ms);
		}else{                                               //리소스 업데이트 하는 경우
			// 리소스 업데이트 요청
			M.net.res.update({
				finish: function(result, info, option){
					console.log(result);
					switch(result){
					case "SUCCESS": // 성공
					case "SUCCESS_AND_REFRESH":    
						moveToMain();
						break;
					case "RECOMMENDED_APP_UPDATING" :  // 앱 권장 업데이트
					case "FORCED_APP_UPDATING" :
						MAPI.pop.confirm(
								"업데이트된 앱이 있습니다.<br>업데이트 하시겠습니까?",
								function(){
									var appUrl = info.app_version_info.download_market_url;
									M.apps.browser(appUrl);
									setTimeout(function(){M.sys.exit();}, 200);
								},
								function(){ M.sys.exit(); }
						);
						break;
					case "LICENSE_IS_NOT_EXISTENCE": // 라이센스 체크 오류
						MAPI.pop.confirm(
								"라이센스 파일 검사 중 오류가 발생하였습니다. 라이센스 파일을 확인해 주시기 바랍니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
						break;
					case "BROKEN_INTEGRITY_OF_LICENSE": // 라이센스 무결성 회손
						MAPI.pop.confirm(
								"라이센스 파일이 원본과 다릅니다. 라이센스 파일을 확인해 주시기 바랍니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:[ "재시도", "종료"] }
						);
						break;
					case "EXPIRED_LICENSE": // 라이센스 기간 만료
						MAPI.pop.confirm(
								"라이센스 기간이 만료되었습니다. 라이센스 파일을 확인해 주시기 바랍니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:[ "재시도", "종료"] }
						);
						break;
					case "WNINTERFACE_DECRYPTION_ERROR": // 인터페이스 파일 복호화 오류
						MAPI.pop.confirm(
								"인터페이스 파일 복호화 도중 오류가 발생했습니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
						break;
					case "INSUFFICIENT_MEMORY": // 설치 메모리 부족
						MAPI.pop.confirm(
								"프로그램을 설치 할 수 있는 메모리가 부족합니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
						break;
					case "EXT_MEM_NOT_AVAIL": // 외장 메모리 카드 사용 오류
						MAPI.pop.confirm(
								"외장 메모리 카드를 사용 할수 없습니다. 외장 메모리카드를 확인해주시기 바랍니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
						break;
					default:
						MAPI.pop.confirm(
								"프로그램 초기화 및 리소스 업데이트 중 오류가 발생하였습니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
					break;
					}
				},
				progress : function(totalSize, readSize, remainingSize, percentage){
					$(".bar").css("width", percentage + '%');
					$(".numb").html(percentage + "%");
				},
				error: function(errorCode, errorMessage, setting) {
					console.log(errorCode, errorMessage);
					if(errorCode == 905){ 	//리소스가 하나도 배포 되어있지 않는 경우
						moveToMain();
					}else if(errorCode == 9996){
						MAPI.pop.confirm(
								"네트워크 요청시간을 초과하였습니다.<br>다시 시도하려면 ‘재시도＇를<br>선택하시고 어플리케이션을<br>종료하려면 ‘종료＇버튼을 선택해주세요.",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
					}else{
						MAPI.pop.confirm(
								"프로그램 업데이트 중에 오류가 발생하였습니다.<br><br>다시 시도하시겠습니까?",
								function(){ M.sys.exit(); },
								function(){ M.net.res.retry(); },
								{ buttons:["재시도", "종료"] }
						);
					}
				}
			});
		}
		
	},
	setEvent : function(){

	}
};

var _onRestore = function(){
    moveToMain();
}

function moveToMain(){
    if(MAPI.data.global("g","type") == "GCM" && MAPI.data.global("g","status") == "START"){
        var ns = MAPI.data.global("g");
        MAPI.data.global("r");
        onReceiveNotification(ns);
        return;
    }
    //로그인 화면 이동
    MAPI.page.html("IITP_LOGIN_V001");
}
