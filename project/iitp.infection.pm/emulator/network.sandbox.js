
(function(window, undefined) {

var 

ERROR_MESSAGE = "데이터를 처리하는 중 에러가 발생하였습니다.",

Class = UI.Class,
NetworkManager = Class.NetworkManager,
Provider = Class.Provider,

/*!
기본으로 제공되는 네트워크 메니저
*/
HttpDefaultNetworkManager = Class({
	name: "HttpDefaultNetworkManager",
	parent: NetworkManager,
	constructor: function() {
		var 
			CONFIG_URL_KEY = "http-connection-url",
			CONFIG_TIMEOUT_KEY = "http-network-timeout",
			CONFIG_ENCODING_KEY = "http-encoding",
			CONFIG_REST_RSC_UPDATE_URI = "http-resource-update-uri",
			
			_config = {
				url: "",
				resourceUpdateURI: "",
				encoding: "UTF-8",
				timeout: -1
			};
	
		return {
			
			didFailProvider: function( provider, errormsg, callArgs ) {
				
				var 
				page = callArgs[0], 
				trCode = callArgs[1], 
				data = callArgs[2], 
				networkOption = callArgs[3], 
				delegate = callArgs[4], 
				userInfo = callArgs[5],
				jsonUserData = JSON.stringify(networkOption.get("jsonUserData"));
				
				delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, "-1", errormsg, userInfo );
			},
			
			didFinishProvider: function( provider, header, body, encoding, callArgs ) {
				
				var 
				dataType,
				dataBody,
				page = callArgs[0], 
				trCode = callArgs[1], 
				data = callArgs[2], 
				networkOption = callArgs[3], 
				delegate = callArgs[4], 
				userInfo = callArgs[5],
				jsonUserData = JSON.stringify(networkOption.get("jsonUserData"));
				
				if ( _config.resourceUpdateURI && networkOption.get("restAction") ) {
					dataType = "JSON";
				}
				
				try {
					// TODO: encoding
				
					dataBody = ( typeof body == "string" )? JSON.parse( body ) : body;
				}
				catch(e) {
					delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, "-1", ERROR_MESSAGE, userInfo );
					return;
				}
				
				var resultCode = parseInt(dataBody.head.result_code);
				
				if ( ! isNaN(resultCode) && resultCode === 200 ) {
					var callbackFunc = ( networkOption.get("cbfunc") === "" ) ? "CBResponseData" : networkOption.get("cbfunc");
				
					delegate.didFinishNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, JSON.stringify(dataBody.body), callbackFunc, networkOption.get("tagId"), jsonUserData, userInfo );
				}
				else {
					
					delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, dataBody.head.result_code, dataBody.head.result_msg, userInfo );
				}
			},
			
			configuration: function( info ) {
				_config.url = info.get(CONFIG_URL_KEY);
				_config.encoding = info.get(CONFIG_ENCODING_KEY);
				_config.timeout = parseInt( info.get(CONFIG_TIMEOUT_KEY) ) / 1000;
				_config.resourceUpdateURI = info.get(CONFIG_REST_RSC_UPDATE_URI);
			},
			
			process: function( page, trCode, data, networkOption, delegate, userInfo ) {

				var 
				retargetURL = networkOption.get("retargetURL"),
				url = ( ! retargetURL ) ? _config.url : retargetURL,
				//dataType = "JSON",
				provider = new Provider(),
				request = provider.request(),
				type = "POST",
				userData = arguments;

				// Network Manager address 설정이 localhost 로 된 경우 리소스 경로로 치환
				if ( url.indexOf("http://localhost/") === 0 ) {

					url = url.replace("http://localhost/", window.Emulator.sharedInstance().config().project.path + "/" );
				    
				    // Change Path : /user/action -> user.action.json
				    var trcodeComponents = trCode.split("/");
				    if ( trcodeComponents.length > 0 && trcodeComponents[0] === "" ) {
				        trcodeComponents.shift();
				    }
				    trCode = trcodeComponents.join(".") + ".json";

				    // Change Method to GET
				    networkOption.options({
				    	"restAction": "GET"
				    });
				}
				
				//request._project( page._delegate() );
				
				if ( _config.resourceUpdateURI && networkOption.get("restAction") ) {
					var hasSlashSuffix = url.substr(url.length-1) === '/',
						hasSlashPrefix = trCode.substr(0,1) === '/';
					
					var restURL;
					
					if ( !retargetURL ) {
						if ( hasSlashSuffix || hasSlashPrefix ) {
							restURL = url + trCode;
						}
						else {
							restURL = url + "/" + trCode;
						}
					}
					else {
						restURL = retargetURL;
					}
					
					url = restURL;
					type = networkOption.get("restAction");
				}
				
				if ( networkOption.get("jsonUserData") ) {
					var networkUserData = networkOption.get("jsonUserData");
					
					if ( networkUserData.action && networkUserData.service_id ) {
						request.head({
							"action": networkUserData.action,
							"service_id": networkUserData.service_id
						});
						
					}
				}
				
				var encodedString = request.escapeUsingEncoding( _config.encoding );
				var requestString = encodedString + "&in=" + _config.encoding;
				
				if ( networkOption.get("encrypt") ) {
					// 암호화가 필요한 경우
				}
				
				if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
			        if (type == "PUT" || type == "POST") {
						
		            }
			    }
			    else {
					
			    }
			    
			    if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
			        request.header().put( "Accept", "application/json" );
			        request.header().put( "Content-Type", "application/json; charset=" + _config.encoding );
			    }
			    else {
			    	request.header().put( "Content-Type", "application/x-www-form-urlencoded; charset=" + _config.encoding );
			    	request.header().put( "user_data_type", "json" );
			    	request.header().put( "user_com_code", trCode );
			    	request.header().put( "user_data_enc", networkOption.get("encrypt") === true ? "y" : "n" );
			    	request.header().put( "service_code", networkOption.get("dummy") === true ? "dummy" : "" );
			    }
			    
			    // Head
			    request.head().put("callback_function", networkOption.get("cbfunc") );
			    
			    // Body
			    var objData = JSON.parse( data );
			    
			    request.body( objData );
			    
			    var requestData = request.data();
			    
			    //provider.contentType ( dataType );
			    provider.timeout( networkOption.get("timeout") );
			    provider.userData( userData );
			    provider.delegate( this );
				provider.load(url, type, {
					data: requestData
				});
			}
		};
	}
}),

