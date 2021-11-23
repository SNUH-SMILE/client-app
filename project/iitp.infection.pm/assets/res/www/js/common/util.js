/**
 * 공통적으로 사용할 Util 함수들을 정의한다.
 **/

/**
 * 값의 존재 여부 확인
 */
var isEmpty = function (obj) {

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	if (typeof obj == "number") obj = obj+"";

    if (obj == null) return true;
    if (obj == undefined) return true;
    if (obj == "undefined") return true;

    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
};
/*
 * 값이 존재하지 않으면 특정 값으로 정의한다.
 */
var isEmptyStr = function (obj, str){
    var resultStr = str || "";
    if(isEmpty(obj)){//값이 존재하지 않으면 사용자가 정의한 스트링으로 대처
        return resultStr;
    }else{//값이 존재하면 해당 값으로
       return obj;
    }
}

/*
* html 내의 찾고자 하는 Tag가 존재하는지 확인한다.
* param : 찾고자하는 tag의 class형태 및 id형태
*         예제: class를 찾고자하면 ".class"명 / id로 찾고자하면 "#id"명
*/
var isHtmlTag = function(tag){
    if($(tag).length > 0){
        return true;
    }else{
        return false;
    }
}
/**
 * @function
 * 한자리 수일경우 앞에 0을 붙여 두자리 문자열로 반환
 * @param {string | integer} num
 * @return {string | integer} 결과 값
 */
var digitNum=function(num){
    var num = parseInt(num);
    if(num<10){
        num = "0"+num;
    }

    return num;
}
/**
* @function
* 규약한 format에 맞추어 날짜 정보 반환 : YYYY.MM.DD
* @param {string} dateStr
* @return {string} 변환한 시간 정보 반환
*/
var getFormatDateStr=function( dateStr ,format){
    var resultDate = "";
    if(isEmpty(dateStr)){
       resultDate = "";
    }else{
        //str YYYYMMDD
        var length = dateStr.length;
        if(isEmpty(format)){
            resultDate = dateStr;
            return resultDate;
        }
        if(length > 6){
            if(length>8){
                if(length>12){
                    resultDate = digitNum(dateStr.substr(0,4)) + format + digitNum(dateStr.substr(4,2)) + format + digitNum(dateStr.substr(6,2)) + " " + digitNum(dateStr.substr(8,2)) + ":" + digitNum(dateStr.substr(10,2)) + ":" + digitNum(dateStr.substr(12,2));
                }else{
                    resultDate = digitNum(dateStr.substr(0,4)) + format + digitNum(dateStr.substr(4,2)) + format + digitNum(dateStr.substr(6,2)) + " " + digitNum(dateStr.substr(8,2)) + ":" + digitNum(dateStr.substr(10,2));
                }
            }else{
                resultDate = digitNum(dateStr.substr(0,4)) + format + digitNum(dateStr.substr(4,2)) + format + digitNum(dateStr.substr(6,2));
            }
        }else{
            resultDate = digitNum(dateStr.substr(0,4)) + format + digitNum(dateStr.substr(4,2));
        }
    }
    return resultDate;
}

/**
* @function
* 규약한 format에 맞추어 날짜 정보 반환 : YYYY년 MM월 DD일 hh시 mm분
* @param {string} dateStr
* @return {string} 변환한 시간 정보 반환
*/
var getFormatDateTimeStr = function( dateStr ){
    //str YYYYMMDDhhmm
    var result = "" ;
    if(!isEmpty(dateStr)){
        if(dateStr.length > 8){
            result = digitNum(dateStr.substr(0,4))+"년 "+digitNum(dateStr.substr(4,2))+"월 "+digitNum(dateStr.substr(6,2))+"일 "+digitNum(dateStr.substr(8,2))+"시 "+digitNum(dateStr.substr(10,2))+"분";
        }else{
            result = digitNum(dateStr.substr(0,4))+"년 "+digitNum(dateStr.substr(4,2))+"월 "+digitNum(dateStr.substr(6,2))+"일";
        }
    }
    return result;
}

/*
* JSON array에서 특정 값이 존재하는지 확인 함수
* param [array] : 찾고자하는 json array
* param [key]   : 찾고자하는  key값
* param [value]   : 찾고자하는  value값
* return : 값존재하면 true , 존재하지 않으면 false
*/
var jsonArrayChk = function(array,key,value){
    var result = false;
    var isArray = array;
    if(Utils.isEmpty(isArray)){
        isArray = [];
    }
    $.each(isArray,function(idx,row){
        if(isArray[idx][key] == value){
           result = true;
           return false;
        }else{
            result = false;
        }
    });
    return result;
}
/*
* JSON array에서 특정 값이 존재하면 해당 값 반환
* param [array] : 찾고자하는 json array
* param [key]   : 찾고자하는  key값
* param [value]   : 찾고자하는  value값
* return : 값존재하면 해당 array위치의 json반환 , 존재하지 않으면 false
*/
var jsonArraySelect = function(array,key,value){
    var result = false;
    $.each(array,function(idx,row){
        if(array[idx][key] == value){
           result = array[idx];
            return false;
        }else{
            result = false;
        }
    });
    return result;
}
/*
* JSON array에서 특정 값이 존재하면 해당 값들 배열로 담아서 반환
* param [array] : 찾고자하는 json array
* param [key]   : 찾고자하는  key값
* param [value]   : 찾고자하는  value값
* return : 값존재하면 해당 array위치의 json반환 , 존재하지 않으면 빈값
*/
var getJsonArrayChk = function(array,key,value){
   var result = new Array();
   $.each(array,function(idx,row){
       if(array[idx][key] == value){
          result.push(array[idx]);
       }
   });
   return result;
}
//현재의 날짜와 전달 받은 날짜의 차이가 특정 시간 이내인지...체크하는 함수
var timeCheck = function (dt,checkTime) {
    var min = 60 * 1000;
    var c = new Date()
    var d = new Date(dt);
    var minsAgo = Math.floor((c - d) / (min));
    var result = false;
    if (minsAgo < 60 * checkTime) { // 12시간 이내인 경우
        result = true;
    }else{
        result = false;
    }
    return result;
}

//input 입력 글자수 제한
var maxLengthCheck = function(tagThis){
    if(tagThis.value.length > tagThis.maxLength) {
        MPopup.instance(tagThis.maxLength + ' 자 이상 입력하실 수 없습니다.');
        tagThis.value = tagThis.value.slice(0, tagThis.maxLength);

    }
}

/**
 * 숫자만 입력
 * @param id (input #id)
 * @returns
 */
var onKeyupNum = function(id){
//    var this_id = document.getElementById(id);

    id.on("keyup", function(event){
        event = event || window.event;
        var _val = this.value.trim();
        this.value = extractNumber(_val);
    });
}

/**
 * 숫자만 추출
 * @param str
 * @returns
 */
var extractNumber = function(str) {
    try {
        return str.replace(/[^0-9]/g, '');
    } catch (e) {
        return str;
    }
};