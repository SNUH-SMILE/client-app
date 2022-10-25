/**
 * @file : definition.js
 * @author : 
 * @date : 2017.07.24
 */

var isDev = false;			// 개발 모드 여부

var Definition = {
	SERVER_NAME : "" 		//바라볼 서버 이름 (Manifest.xml에 설정되어있는 이름)
	,UPLOAD_URL : "" 		//upload Url 주소
	,INDICATOR_MSG : "연동중..." //서버통신시 default indicator_msg (mFunction.js에서 사용)
	,INDICATOR : true 			//서버통신시 indicator 여부 (mFunction.js에서 사용)
	,IOS_STORE_ID : "" 
	,YMDFORMAT1 : "YYYY년 MM월 DD일 HH:mm" //날짜 형식
	,YMDFORMAT2 : "YYYY년 MM월"
	,YMDFORMAT3 : "ddd"
	,YMDFORMAT4 : "DD일"
	,YMDFORMAT5 : "YYYY-MM-DD"
	,YMDFORMAT6 : "YYYY.MM.DD HH:mm"
	,YMDFORMAT7 : "YYYY.MM.DD"
	,YMDFORMAT8 : "YYYY/MM/DD"
	,LIST_SIZE : 5
	,PAGE_SIZE : 5
	,DEFAULT_ERROR_MSG : "네트워크 통신 중 오류가 발생했습니다."
	,PAGENAME : {
		"IITP_INTRO_V001"	: "인트로",
		"IITP_LOGIN_V001"	: "로그인",
		"IITP_LOGIN_V002"	: "주민번호 확인",
		"IITP_ID_V001"		: "아이디/비밀번호 찾기",
		"IITP_JOIN_V001" 	: "회원가입",
		"IITP_DEVICE_V001"	: "디바이스 연동",
		"IITP_DEVICE_V002"	: "디바이스 스캔",
	}
	,RES_DEV : "dev"
	,RES_REAL : "real"
};

var Global = {
	pageName : "" 						//현재 페이지 세팅 변수 (setup.js-onReady에서 세팅 함)
//	,folderName : "" 						//현재 페이지 세팅 변수 (setup.js-onReady에서 세팅 함)
	,requestor : {}
};

//운영&개발에 따른 서버 정보 세팅
//별도 개발 서버가 없음..
if(isDev == true) {
	console.log("-------------------------DEV-------------------------");
	Definition.SERVER_NAME = "HTTP_DEV";
	Definition.UPLOAD_URL = M.info.app("manifest.network.http")[Definition.SERVER_NAME].address;
} else {
	Definition.SERVER_NAME = "HTTP_DEV";
	Definition.UPLOAD_URL = M.info.app("manifest.network.http")[Definition.SERVER_NAME].address;
}
	console.log("     SERVER URL: " + Definition.UPLOAD_URL);