/*!
과거버전의 소스를 지원하기 위한 NetworkManager, HttpDefaultNetworkManager의 복사본
*/
HttpDataNetworkManager = Class({
	name: "HttpDataNetworkManager",
	parent: NetworkManager,
	constructor: function() {
		var 
			CONFIG_URL_KEY = "http-connection-url",
			CONFIG_TIMEOUT_KEY = "http-network-timeout",
			CONFIG_ENCODING_KEY = "http-encoding",
			CONFIG_REST_RSC_UPDATE_URI = "http-resource-update-uri",
			
			_config = {
				url: "",
				resourceUpdateURI: "",
				encoding: "UTF-8",
				timeout: -1
			};
	
		return {
			
			configuration: function( info ) {
				_config.url = info.get(CONFIG_URL_KEY);
				_config.encoding = info.get(CONFIG_ENCODING_KEY);
				_config.timeout = parseInt( info.get(CONFIG_TIMEOUT_KEY) ) / 1000;
				_config.resourceUpdateURI = info.get(CONFIG_REST_RSC_UPDATE_URI);
			},

			/*!
			데이터 통신이 비정상적으로 결과를 받아올수 없을때, 네트워크 실패시 호출되는 함수
			@param provider			  	provider object
			@param errormsg			  	오류 메세지
			@param callArgs  			저장해둔 paramters
			*/
			didFailProvider: function( provider, errormsg, callArgs ) {
				var 
				page = callArgs[0], 
				trCode = callArgs[1], 
				data = callArgs[2], 
				networkOption = callArgs[3], 
				delegate = callArgs[4], 
				userInfo = callArgs[5],
				jsonUserData = JSON.stringify(networkOption.get("jsonUserData"));
				
				delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, "-1", errormsg, userInfo );
			},
			
			/*!
			데이터 통신 후 정상적으로 결과를 받아올때 호출되는 함수
			@param provider			  	provider object
			@param header				http response headers
			@param body					http response body
			@param encoding			  	reponse string charset encoding
			@param callArgs  			저장해둔 paramters
			*/
			didFinishProvider: function( provider, header, body, encoding, callArgs ) {

				var 
				dataType,
				dataBody,
				page = callArgs[0], 
				trCode = callArgs[1], 
				data = callArgs[2], 
				networkOption = callArgs[3], 
				delegate = callArgs[4], 
				userInfo = callArgs[5],
				jsonUserData = JSON.stringify(networkOption.get("jsonUserData"));
				
				if ( _config.resourceUpdateURI && networkOption.get("restAction") ) {
					dataType = "JSON";
				}
				
				try {
					dataBody = ( typeof body == "string" )? JSON.parse( body ) : body;
				}
				catch(e) {
					delegate.didFailNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, networkOption.get("tagId"), jsonUserData, "-1", ERROR_MESSAGE, userInfo );
					return;
				}
				
				var callbackFunc = ( networkOption.get("cbfunc") === "" ) ? "CBResponseData" : networkOption.get("cbfunc");
				
				delegate.didFinishNetworkManager.call( delegate, this, networkOption.get("targetServer"), trCode, JSON.stringify(dataBody), callbackFunc, networkOption.get("tagId"), jsonUserData, userInfo );
			},
			
			/*!
			비동기 데이터 통신 요청 함수
			@param page				데이타가 요청된 페이지
			@param trCode				전문코드
			@param data			  	request data string
			@param networkOption  	네트워크 옵션 object
			@param delegate		 	result를 넘겨 받을 delegete
			@param userinfo		 	사용자의 확장 데이타 영역
			*/
			process: function( page, trCode, data, networkOption, delegate, userInfo ) {
				
				var 
				retargetURL = networkOption.get("retargetURL"),
				url = ( ! retargetURL ) ? _config.url : retargetURL,
				//dataType = "JSON",
				provider = new Provider(),
				request = provider.request(),
				type = "POST",
				userData = arguments;
				
				request._project( page._delegate() );
				
				if ( _config.resourceUpdateURI && networkOption.get("restAction") ) {
					var hasSlashSuffix = url.substr(url.length-1) === '/',
						hasSlashPrefix = trCode.substr(0,1) === '/';
					
					var restURL;
					
					if ( !retargetURL ) {
						if ( hasSlashSuffix || hasSlashPrefix ) {
							restURL = url + trCode;
						}
						else {
							restURL = url + "/" + trCode;
						}
					}
					else {
						restURL = retargetURL;
					}
					
					url = restURL;
					type = networkOption.get("restAction");
				}
				
				if ( networkOption.get("jsonUserData") ) {
					var networkUserData = networkOption.get("jsonUserData");
					
					if ( networkUserData.action && networkUserData.service_id ) {
						request.head({
							"action": networkUserData.action,
							"service_id": networkUserData.service_id
						});
						
					}
				}
				
				var encodedString = request.escapeUsingEncoding( _config.encoding );
				var requestString = encodedString + "&in=" + _config.encoding;
				
				if ( networkOption.get("encrypt") ) {
					// 암호화가 필요한 경우
				}
				
				if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
					if (type == "PUT" || type == "POST") {
						
				  	}
				}
				else {
					
				}

				// Header 설정
				if (_config.resourceUpdateURI && networkOption.get("restAction") ) {
					 request.header().put( "Accept", "application/json" );
					 request.header().put( "Content-Type", "application/json; charset=" + _config.encoding );
				}
				else {
					request.header().put( "Content-Type", "application/x-www-form-urlencoded; charset=" + _config.encoding );
					request.header().put( "user_data_type", "json" );
					request.header().put( "user_com_code", trCode );
					request.header().put( "user_data_enc", networkOption.get("encrypt") === true ? "y" : "n" );
					request.header().put( "service_code", networkOption.get("dummy") === true ? "dummy" : "" );
				}
				
				// Head
				request.head().put("callback_function", networkOption.get("cbfunc") );
				
				// Body
				var objData = JSON.parse( data );
				
				request.body( objData );
				
				var requestData = request.data();
				
				// 데이타 요청
				//provider.contentType ( dataType );
				provider.timeout( networkOption.get("timeout") );
				provider.userData( userData );
				provider.delegate( this );
				provider.load(url, type, {
					data: requestData
				});
			}
		};
	}
});

window.managerKeys = ["HttpDefaultNetworkManager", "HttpDataNetworkManager"];

})(window);