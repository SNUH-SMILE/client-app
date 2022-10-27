var existOpenPopup = function () {
  return $(".pop_flex:not(.none)").length > 0;
};

var existPopupFunc = function () {
  return typeof popup != "undefined";
};

var openPopup = function (page, param, el, func) {
  console.log("==========openPopup[" + page + "]============");
  $.get(
    "../../html/" + page.substring(0, 3) + "/" + page + ".html",
    function (data) {
      //해당 아이디로 layout이 부여된 경우 추가하지 않음
      if ($("[layer-" + page + "]").length == 0) {
        $("body").append(data);
      }
      //		Global.popupPage = page;

      //popup에서 사용할 데이터
      if (!isEmpty(param)) {
        Global.popupData = param;
      }

      if (isEmpty(el)) {
        Global.popupEl = "layer_popup";
      } else {
        Global.popupEl = el;
      }

      if (typeof func == "function") {
        Global.popupSucFunc = func;
      }

      var temp = $("#" + Global.popupEl).addClass("pop_flex");
      temp.attr("layer-" + page, ""); //layer ID 부여

      $(".wrap_pop").fadeIn(100);
      $("#" + Global.popupEl).fadeIn(100);
      $("body").addClass("over_h");
      $("body .wrap .scroll").addClass("over_h");
      scrollHeight = $(".wrap_pop .bg").scrollTop();
      $(".wrap").css({ position: "fixed", top: -scrollHeight });

      if (temp.outerHeight() * 2 < $(document).height())
        //팝업이 높이가 짧은 경우
        temp.css("margin-top", "-" + temp.outerHeight() / 1.3 + "px");
      else if (temp.outerHeight() < $(document).height())
        //팝업 높이가 긴 경우
        temp.css("margin-top", "-" + temp.outerHeight() / 2 + "px");
      else temp.css("top", "0px");

      if (temp.outerWidth() < $(document).width()) {
        /* 2018.11.21 최연주 수정
         * 식단표 화면에서 이미지 클릭시, 이미지가 왼쪽으로 치우치는 부분 수정
         **/
        if (page == "SHN0301" || page == "CMM0100") {
          //temp.css('margin-left', '-'+temp.outerWidth() / 2+'px');
        } else {
          temp.css("margin-left", "-" + temp.outerWidth() / 2 + "px");
        }
      } else temp.css("left", "0px");

      if (typeof popup.init != "undefined") {
        popup.init();
      }
    }
  );
};

var closePopup = function () {
  if ($(".pop_flex:not(.none)").length > 0) {
    console.log("close popup");
    //팝업 하이딩 작업
    $(".wrap_pop").fadeOut(200);
    $("#" + Global.popupEl).fadeOut(200);
    $("body").removeClass("over_h");
    $("body .wrap .scroll").removeClass("over_h");
    $("#" + Global.popupEl).removeClass("pop_flex");
    scrollHeight = $(".wrap_pop .bg").scrollTop();
    $(".wrap").css({ position: "", top: 0 });

    Global.popupData = "";
    Global.popupEl = "";
    Global.popupSucFunc = "";
    popup = function () {};

    $(".wrap_pop").remove();
    $("#push_popup").remove();

    //Back한 효과를 얻기 위한 onRestore 호출
    if (typeof _onRestore != "undefined") {
      _onRestore();
    }
  }
};

//폰 번호 체크
function checkHPNo(HPNo, type) {
  if (HPNo == "09027632474") {
    return true;
  }

  var regExp1 = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
  var regExp2 = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

  var rtnVal = false;

  if (type == "1") {
    rtnVal = regExp1.test(HPNo);
  } else {
    rtnVal = regExp2.test(HPNo);
  }
  return rtnVal;
}

function makeAllDataArr(row) {
  var stepCountList = makeDataArr("step", row.todayStepCountList);
  var sleepList = makeDataArr("sleep", row.todaySleepTimeList);
  var bpList = makeDataArr("bp", row.todayBpList);
  var spList = makeDataArr("sp", row.todaySpO2List);
  var btList = makeDataArr("bt", row.todayBtList);
  var hrList = makeDataArr("hr", row.todayHrList);

  return {
    stepCountList: stepCountList,
    sleepList: sleepList,
    bpList: bpList,
    spList: spList,
    btList: btList,
    hrList: hrList,
  };
}