//서버 전문 요청 목록
var ServerPath = {
		IDENTITY							: { api : "/api/identity",
												method : "POST",
												token : "N"}, 						//본인 인증
		LOGIN								: { api : "/api/login",
												method : "POST",
                                                token : "N"}, 						//로그인
		PATIENT_DUPLICATOR					: { api : "/api/patient/duplicate",
												method : "POST",
                                                token : "N"}, 						//아이디 중복 확인
		POST_PATIENT						: { api : "/api/patient",
												method : "POST",
                                                token : "N"}, 						//회원가입
        PUT_PATIENT						    : { api : "/api/patient",
                                                method : "PUT",
                                                token : "Y"}, 						//회원정보 수정
		GET_PATIENT							: { api : "/api/getPatient",
												method : "POST",
                                                token : "Y"}, 						//회원 정보 조회
		PATIENTS_FIND_BY_ID					: { api : "/api/patients/findById",
												method : "POST",
                                                token : "N"}, 						//아이디 찾기
		PATIENTS_FIND						: { api : "/api/patients/find",
												method : "POST",
                                                token : "N"}, 						//개인정보 확인
		PATIENT_PASSWORD					: { api : "/api/patient/password",
												method : "PUT",
                                                token : "Y"}, 						//비밀번호 수정
		DEVICE								: { api : "/api/device",
												method : "POST",
                                                token : "Y"}, 						//디바이스 정보 저장
		MAIN								: { api : "/api/main",
												method : "POST",
												token : "Y"}, 						//메인 화면 정보 조회
		MAIN_NOTICE							: { api : "/api/main/notice",
												method : "POST",
												token : "Y"}, 						//신규 알림 여부 조회
		GET_QUARANTINE_STATUS				: { api : "/api/getQuarantineStatus",
												method : "POST",
												token : "Y"}, 						//격리 상태 조회
		GET_QUARANTINE_STATUS				: { api : "/api/quarantineStatus",
												method : "POST",
												token : "Y"}, 						//격리 상태 저장
		GET_RESULTS_BT						: { api : "/api/results/getBt",
												method : "POST",
												token : "Y"}, 						//체온 상세 목록 조회
		GET_RESULTS_BP						: { api : "/api/results/getBp",
												method : "POST",
												token : "Y"}, 						//혈압 상세 목록 조회
		GET_RESULTS_HR						: { api : "/api/results/getHr",
												method : "POST",
												token : "Y"}, 						//심박 상세 목록 조회
		GET_RESULTS_SP_O2					: { api : "/api/results/getSpO2",
												method : "POST",
												token : "Y"}, 						//산소포화도 상세 목록 조회
		GET_RESULTS_STEP_COUNT				: { api : "/api/results/getStepCount",
												method : "POST",
												token : "Y"}, 						//걸음수 상세 목록 조회
		GET_RESULTS_SLEEP_TIME				: { api : "/api/results/getSleepTime",
												method : "POST",
												token : "Y"}, 						//수면시간 상세 목록 조회
		POST_RESULTS_BT						: { api : "/api/results/bt",
												method : "POST",
												token : "Y"}, 						//체온 상세 목록 저장
		POST_RESULTS_BP						: { api : "/api/results/bp",
												method : "POST",
												token : "Y"}, 						//혈압 상세 목록 저장
		POST_RESULTS_HR						: { api : "/api/results/hr",
												method : "POST",
												token : "Y"}, 						//심박 상세 목록 저장
		POST_RESULTS_SP_O2					: { api : "/api/results/spO2",
												method : "POST",
												token : "Y"}, 						//산소포화도 상세 목록 저장
		POST_RESULTS_STEP_COUNT				: { api : "/api/results/stepCount",
												method : "POST",
												token : "Y"}, 						//걸음수 상세 목록 저장
		POST_RESULTS_SLEEP_TIME				: { api : "/api/results/sleepTime",
												method : "POST",
												token : "Y"}, 						//수면시간 상세 목록 저장
        POST_RESULTS_TOTAL	    			: { api : "/api/results/total",
                                                method : "POST",
                                                token : "Y"}, 						//전체 측정결과 저장
}
//유저 유형에 따른  정의
var Type = {
		//유저 유형
		NO_USER 		: "0",	//대상자 아님
		PRIVATE_USER 	: "1", //자가격리 대상자
		PUBLIC_USER 	: "2", //생활치료센터 대상자
		FIRST_RESEARCH_URL : "https://forms.gle/poPyaNshLH5kyDaNA", //초기 문진 url
        MID_RESEARCH_URL : "https://forms.gle/RetTom2eJgyEB5F69", //중간 문진 url
        FINAL_RESEARCH_URL : "https://forms.gle/jQSPYPnHd5w9Gpsx8", //퇴소 문진 url
}

//select tag에서 사용하는 고정 값들
var OptionList = {
		DEVICE_NUM : [{title:"숫자 9+3자리",value:"12"},{title:"숫자 8자리",value:"8"}], //단말기 등록
		STYPE_RGB : ["#5b74c8", "#333c5c", "#e6a524"],
		STYPE_NM : ["깊은 수면", "얕은 수면", "기상"],
}

//Android Upload 통신 시 콜백
var successCallBack;
var errorCallBack;
