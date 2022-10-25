/**
 * @file : IITP_DEVICE_V002.js 기기 스캔 화면
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
		Global.type = MAPI.data.param("g","type");
		Global.resetType = MAPI.data.param("g","resetType");
		bandScan(Global.type);
	},
	setEvent : function(){
		$("#deviceList").on("click","li",function(){
			var that = $(this);
			bandItemClick(that.data("dvcid"),that,that.data("dvcnm"));
		});
		
		$("#okBtn").on("click",function(){
		    MAPI.net.send(
                ServerPath.DEVICE,
                {
                    loginId : MAPI.data.storage("g","LOGIN_ID"),
                    devices : [
                        {
                            deviceId : Global.deviceId,
                            deviceNm : Global.deviceNm
                        }
                    ]
                },
                function(receivedData){
                    if(receivedData.code == '00'){
                        for(var i = 0; i < deviceUseHistoryList.length; i++){
                            var device = deviceUseHistoryList[i];
                            if(device.code == 01){
                                //TODO: 디바이스 사용 이력 있을 경우 디바이스 초기화

                            }
                            MAPI.data.storage("s","SAVE_DEVICE_ID",Global.deviceId);
                            MAPI.page.back({type : Global.type, result : "SUCCESS"});
                        }
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

function bandScan(type){
	var obj = {};
	obj.schBluetooth = type;
	obj.callback = "scanResult";
	$(".popup-wrap").addClass("show");
	M.execute('exBandScan',obj);
}

function scanResult (result){
	$(".popup-wrap").removeClass("show");
	var strbuffer = "";
	if(result.list.length > 0){
		for(var i=0; i<result.list.length; i++){
			strbuffer += '<li class="device-connect-wrap" data-dvcid="'+result.list[i].deviceId+'" data-dvcnm="'+result.list[i].deviceNm+'">';
			strbuffer +=	'<p>'+result.list[i].deviceNm+'</p>';
//			if(MAPI.data.storage("g","SAVE_DEVICE_ID") == result.list[i].deviceId){
//    			strbuffer +=    '<button type="button" class="btn-rnd line small" disabled>완료</button>';
//			}else{
	    		strbuffer +=    '<button type="button" class="btn-rnd line small">연결하기</button>';
//			}
			strbuffer += '</li>';
		}
	}else{
		strbuffer = '<li class="device-connect-wrap"><p>조회된 디바이스가 없습니다.</p></li>';
	}

	$("#deviceList").html(strbuffer);

	if($(".btn-rnd.line:disabled").length > 0){
	    $("#okBtn").prop('disabled',false);
	}else{
	    $("#okBtn").prop('disabled',true);
	}
}

function bandItemClick(addr,_this,deviceNm){
	var obj = {};
	obj.schBluetooth = Global.type;
	obj.bandAddr = addr;
	//로그인 에서 왔을 때는 디바이스, 디비를 초기화 하고, 설정 메뉴를 통해서 들어왔을 때는 초기화 없이 사용한다.
	obj.resetType = Global.resetType; // resetType - 0 : 디바이스/디비 초기화 , 1 : 디바이스 초기화 , 2 : 초기화 없음
	obj.callback = M.response.on(function(result){
        if(result.code == "0000"){
            _this.find("button").prop("disabled",true).text("완료");
            MAPI.data.storage("s","IS_SAVE_DEVICE","Y");
            MAPI.data.storage("s","SAVE_DEVICE_ID",addr);
            Global.deviceId = addr;
            Global.deviceNm = deviceNm;
            $("#okBtn").prop('disabled',false);
        }else{

        }
	}).toString();
	if(isConnectDevice()){
	    M.execute("exBandDisconnect");
	}
	M.execute('exBandConnect',obj);
}
function connectResult(result){

	//connect 성공 code = 0000, message = SUCCESS

    console.log(result);
}