function makeDataArr(type, rows) {
  var labels = [];
  var data = [];
  //혈압에서만 사용
  var setData = [],
    lowData = [],
    highData = [];
  //수면에서만 사용
  var diffSum = 0,
    diffSum0 = 0,
    diffSum1 = 0,
    diffSum2 = 0;
  var option = {};

  if (isEmpty(rows)) {
    return {};
  }

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (type == "step") {
      if (moment(row.resultTime, "HHmmss", true).isValid()) {
        labels.push(moment(row.resultTime, "HHmmss").format("HH:mm"));
        data.push(row.stepCount);
      }
    } else if (type == "sleep") {
      if (
        moment(
          row.sleepStartDate + row.sleepStartTime,
          "YYYYMMDDHHmmss",
          true
        ).isValid() &&
        moment(
          row.sleepEndDate + row.sleepEndTime,
          "YYYYMMDDHHmmss",
          true
        ).isValid()
      ) {
        var t1 = moment(
          row.sleepStartDate + row.sleepStartTime,
          "YYYYMMDDHHmmss"
        );
        var t2 = moment(row.sleepEndDate + row.sleepEndTime, "YYYYMMDDHHmmss");
        var diff;

        diff = moment.duration(t2.diff(t1)).asMinutes();
        diffSum += diff;
        if (row.sleepType == "0") {
          diffSum0 += diff;
        } else if (row.sleepType == "1") {
          diffSum1 += diff;
        } else if (row.sleepType == "2") {
          diffSum2 += diff;
        }

        labels.push({
          diffSum: diffSum,
          sleepStartTime: t1.format("YYYYMMDDHHmm"),
          sleepEndTime: t2.format("YYYYMMDDHHmm"),
        });
        data.push({
          data: [diff],
          barThickness: 60,
          backgroundColor: OptionList.STYPE_RGB[Number(row.sleepType)],
          hoverBackgroundColor: OptionList.STYPE_RGB[Number(row.sleepType)],
        });
        option = {
          diffSum0: diffSum0,
          diffSum1: diffSum1,
          diffSum2: diffSum2,
        };
      }
    } else if (type == "hr") {
      if (moment(row.resultTime, "HHmmss", true).isValid()) {
        labels.push(moment(row.resultTime, "HHmmss").format("HH:mm"));
        data.push(row.hr);
      }
    } else if (type == "bt") {
      if (moment(row.resultTime, "HHmmss", true).isValid()) {
        labels.push(moment(row.resultTime, "HHmmss").format("HH:mm"));
        data.push(parseFloat(row.bt).toFixed(1));
      }
    } else if (type == "sp") {
      if (moment(row.resultTime, "HHmmss", true).isValid()) {
        labels.push(moment(row.resultTime, "HHmmss").format("HH:mm"));
        data.push(row.spO2);
      }
    } else if (type == "bp") {
      if (moment(row.resultTime, "HHmmss", true).isValid()) {
        labels.push(moment(row.resultTime, "HHmmss").format("HH:mm"));
        lowData.push(row.dbp);
        highData.push(row.sbp);
        setData.push([row.dbp, row.sbp]);
      }
    }
  }

  if (type == "bp") {
    data = {
      lowData: lowData,
      highData: highData,
      setData: setData,
    };
  }

  return {
    labels: labels,
    data: data,
    option: option,
  };
}

//문진에서 사용, 오전 오후 판단
function isAfterNoon() {
  return moment().hour() > 12;
}

//표시할 문진 종류를 판단
function getCheckListType(date1, date2) {
  var loginTimeStr = MAPI.data.storage(
    "g",
    MAPI.data.storage("g", "LOGIN_ID") + "_LOGIN_TIME"
  );
  var loginTime = moment(date1, "YYYYMMDD"); //moment(loginTimeStr,Definition.YMDFORMAT6);
  var today = moment();
  var rtnType = 2; //초기문진만 :1 / 초기 +중간 문진 : 2 / 퇴소 문진만 : 3

  //로그인한 날짜 이후일 경우
  if (loginTime.format("YYYYMMDD") < today.format("YYYYMMDD")) {
    var lastDayStr = date2; //moment(loginTimeStr,Definition.YMDFORMAT6).add(14,'days').format("YYYYMMDD");//MAPI.data.global('g','LAST_DATE');
    //var lastDay = moment(lastDayStr,"YYYYMMDD");
    //퇴소일 당일인 경우
    if (lastDayStr <= today.format("YYYYMMDD")) {
      //퇴소 문진만 보이도록
      rtnType = 3;
    } else {
      //초기+중간 문진 보이도록
      rtnType = 2;
    }
  } else {
    //로그인 당일일 경우
    //오전에 로그인 한 경우
    if (loginTime.hour() < 13) {
      if (today.hour() < 13) {
        //로그인 당일 오전이므로 초기 문진만 보이도록
        rtnType = 1;
      } else {
        //로그인 당일 오후이므로 초기+중간 문진 보이도록
        rtnType = 2;
      }
    } else {
      //오후에 로그인 한 경우
      //로그인 당일 오후이기 때문에 초기 문진만 보이도록
      rtnType = 1;
    }
  }
  return rtnType;
}

function onReceiveAndroidNotification(ns) {
  console.log(ns);
  var data = getPushData(ns);
  var pushArr = MAPI.data.storage("g", "PUSH_RCV_LIST")
    ? MAPI.data.storage("g", "PUSH_RCV_LIST")
    : [];
  if (
    pushArr.length == 0 ||
    (pushArr.length > 0 && data.msgSeq != pushArr[pushArr.length - 1].msgSeq)
  ) {
    pushArr.push(data);
    MAPI.data.storage("s", "PUSH_RCV_LIST", pushArr);
  }
}

