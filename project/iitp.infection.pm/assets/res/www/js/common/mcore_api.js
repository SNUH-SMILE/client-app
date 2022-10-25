/**
 * Core Api
 */
/**
 * @file : mFunctions.js
 * @author : 
 * @date : 2017.07.24
 */

var exitCount = 0;

var MAPI = {
		page : {
			/**
			 * 모피어스 페이지 이동 함수
			 * @param _page 이동할 페이지명
			 * @param _param 이동시 데이터 값
			 * @param _action 이동시 액션 값
			 * @param _option 이동시 옵션 값
			 */
			html : function( _page, _param, _action, _option ){
				var option = isEmpty(_option) ? {} : _option;
				if(!isEmpty(_param)) option.param = _param;
				else option.param = {};

				if(!isEmpty(_action)) option.action = _action;
				else option.action = "CLEAR_TOP";

				M.page.html(_page + ".html", option);
			},

			/**
			 * 모피어스 이전 화면으로 이동하는 함수
			 * @param _param 이동시 옵션 값
			 * @param _option 이동시 옵션 값
			 */
			back : function( _param, _option ){
				//COMM SIDEMENU가 있는 경우 SIDEMENU 닫아주는 로직 추가
				if(existOpenPopup()){
					closePopup();
				}else if(M.info.stack().length <= 1){ 		//stack이 하나만 남아있는 경우 앱 종료 컨펌창
					var currentPage = location.href.substring( location.href.lastIndexOf("html/")+5, location.href.lastIndexOf(".") );
					if(currentPage == "IITP_ALARM_V001"){ //알람이 제일 마지막 화면인 경우는 푸시 노티 클릭해 실행한 경우 밖에 없음
					    //로그인 화면 이동
                        MAPI.page.html("IITP_LOGIN_V001");
					}else{
					    if(exitCount == 0){
                            M.pop.instance({
                                message: '뒤로 버튼을 한번 더 누르시면 종료됩니다.',
                                time: 3000
                            });
                        }
                        exitCount++;
                        if(exitCount == 2){
                            M.sys.exit();
                        }
                        setTimeout(function (){exitCount = 0},3000);
					}
				}else{
					var option = isEmpty(_option) ? {} : _option;
					if(!isEmpty(_param)) option.param = _param;
					else option.param = {};
					if(isEmpty(option.animation)) option.animation = "";

					M.page.back(option);
				}
			},
			/**
			 * User function
			 * Back 이벤트르 임의로 막기 위함.
			 * @param second 시간(초)
			 */
			backFlag : function(second){
				if(!Global.clickBack){
					Global.clickBack = true;
					setTimeout(function(){
						Global.clickBack = false;
					}, second || 250);
					return true;
				}else{
					return false;
				}
			},
			/**
			 * 모피어스 페이지 이동 함수 (NATIVE)
			 * @param _page 이동할 페이지명
			 * @param _param 이동시 데이터 값
			 * @param _action 이동시 액션 값
			 * @param _option 이동시 옵션 값
			 */
			activity : function( _page, _param, _action, _option ){
				var option = isEmpty(_option) ? {} : _option;

				if(!isEmpty(_page)) option.className = _page;
				if(!isEmpty(_param)) option.param = _param;
				if(!isEmpty(_action)) option.actionType = _action;

				M.page.activity(option);
			}
		},
		data : {
			/**
			 * 모피어스 파라미터 관련 함수
			 * @param _type (set, get, remove)
			 * @param _key (설정할 key값)
			 * @param _value (설정할 value값)
			 */
			param : function( _type, _key, _val ){
				switch( _type ){
				case 'get' : 
				case 'g' : 
					return M.data.param( _key );
					break;
				case 'set' : 
				case 's' : 
					M.data.param( _key, _val );
					break;
				case 'remove' : 
				case 'r' : 
					M.data.removeParam( _key );
					break;
					break;
				}
			},
			/**
			 * 모피어스 메모리 변수 관련 함수
			 * @param _type (set, get, remove)
			 * @param _key (설정할 key값)
			 * @param _value (설정할 value값)
			 */
			global : function( _type, _key, _val ){
				switch( _type ){
				case 'get' : 
				case 'g' : 
					return M.data.global( _key );
					break;
				case 'set' : 
				case 's' : 
					M.data.global( _key, _val );
					break;
				case 'remove' : 
				case 'r' : 
					M.data.removeGlobal( _key );
					break;
				}
			},
			/**
			 * 모피어스 storage 변수 관련 함수
			 * @param _type (set, get, remove)
			 * @param _key (설정할 key값)
			 * @param _value (설정할 value값)
			 */
			storage : function( _type, _key, _val ){
				switch( _type ){
				case 'get' : 
				case 'g' :
					if (wnIf.device == DT_VIRTUAL) { // 에뮬레이터 일땐  
						return M.data.storage(_key) ;
					} else {
						//복호화
						var value = M.sec.decrypt( M.data.storage(_key) ).result;
						if(wnIf.device == DT_IOS){
							try{
								value = JSON.parse(value);
							}catch(e){}

							if(typeof value == 'number') value += '';
						}

						return value;
					}
					break;
				case 'set' : 
				case 's' :
					if (wnIf.device == DT_VIRTUAL) { // 에뮬레이터 일땐
						M.data.storage( _key, _val );
					} else {
						//암호화
						if ( typeof _val == "object" ) {
							M.data.storage( _key, M.sec.encrypt( JSON.stringify(_val) ).result );
						} else{
							M.data.storage( _key, M.sec.encrypt( _val+'' ).result );
						}
					}
					break;
				case 'remove' : 
				case 'r' : 
					M.data.removeStorage( _key );
					break;
				}

			}
		},
		sys : {
			/**
			 * 모피어스 전화 걸기
			 * @param _number 전화걸 전화번호
			 */
			call : function( _number ){
				if(isEmpty(_number)) return;
				M.sys.call( _number ); 	//다이얼로그로 이동 하지 않고 다이렉트로 전화 (다이얼로그 이동일 경우 따로 개발 필요)
			},
			/**
			 * 모피어스 메시지 보내기
			 * @param _message 메시지 내용
			 */
			message : function( _target, _message ){
				if(isEmpty(_target)) return;
				if(isEmpty(_message)) __message = "";
				M.sys.sms({
					target : _target,
					content : _message
				});
			},
		},
		media : {
			/**
			 * 모피어스 Native 카메라 사용하기
			 */
			camera : function( _successCallback, _errorCallback, _option ){
				var option = {
						path : "",
						mediaType : "PHOTO",
						allowEdit : false
				};
				option = $.extend(option, _option);
				M.media.camera({
					mediaType : option.mediaType,
					path : option.path,
					allowEdit : option.allowEdit,
					callback: function(status, result) {
						if (status == 'SUCCESS') {
							if( typeof _successCallback == 'function' ){
								_successCallback( result );
							}
						}else if(status != "CANCEL"){
							if( typeof _errorCallback == 'function' ){
								_errorCallback( status );
							}else{
								MAPI.pop.alert( "[" + status + "] 촬영에 실패하였습니다.");
							}
						}
					}
				});
			},
			/**
			 * 모피어스 앨범 데이터 가져오기
			 */
			picker : function( _successCallback, _errorCallback, _option ){
				var option = {
						mode : "SINGLE", 
						media : "PHOTO",
						column : 3,
						maxCount : 0
				};
				option = $.extend(option, _option);

				M.media.picker({
					mode : option.mode,
					media : option.media,
					column : option.column,
					maxCount : option.maxCount,
					callback : function( status, result ){
						if(status == "SUCCESS"){
							if( typeof _successCallback == 'function' ){
								_successCallback( result );
							}
						}else if(status != "CANCEL"){
							if( typeof _errorCallback == 'function' ){
								_errorCallback( status );
							}else{
								//MAPI.pop.alert( "[" + status + "] 파일선택에 실패하였습니다.");
							}
						}
					}
				});
			},
			changeImageQuality : function( _path, _rate, _successCallback, _errCallback, _dimension ){	
				var afterArr = new Array();
				var changeFunction = function(_index){
					var fileName = _path[_index].substring(_path[_index].lastIndexOf("/")+1);
					var idx = fileName.indexOf("?id=");
					if(idx != -1){
						//iOS 확장자 JPG로 통일
						fileName = fileName.substring(idx+4, fileName.indexOf("&") != -1 ? fileName.indexOf("&") : undefined) + ".jpg";
					}
					console.log(fileName);
					M.media.optimize({
						source : _path[_index],
						overwrite : true,
						destination : "/media/photo/resize/"+fileName,
						dimension : _dimension,
						quality : _rate * 0.05,
						format: 'JPG',
						callback : function(result){
							console.log("========="+_index+"=======");
							console.log(result);
							if(result.status == "ERROR"){
								if( typeof _errCallback == 'function' ){
									_errCallback();
								}
							}else{
								afterArr.push(result);
								_index++;
								if(_path.length > _index){
									return changeFunction(_index);
								}else{
									if( typeof _successCallback == 'function' ){
										_successCallback( afterArr );
									}
								}
							}
						}
					});
				}

				changeFunction(0);
			},
			changeImageSize : function( _path, _rate, _successCallback, _errCallback, _dimension, _ratio ){	
				var afterArr = new Array();
				var changeFunction = function(_index){
					var fileName = _path[_index].substring(_path[_index].lastIndexOf("/")+1);
					var idx = fileName.indexOf("?id=");
					if(idx != -1){
						//iOS 확장자 JPG로 통일
						fileName = fileName.substring(idx+4, fileName.indexOf("&") != -1 ? fileName.indexOf("&") : undefined) + ".jpg";
					}
					console.log(fileName);
					_ratio = isEmpty(_ratio) ? {width:1, height : 1} : _ratio;

//					if(wnIf.device == DT_IOS){  //아이폰 일때				  
						M.media.crop({
							source : _path[_index],
							overwrite : true,
							destination : "/media/photo/resize/"+fileName+new Date().getTime(),
							dimension : _dimension,
							quality : _rate * 0.1,
							format: 'JPG',
							callback : function(result){
								console.log("========="+_index+"=======");
								console.log(result);
								if(result.status == "ERROR"){
									if( typeof _errCallback == 'function' ){
										_errCallback();
									}
								}else{
									afterArr.push(result);
									_index++;
									if(_path.length > _index){
										return changeFunction(_index);
									}else{
										if( typeof _successCallback == 'function' ){
											_successCallback( afterArr );
										}
									}
								}
							}
						});
//					}else{//안드로이드 일때 
//						exWNImageCrop({
//							source : _path[_index],
//							destination : "/media/photo/resize/"+fileName+new Date().getTime(),
//							ratioX : _ratio.width,
//							ratioY : _ratio.height,
//							maxWidth : _dimension.width,
//							maxHeight : _dimension.height,
//							callback : function(result){
//								console.log("========="+_index+"=======");
//								console.log(result);
//								if(result.status == "ERROR"){
//									if( typeof _errCallback == 'function' ){
//										_errCallback();
//									}
//								}else{
//									afterArr.push(result);
//									_index++;
//									if(_path.length > _index){
//										return changeFunction(_index);
//									}else{
//										if( typeof _successCallback == 'function' ){
//											_successCallback( afterArr );
//										}
//									}
//								}
//							}
//						});
//					}
				}

				changeFunction(0);
			}
		},
		net : {
			/**
			 * 모피어스 http 통신 함수
			 * @param _trcode
			 * @param _data
			 * @param _successCallback
			 * @param _errorCallback
			 * @param _option
			 */
			send : function(_trcode, _data, _successCallback, _errorCallback, _option){
				if(isEmpty(_data)) _data = {};

				console.log("=========================================HTTP SEND=========================================");
				console.log("trcode : " + _trcode.api);

				console.log("send Data : " + JSON.stringify(_data));
				console.log("=========================================HTTP SEND=========================================");

				//html indicator 사용
//				if((_option && !isEmpty(_option.indicator)) ? _option.indicator : Definition.INDICATOR){
//					showLoadingIndicator(_trcode);
//				}

				M.net.http.send({
					server : (_option && !isEmpty(_option.server)) ? _option.server : Definition.SERVER_NAME,	// Manifest.xml 에 설정된 타겟 서버
							trcode : _trcode.api, 	// 서비스 코드
							method : _trcode.method,
							userData : {
							    token : _trcode.token == "Y" ? MAPI.data.storage("g","USERTOKEN") : ""
							},
							data : _data,
							success : function(receivedData, setting){
								console.log("========================================="+_trcode.api+" : HTTP SUCCESS=========================================");
								console.log("receivedData : " + JSON.stringify(receivedData));
								console.log("========================================="+_trcode.api+" : HTTP SUCCESS=========================================");

                                if(!isEmpty(receivedData.token) && (receivedData.code == '80' || _trcode.api.indexOf("login") > -1)){
                                    MAPI.data.storage("s","USERTOKEN",receivedData.token);
                                }
	
								if (_successCallback) {
									_successCallback(receivedData, setting);
								}							

//								hideLoadingIndicator(_trcode.api);
							},
							error : function(errCode, errMsg, setting) {
								console.log("========================================="+_trcode.api+" : HTTP ERROR=========================================");
								console.log("errCode : " + errCode);
								console.log("errMsg.message : " + errMsg.message); //"success":false,"message":"허용되지 않은 DB CRUD 타입입니다. 관리자에게 문의하세요","errorNo":0,"....
								console.log("errMsg : " + errMsg); //"success":false,"message":"허용되지 않은 DB CRUD 타입입니다. 관리자에게 문의하세요","errorNo":0,"....
								console.log("setting : " + JSON.stringify(setting));
								console.log("========================================="+_trcode.api+" : HTTP ERROR=========================================");

//								if(errCode == "99999"){
//								MAPI.pop.alert("세션이 만료되어 앱을 재 실행합니다.", moveToIntro);
//								}else{
//								if(_errorCallback) {
//								_errorCallback(errCode, errMsg, setting);
//								}else{
//								MAPI.pop.alert(errMsg);
//								}
//								}

								if(_errorCallback) {
									_errorCallback(errCode, errMsg, setting);
								}else{
									MAPI.pop.alert(errCode);
								}
								//TODO:주석 삭제
//								hideLoadingIndicator(_trcode.api);
							}
							,
							indicator : (_option && !isEmpty(_option.indicator)) ? _option.indicator : {
								show : (_option && !isEmpty(_option.indicator)) ? _option.indicator : Definition.INDICATOR,
								message : Definition.INDICATOR_MSG,
//								cancelable : true
							}
				});
			},
			/**
			 * 모피어스 upload 함수
			 * @param _url
			 * @param _body
			 * @param _successCallback
			 * @param _errCallback
			 * @param _indicator
			 */
			upload : function(_url, _body, _successCallback, _errCallback, _indicator){
				console.log("=========================================HTTP UPLOAD SEND=========================================");
				console.log("data : " + JSON.stringify(_body));
				console.log("=========================================HTTP UPLOAD SEND=========================================");
				M.net.http.upload({
					url: Definition.UPLOAD_URL +_url,
					params: {},
					useCookie : false,
					body: _body,
					encoding : "UTF-8",
					indicator : isEmpty(_indicator) ? true : _indicator,
							finish : function(status, header, body, setting) {
								console.log("=========================================HTTP UPLOAD SUCCESS=========================================");
								console.log("status : " + status);
								console.log("header : " + JSON.stringify(header));
								console.log("receivedData : " + JSON.stringify(body));
								console.log("=========================================HTTP UPLOAD SUCCESS=========================================");
								if(typeof body == "string") body = JSON.parse(body);
								if(status == -1 || status == "FAIL" || body.resultcode != "0"){
									if(_errCallback){
										_errCallback( body, header );
									}else{
										MAPI.pop.toast("업로드에 실패하였습니다. 다시 시도하여주시기 바랍니다.");
									}
								}else{
									if(_successCallback){
										_successCallback( body, header );			    		
									}
								}
							},
							progress : function(total, current) {
								// console.log( total, current );
							}
				});	
			},
			/**
			 * 모피어스 download 함수
			 * @param _url
			 * @param _body
			 * @param _successCallback
			 * @param _errCallback
			 */
			download : function(_url, _param, _successCallback, _errCallback, _dir){
				console.log("=========================================HTTP DOWNLOAD SEND=========================================");			
				console.log("data : " + JSON.stringify(_param));
				console.log("=========================================HTTP DOWNLOAD SEND=========================================");

				//2019-03-26 한글 파일명 변환 
				//lib가 업데이트 되어 업데이트 버전(3.0.1)이상의 버전에서만 동작하도록 수정..
				if(wnIf.device == DT_IOS || M.info.app("app").version > "3.0.0"){
					var fileName = _url.substr(_url.lastIndexOf("/")+1);
					_url = _url.replace(fileName, encodeURI(fileName,"UTF-8"));
				}

				M.net.http.download({
					url : _url,
					method : "POST",
//					directory : isEmpty(_dir) ? "/storage/emulated/0/Download" : _dir,
					directory : isEmpty(_dir) ? "/download" : _dir,
							parameters : _param,
							overwrite: true,
							timeout : 60000,
							finish : function( statusCode, header, fileInfo, status, error ) {
								console.log("=========================================HTTP DOWNLOAD SUCCESS=========================================");
								console.log("status : " + status);
								console.log("header : " + header);
								console.log("fileInfo : " + fileInfo);					
								console.log("statusCode : " + statusCode);
								console.log("fileInfo : " + JSON.stringify(fileInfo));
								console.log("error : " + error);
								console.log("=========================================HTTP DOWNLOAD SUCCESS=========================================");
								if(status == "FAIL"){
									if(_errCallback){
										_errCallback( fileInfo, header );
									}else{
										MAPI.pop.toast("다운로드에 실패하였습니다. 다시 시도하여주시기 바랍니다.");
									}
								}else{
									if(_successCallback){
										_successCallback( fileInfo, header );			    		
									}
								}
							},
							progress : function(total, current) {
								console.log( total, current );
							}
				}); 
			}
		},
		pop : {
			/**
			 * 모피어스 alert 팝업 함수
			 * @param _msg
			 * @param _callback(buttonIdx)
			 * @param _option<Object> 
			 * @@_option title 팝업 타이틀
			 */
			alert : function( _msg, _callback, _option ){
				if(!Global.openedPop){
					Global.openedPop = true;
					var option = $.extend({}, _option);
					option.title = _option && _option.title ? _option.title : "알림";
					option.buttons = _option && _option.buttons ?  _option.buttons : ["확인"];
					option.msg = _msg;

//					openPopup("CMM0200", 
//							{type : "getData", data : option}, 
//							"", 
//							function(index, option) {
//								Global.openedPop = false;
//								closePopup();
//								if(_callback) {
//									_callback(index, option);
//								}
//							});
					M.pop.alert(option.msg, {
						title   : option.title,
						buttons : option.buttons
					}, function(index, option) {
						Global.openedPop = false;
						if(_callback) {
							_callback(index, option);
						}
					});
				}
			},
			/**
			 * 모피어스 confirm 팝업 함수
			 * @param _msg
			 * @param _okCallback(buttonIdx)
			 * @param _cancelCallback
			 * @param _option<Object> 
			 * @@_option buttons
			 * @@_option title 팝업 타이틀
			 */
			confirm : function( _msg, _okCallback, _cancelCallback, _option ){
				if(!Global.openedPop){
					Global.openedPop = true;
					var option = $.extend({}, _option);
					option.title = _option && _option.title ? _option.title : "확인";
					option.buttons = _option && _option.buttons ?  _option.buttons :["아니오", "예"];
					option.msg = _msg;
//					openPopup("CMM0200", 
//							{type : "getData", data : option}, 
//							"", 
//							function(index, option) {
//								Global.openedPop = false;
//								closePopup();
//								if(index == 1){
//									if(_okCallback) {
//										_okCallback(index, option);
//									}
//								}else{
//									if(_cancelCallback) {
//										_cancelCallback(index, option);
//									}
//								}
//							});

					M.pop.alert(option.msg, {
						title   : option.title,
						buttons : option.buttons
					}, function(index, option) {
						Global.openedPop = false;
						if(index == 1){
							if(_okCallback) {
								_okCallback(index, option);
							}
						}else{
							if(_cancelCallback) {
								_cancelCallback(index, option);
							}
						}
					});
				}
			},
			/**
			 * 모피어스 리스트 팝업 함수
			 * @param _listArr<Array, Object> 리스트 
			 * @@_listArr title : 리스트 Text
			 * @@_listArr value : 리스트 Value
			 * @param _callback(value, idx) 콜백함수(선택한 값, 선택한 인덱스) 
			 */
			list :function(_listArr, _callback, _option) {
				M.pop.list({
					title : "선택",
					list : _listArr,
					selected : !isEmpty(_selected) ? _selected : "",
							cancelButtonTitle : "취소"
				}, function (buttonIdx, rowInfo, setting) {

					if(_callback) {
						_callback(buttonIdx, rowInfo, setting);
					}
				});
			},
			/**
			 * 모피어스 toast 팝업 함수
			 * @param _msg
			 */
			toast : function( _msg ){
				M.pop.instance({
					message : _msg, 
					time : 2000
				});
			},
			/**
			 * 데이트, 타임 피커
			 * param 
			 * _type format
			 * _callback
			 * _initDate yyyyMMDD 형식, 선택사항
			 * _option 선택사항 (minDate, maxDate)
			 */
			date : function( _type, _callback, _initDate, _option ){ 	
				//기본 최소 시간 및 날짜 세팅
				var minDate = _type.indexOf("Y") != -1 ? '19790101' : '0000';
				var maxDate = _type.indexOf("Y") != -1 ? '21001231' : '2359';

				if(_option && _option.minDate) minDate = _option.minDate;
				if(_option && _option.maxDate) maxDate = _option.maxDate;

				//기본 시간 및 날짜 세팅 (12:00, 금일)
				var initDate = "1200";
				if(_type.indexOf("Y") != -1) initDate = new Date();

				M.pop.date({
					type      : _type,
					initDate  : _initDate ? _initDate : initDate,
					minDate : minDate,
					maxDate : maxDate
				}, function(result, setting) {
					console.log("M.popup.date ========== result : "+result);
					if(result.status == "SUCCESS"){
						if(_callback){
							_callback( result );						
						}
					}
				});
			}
		},
		apps : {
			/**
			 * 모피어스 browser 함수, 내장 브라우저 호출
			 * @param url
			 * @param encoding 
			 */
			browser : function(url, encoding){
			    if(isEmpty(encoding)) encoding = 'UTF-8';
                M.apps.browser(decodeURIComponent(url), encoding);
			},
			open : function(nativeID){
				if(wnIf.device == DT_IOS && !$.hasString(nativeID, "://")) nativeID += "://";
				M.apps.open(nativeID)
			}
		},
		file : {
			move : function(filePath, destPath){
				M.file.move({
					type: 'FILE',
					source: "/ext.link/download",//filePath,
					destination: destPath,
					indicator: true,
					progress: function(total, current, setting){
						console.log(total, current);
					},
					finish: function(resut){
						console.log(result);
					}
				});
			},

			read : function(filePath,encoding,_callback){
				M.file.read({
					path: filePath,
					encoding: encoding,
					indicator: false,
					callback: function(status,result){
						if(status == "SUCCESS"){
							_callback( result );	
							//base64 변경시 결과값 표시 => "data:image/png;base64,"+result.data;
						}
					}
				});
			}
		},
		location : {
			current : function(callback){
				M.plugin("location").current({
					timeout: 1000,
					maximumAge: 1,
					callback: function( result ) {
						if ( result.status === 'NS' ) {
							MPopup.alert({
								message : "해당 기기는 geolocation 기능을 지원하지 않는 기기입니다."
							},"layer");
						}
						else if ( result.status !== 'SUCCESS' ) {
							if ( result.message ) {
							}
							else {
								MPopup.alert({message : "현 위치 수신 오류"},"layer");
							}
						}
						else {
							if ( result.coords ) {
								if(typeof callback =="function"){
									callback(result.coords);
								}
							}
							else {
								console.log( 'It cann\'t get GPS Coords.' );
							}
						}
					}
				});
			}
		}
};

/**
 * Addon Api
 */

/**
 * 모피어스 Plugin Api
 */
var Plugin = {
		Location : function(callback){
			
		}
}
