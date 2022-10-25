/**
 * @file : IITP_SETTING_V002.js 회원정보 수정
 * @author :choiyj
 * @date : 2021.11.30
 */


var _onReady = function(){
	init.setView();
	init.setEvent();
};

var init = {
	setView : function(){
	    $("#loginId").text(MAPI.data.storage("g","LOGIN_ID"));
        MAPI.net.send(
            ServerPath.GET_PATIENT,
            {
                loginId : $("#loginId").text()
            },
            function(receivedData){
                if(receivedData.code == '00'){
                    $("#patientNm").text(receivedData.patientNm);
                    $("#birthDate").text(moment(receivedData.birthDate,"YYYYMMDD").format(Definition.YMDFORMAT7));
                    $("input[name=gender][value="+receivedData.sex+"]").prop("checked",true);
                    $("#cellPhone").val(receivedData.cellPhone);
                    $("#guardianCellPhone").val(receivedData.guardianCellPhone);
                    $("#address01").val(receivedData.address1).data("zipCode",receivedData.zipCode);
                    $("#address02").val(receivedData.address2);
                }else if(receivedData.code == '11'){
                    MAPI.pop.alert("해당 로그인 아이디가 존재하지 않습니다.");
                }else if(receivedData.code < '99'){
                    MAPI.pop.alert(receivedData.message);
                }else{
                    MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
                }
            },
            function(){
                MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
            }
        );
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
            if(isValid()){
                $("#joinSaveBtn").prop("disabled",false);
            }
        });

        //주소검색 버튼
        $("#srchBtn, #address01").on("click",function(){
            addrSch();
        });

        $("#cancelBtn").on("click",function(){
            $(".popup-wrap").removeClass("show");
        });

        $("#joinSaveBtn").on("click",function(){
            var saveData = {
                loginId :  $("#loginId").text(),
                cellPhone : $("#cellPhone").val(),
                guardianCellPhone : $("#guardianCellPhone").val(),
                zipCode : $("#address01").data('zipCode'),
                address1 : $("#address01").val(),
                address2 : $("#address02").val()
            }
            MAPI.net.send(
                ServerPath.PUT_PATIENT,
                saveData,
                function(receivedData){
                    if(receivedData.code == '00'){
                        MAPI.pop.alert(receivedData.message,function(){MAPI.page.back();});
                    }else if(receivedData.code == '11'){
                        MAPI.pop.alert("해당 로그인 아이디가 존재하지 않습니다.");
                    }else if(receivedData.code < '99'){
                        MAPI.pop.alert(receivedData.message);
                    }else{
                        MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
                    }
                },
                function(){
                    MAPI.pop.alert(Definition.DEFAULT_ERROR_MSG);
                }
            );
        });
	}
};

function isValid(){
    if(isEmpty($("#cellPhone").val())){
        //MAPI.pop.alert("휴대폰번호를 입력하세요.");
        return false;
    }
    if(isEmpty($("#guardianCellPhone").val())){
        //MAPI.pop.alert("휴대폰번호를 입력하세요.");
        return false;
    }
    if(isEmpty($("#address01").val())){
        //MAPI.pop.alert("주소를 입력하세요.");
        return false;
    }

    return true;
}

function addrSch(){
    var element_layer = document.querySelector('#pop-bd');
    $(".popup-wrap").addClass("show");
    new daum.Postcode({
        oncomplete: function(data) {
             // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수(도로명으로 선택하는 경우 조합된 항목을 주소 뒤에 붙여 주기 위한 변수)

            //도로명 주소로 해당 주소 값을 가져온다.
            //if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            //}
//            else { // 사용자가 지번 주소를 선택했을 경우(J)
//                addr = data.jibunAddress;
//            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            //if(data.userSelectedType === 'R'){
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if(extraAddr !== ''){
                    extraAddr = ' (' + extraAddr + ')';
                }
//            } else {
//                extraAddr ="";
//            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            $("#address01").val(addr + extraAddr).data('zipCode',data.zonecode);
            codeAddress($("#address01").val(), function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0]['geometry']['location']['lat']();
                    var lng = results[0]['geometry']['location']['lng']();
                    console.log($("#address01").val()+"의 위도는 " + lat + " 이며, 경도는" + lng + " 입니다.");
                    $("#address01").data('lat',lat).data('lng',lng);
//                    MAPI.data.storage("s","ADDR_LAT_LNG",{lat:lat,lng:lng});
                    if(isValid()){
                        $("#joinSaveBtn").prop("disabled",false);
                    }
                } else {
                    alert('Geocode was not successful for the followingreason: ' + status);
                }
            });

            // 팝업 닫기
            $(".popup-wrap").removeClass("show");
        },
        width : '100%',
        height : '100%',
        maxSuggestItems : 5,
        hideMapBtn : true,
        hideEngBtn : true
    }).embed(element_layer);
    // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
    initLayerPosition(element_layer);
}


// 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
// resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
// 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
var initLayerPosition = function(element_layer){
    var width = 100; //우편번호서비스가 들어갈 element의 width
    var height = 400; //우편번호서비스가 들어갈 element의 height
    var borderWidth = 0; //샘플에서 사용하는 border의 두께

    // 위에서 선언한 값들을 실제 element에 넣는다.
    element_layer.style.width = width + '%';
    element_layer.style.height = height + 'px';
    element_layer.style.border = borderWidth + 'px solid';
    // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
    element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
    element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
}