function onReceiveNotification(ns) {
  console.log(ns);
  var data = getPushData(ns);
  var pushArr = MAPI.data.storage("g", "PUSH_RCV_LIST")
    ? MAPI.data.storage("g", "PUSH_RCV_LIST")
    : [];
  if (
    pushArr.length == 0 ||
    (pushArr.length > 0 && data.msgSeq != pushArr[pushArr.length - 1].msgSeq)
  ) {
    pushArr.push(data);
    MAPI.data.storage("s", "PUSH_RCV_LIST", pushArr);
  }
  var pageName = location.href.substring(
    location.href.lastIndexOf("html/") + 5,
    location.href.lastIndexOf(".")
  );
  if (pageName != "IITP_ALARM_V001") {
    //        if($(".btn-alim").length > 0){
    //            $(".btn-alim").click();
    //        }
    MAPI.page.html("IITP_ALARM_V001", "", "NEW_SCR");
  } else {
    drawList();
  }
}

function isNewPush() {
  return MAPI.data.storage("g", "PUSH_RCV_LIST").length > 0;
}

function getPushData(ns) {
  var notification = ns.payload; // 수신 메시지 정보
  var status = ns.status; // 수신 시 상태 - ACTIVE/BACKGROUND/START
  var pushType = ns.type; // 수신 푸시 메시지 종류 - UPNS/APNS/GCM

  if ((typeof notification).toLowerCase() == "string") {
    notification = JSON.parse(notification);
  }

  var imageURL = "",
    remoteURL,
    messageUID,
    title = "알림",
    message = "",
    extData = "",
    category = "";
  var pushInfo = M.plugin("push").info();

  notification.ns = pushType;
  notification.status = status;
  notification.saveTime = +new Date();

  // Load Rich Data
  if (pushType === "APNS" || pushType === "GCM") {
    extData = notification.mps.ext;
    message = notification.aps.alert;
  }

  if (extData.indexOf("|") !== -1) {
    var extComponents = extData.split("|");
    category = extComponents[0];
    switch (category) {
      case "0":
        break;

      case "1": // 격리지역 이탈
        remoteURL = extComponents[1];
        break;

      case "2": // 화상진료
        remoteURL = extComponents[1];
        break;
    }
  } else {
    if (pushType === "APNS") {
      title = notification.mps.seqno;
    } else {
      title = notification.SEQNO;
    }
  }
  return {
    status: status,
    notification: notification,
    clientUID: pushInfo["CLIENT_UID"],
    msgSeq: notification.mps.seqno,
    imgURL: imageURL,
    message: message,
    remoteURL: remoteURL,
  };
}

function isConnectDevice() {
  return M.execute("exIsBandConnect") == "T";
  //return false;
}

function fgStart() {
  M.execute("exForeGroundStart");
}

// 체온변화 콜백 함수, 함수명 확정
function onChangeTemp(temp) {
  console.log("temp : " + temp);
  if (typeof _onChangeTemp != "undefined") {
    _onChangeTemp();
  }
}

// 걸음수 변환 콜백 함수, 함수명 확정
function onChangeStep(step, dist) {
  console.log("step / dist : " + step + " / " + dist);
  if (typeof _onChangeStep != "undefined") {
    _onChangeStep();
  }
}

// 10분 심박수 콜백 함수, 함수명 확정
function onChangeRate(rate) {
  console.log("rate : " + rate);
  if (typeof _onChangeRate != "undefined") {
    _onChangeRate();
  }
}

//생체데이터 상세 조회
function detailBodyData(obj) {
  //	var obj = {};
  //	obj.schDate = "20211217";
  //	obj.queryDataType = "STEP";//STEP(걸음정보),SLEEP(수면정보),RATE(심박정보),BLOOD(혈압정보),TEMP(체온정보),OXYGEN(혈중산소포화도 정보)
  //	obj.callback : 'stepDetailResult'

  M.execute("exBodyDetailData", obj);

  // 테스트 코드
  // M.execute('exBodyDetailData', {'schDate':'20211207', 'queryDataType':'OXYGEN', 'callback':'oxygenDetailResult'});
}

//주소로 위,경도 찾기
function codeAddress(addr, callback) {
  var geocoder = new google.maps.Geocoder();
  var address = addr;
  geocoder.geocode({ address: address }, callback);
}

//두 위치 사이 거리 계산
var calcDistance = function (p1LatLng, p2LatLng) {
  return google.maps.geometry.spherical
    .computeDistanceBetween(p1LatLng, p2LatLng)
    .toFixed(2); //미터 단위로 반환
};

//두 위치 사이 거리 계산
function getDistanceFromLatLon(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lng2 - lng1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 100; //m로 변환
}
