package iitp.infection.pm.implementation;


import java.util.HashMap;

import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.DataHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.model.NetReqOptions;
import m.client.android.library.core.networks.http.AsyncHttpNetwork;
import m.client.android.library.core.networks.http.HttpPacketManager;
import m.client.android.library.core.networks.http.RequestParams;
import m.client.android.library.core.utils.Indicator;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.utils.Utils;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.view.IActivityNetworkable;

import org.apache.http.Header;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ProgressDialog;
import android.graphics.drawable.ColorDrawable;
import android.widget.Toast;


/**
 * HttpDefaultNetworkManager Class
 * 
 * @author 류경민(<a mailto="kmryu@uracle.co.kr">kmryu@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.2 <br>
 *        <DT><B>Date: </B>
 *        <DD>2008.01.03</DD>
 *        <DT><B>Company: </B>
 *        <DD>URACLE</DD>

 * HTTP 통신을 관리한다. <br/>
 * HTTP의 통신 상태 및 접속, 네트워크 송수신, 암복호화 처리를 한다. <br/>
 * 
 * 각 서비스에 따라 추가 및 수정을 할 수 있다. 
 * 
 * Copyright (c) 2001-2007 Uracle, Inc. 8F Allianz Life Insurance B/D. 1303-16 <br/>
 * Seocho-4Dong, Seocho-Gu, Seoul 137-855, Korea All Rights Reserved.
 */
public class HttpDefaultNetworkManager extends AsyncHttpNetwork {
	
	private final String CLASS_TAG = "NETWORK_PROCESSING";
	
	CommonLibHandler commHandle = CommonLibHandler.getInstance();
	ProgressDialog progressDialog = null;
	Indicator mProgress = null;

	/**
	 * Constructor 
	 * 아래 생성자는 반드시 포함되어야 한다. 
	 */
	public HttpDefaultNetworkManager() {
		super();
	}
	
	/**
	 * 데이터 요청
	 * 아래 메서드는 반드시 포함되어야 한다.
	 * @param trCode 전문 코드 
	 * @param sb 보낼 데이터
	 * @param otherInfos 기타 데이터
	 * @param objSender	요청 객체 
	 * @param netReqOptions	요청 네트워크 옵션
	 */
	@Override
	public synchronized void requestData(final String trCode, final DataHandler sb, final String otherInfos, final Object objSender, NetReqOptions netReqOptions) {
		
		// 화면에서 네트워크 메시지를 초기화 하지 않은 경우 기본 설정 적용
		if (netReqOptions == null)
			netReqOptions = new NetReqOptions();	// Default option setting
		final NetReqOptions finalNetReqOptions = netReqOptions;
		
		// Create & Show progress dialog
		ProgressDialog progressDialog = null;
		
		// 화면에서 네트워크 옵션으로 인디게이터 표시 여부를 보낸다. 
		// 인디게이터 표시 플래그를 설정했을 경우에만 표시
		if (finalNetReqOptions.indicator && progressDialog == null) {
			String indMsg = finalNetReqOptions.indicatorMsg;
			progressDialog = ProgressDialog.show((AbstractActivity)objSender, "", indMsg, true, finalNetReqOptions.cancelable);
			if (indMsg.trim().equals(""))
				progressDialog.setContentView(Utils.getDynamicID(commHandle.getApplicationContext(), "layout", "addon_net_progressnetworkdialoglayout"));
			progressDialog.getWindow().setBackgroundDrawable(new ColorDrawable(0));
			progressDialog.show();
		}
		
		// Put packet data information
		// 요청 패킷 정보 저장
		// 모든 요청 패킷은 저장되며 서버에서 정상적으로 응답 데이터를 수신시 제거된다.
		// @param trCode 전문번호
		// @param otherInfos 기타정보(수신 JS 함수명)
		// @param progressDialog 프로그래스 다이얼로그 (Object)
		// @param objSender 보내는 화면 객체(Object)
		final int packetSeq = HttpPacketManager.getInstance().putPacketInfo(trCode, finalNetReqOptions, otherInfos, progressDialog, objSender);
		
		// Start thread for request data
		new Thread() {
            public void run() {
            	
            	try {
            		
            		PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////"); 
					PLog.i(CLASS_TAG, "// Request Data trCode[" + trCode + "], Options[dummy:" + finalNetReqOptions.dummy + ", encrypt:" + finalNetReqOptions.encrypt + ", indicator:" + finalNetReqOptions.indicator + ", indicatorMsg:" + finalNetReqOptions.indicatorMsg + "], packetSeqId:" + packetSeq + "]" );
					PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////");
					
					// Initialization
					JSONObject httpSh, sh;
					httpSh = sh = null;
					String sendStr = null;
					
					// Connect Network
					if (connect(packetSeq) == false)
						return;
			
					// Set Request HTTP Header
					httpSh = setRequestHttpHeader(trCode, finalNetReqOptions, packetSeq);
					
					// Set Request Header
					sh = setRequestHeader(otherInfos, packetSeq, finalNetReqOptions);
					
					// Making all packet data
					sendStr = setRequestData(sh, sb, finalNetReqOptions, packetSeq);
					
					// Data send and receive
					if (sendStr != null) {
						
						// 요청 데이터를 파라메터 형식으로 보내는 경우 
						RequestParams params = new RequestParams(_encoding);
//						params.put("in", sendStr);
//						requestAndReceiveData(finalNetReqOptions.retargetUrl, httpSh, params, "");
						
						// 요청 데이터를 일반 문자열 형식으로 데이터 송신
						PLog.e("STRAT", "-- Update 전문 통신 시작 <<<<<<<<<<<<<<");
						//requestAndReceiveData(finalNetReqOptions.retargetUrl, httpSh, null, sendStr);
						requestAndReceiveData(finalNetReqOptions.retargetUrl, httpSh, null, sendStr, finalNetReqOptions, packetSeq);
					}
					
            	} catch (NullPointerException e) {
            		
                    // Process error
            		
                    handlingError(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK, 
                    		Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_addon_net_error_msg_internal_network1"), 
                    		packetSeq);
                }
            }
		}.start();
	}
	
	/**
	 * Http 헤더를 설정 한다. 
	 * @return JSON Object
	 * @param trCode 전문 코드 
	 * @param isEncrypt 암복호화 여부 
	 */
	public JSONObject setRequestHttpHeader(String trCode, NetReqOptions netReqOptions, int packetSeq) {
		
		boolean isEncrypt = netReqOptions.encrypt;
		boolean isDummy = netReqOptions.dummy;
		HashMap<String, Object> selectedNetInfo = commHandle.getSelectedNetInfo(netReqOptions.targetServerName);
		
		String resourceUpdateUri = null;
		String encoding = null;
		try {
			resourceUpdateUri = (String)selectedNetInfo.get("RESOURCEUPDATEURI");
			encoding = (String)selectedNetInfo.get("ENCODING");
		}catch(NullPointerException e){
			PLog.i(CLASS_TAG, e.toString());
		}
		
		JSONObject httpHeadJson = new JSONObject();
		
		try {
			
			if(resourceUpdateUri == null){
				// user_data_type
				httpHeadJson.put("user_data_type", commHandle.g_strNetworkDataType);
				 
				// user_com_code
				httpHeadJson.put("user_com_code", trCode);
				 
				// user_data_enc
				httpHeadJson.put("user_data_enc", (isEncrypt)?"y":"n");
				
				// service_code
				if (isDummy)
					httpHeadJson.put("service_code", "dummy");
				else
					httpHeadJson.put("service_code", "");
			}else{
				
//				NSString *json_type = @"application/json";
//			    NSString *content_type = [NSString stringWithFormat:@"%@; charset=%@", json_type, self.strEncoding];
//			    [requestHeaders setObject:content_type   forKey:@"Content-Type"  ];
//			    [requestHeaders setObject:json_type   forKey:@"Accept"  ];
			    
				String json_type = "application/json";
				String content_type = json_type + "; charset=" + encoding;
				
				// content_type
				httpHeadJson.put("Content-Type", content_type);
				
				// Accept
				httpHeadJson.put("Accept", json_type);
				
				netReqOptions.trCode = trCode;
			}
			
			PLog.i(CLASS_TAG, "// Request Http Header [" + httpHeadJson.toString() + "]");
			 
		} catch(JSONException je) {
			Logger.e("JSON put error");
		} catch(NullPointerException e) {
			 handlingError(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK, 
					 Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_addon_net_error_msg_internal_network1"), 
					 packetSeq);
			Logger.getTraceLog(e);
			 return null;
        }
		 
		return httpHeadJson;
	}
	
	/**
	 * 요청 헤더를 설정 한다. 
	 * @return JSON Object
	 * @param otherInfos 기타 정보(콜백 자바스크립트 함수명) 
	 * @param packetSeq 패킷 아이디
	 * @param netReqOptions 네트워크 요청 옵션 
	 */
	public JSONObject setRequestHeader(String otherInfos, int packetSeq, NetReqOptions netReqOptions) {

		 JSONObject headJson = new JSONObject();
		 JSONObject subHeadJson = new JSONObject();
		 
		 try {
			 // Application Version
			 subHeadJson.put("app_version", commHandle.g_strAppVersion);
			 
			 // Application Name
			 subHeadJson.put("app_name", commHandle.g_strAppName);
			 
			 // Application ID
			 subHeadJson.put("appid", commHandle.g_strAppID);
			 
			 // Packet ID(패킷 아이디)
			 // 현재 화면의 아이디를 설정한다.
			 // 원격 서버는 클라이언트로부터 받은 패킷 아이디를 클라이언트로 그대로 되돌려준다.
			 subHeadJson.put("screen_id", String.valueOf(packetSeq));
			 
			 // System Version
			 subHeadJson.put("system_version", commHandle.g_strDeviceOsVersion);
			 
			 // System Name
			 subHeadJson.put("system_name", commHandle.g_strAppSystemName);
			 
			 // device_id
			 subHeadJson.put("device_id", commHandle.g_strDeviceID);
			 
			 // device_model_name
			 subHeadJson.put("device_md", commHandle.g_strDeviceModelName);
			 
			 // phone_no
			 subHeadJson.put("phone_no", commHandle.g_strPhoneNumber);
			 
			 // callback_function
//			 subHeadJson.put("callback_function", otherInfos);
			 
			 // callback_request_data_flag
			 subHeadJson.put("callback_request_data_flag", "n");
			 
			 headJson.put("head", subHeadJson);
			 
			 // 사용자 통계를 위한 user_id 추가
			 // subHeadJson.put("user_id", "sample_id");
			 // 사용자 통계를 위한 user_name 추가
			 // subHeadJson.put("user_name", "sample_name");

			 
			 try {
				 JSONObject _userData = new JSONObject(netReqOptions.userData);
				 
				 String action     = _userData.optString("action");
				 subHeadJson.put("action"    , action);
				 
				 String service_id = _userData.optString("service_id");
				 subHeadJson.put("service_id", service_id);
			 } catch(JSONException e) {
				 Logger.getTraceLog(e);
			 }
			 
			 PLog.i(CLASS_TAG, "// Request Header [" + headJson.toString() + "]");
			 
		 } catch(JSONException je) {
			 Logger.getTraceLog(je);
			 return null;
		 } catch(RuntimeException e) {
			 handlingError(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK, 
					 Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_addon_net_error_msg_internal_network2"), 
					 packetSeq);
			 Logger.getTraceLog(e);
			 return null;
         }
		 return headJson;
	}
	
	/**
	 * 최종 요청 데이터 설정 
	 * 여기서 데이터를 암복호화 한다. 
	 * @param sh 보내는 헤더 데이터 핸들 객체
	 * @param sb 보내는 바디 데이터 핸들 객
	 */
	@Override
	public String setRequestData(JSONObject sh, DataHandler sb, NetReqOptions netReqOptions, int packetSeq) {
		
		boolean isEncrypt = netReqOptions.encrypt;
		
		JSONObject allPacketJSON = null;
		try {
			allPacketJSON = new JSONObject();
/*		
			"head" : {
				"id" : "",
				"phnmd" : "android",
				"svcnm" : "morpheus",
				"pw" : "",
				"udid" : "oqwielkdjflijwe901239123",
				"phnno" : "01083775269"
			}

			"body" : {
				"id" : "",
				"phnmd" : "android",
				"svcnm" : "morpheus",
				"pw" : "",
				"udid" : "oqwielkdjflijwe901239123",
				"phnno" : "01083775269"
			}
*/
			allPacketJSON.put("head", sh.get("head"));
			
			try{
				if (sb != null) {
					allPacketJSON.put("body", new JSONObject(sb.toString()));
					PLog.i(CLASS_TAG, "// Request Data [" + sb.toString() + "]");
				}
			}catch(JSONException e){
				try{
					if (sb != null) {
						allPacketJSON.put("body", new JSONArray(sb.toString()));
						PLog.i(CLASS_TAG, "// Request Data [" + sb.toString() + "]");
					}
				}catch(JSONException i){
					Logger.getTraceLog(i);
				}		
			}

		} catch(JSONException e) {
			handlingError(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK, 
					Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_addon_net_error_msg_internal_network2"), 
					packetSeq);
			Logger.getTraceLog(e);
			return null;
		}
		return allPacketJSON.toString();
	}
	
	/**
	 * 받은 Http 헤더 정보 얻기 
	 * @param hd 받은 http 헤더 정보 배열 객체
	 * @return JSONObject
	 */
	public JSONObject getResponseHttpHeader(Header hd[], int packetSeq){
		
		// Get Header Information
		String user_data_type = null;
		String user_com_code = null;
		String user_data_enc = null;
		String content_type = null;
//		String content_length = null;
		String serverInfo = null;
		JSONObject httpHeadJsonObj = null;
		try {
        	httpHeadJsonObj = new JSONObject();
        	for(int i = 0; i < hd.length; i++) {
        		httpHeadJsonObj.put(hd[i].getName(), hd[i].getValue());
        	}
        	
			if(httpHeadJsonObj.isNull("user_data_type") == false)
				user_data_type = httpHeadJsonObj.optString("user_data_type");// 요청 데이터 유형(json, xml)
			
			if(httpHeadJsonObj.isNull("user_com_code") == false)
				user_com_code = httpHeadJsonObj.optString("user_com_code");// 전문 번호
			
			if(httpHeadJsonObj.isNull("user_data_enc") == false)
				user_data_enc = httpHeadJsonObj.optString("user_data_enc");// 암호화 여부 (y, n)
			
			if(httpHeadJsonObj.isNull("Content-Type") == false)
				content_type = httpHeadJsonObj.optString("Content-Type");// 컨텐즈 타입(ex, text/html;charset=UTF-8)
        	
        	PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////");
        	PLog.i(CLASS_TAG, "// Response Data trCode[" + user_com_code + "]");
        	PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////");
        	PLog.i(CLASS_TAG, "// Response Http Header[" + httpHeadJsonObj.toString() + "]");
        	
		} catch(JSONException je) {
			handlingError(LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK, 
					Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_addon_net_error_msg_internal_network3"), 
					packetSeq);
			Logger.getTraceLog(je);
			return null;
		}
		
		return httpHeadJsonObj;
	}
	
	/**
	 * 받은 데이터 처리 
	 * @param hd 받은 데이터 Http 헤더 배열
	 * @param rd 받은 데이터 문자열 
	 */
	@Override
	public synchronized void getResponseData(Header hd[], String rd, int packetSeq) {

		JSONObject recvHttpHeadJson = null;
		JSONObject recvDataJson = null;
		JSONObject headDataJson = null;
		JSONObject bodyObjDataJson = null;
		JSONArray bodyArrDataJson = null;
		String bodyDataJson = null;
		String strTrCode = ""; 	// 전문코드
		String strResultCode = "";  // 원격서버의 결과 코드
		String strResultMsg = "";  // 원격서버의 처리 결과 메시지 
		String strCallBackFunc = ""; // 요청 화면으로 전송할 UI 화면의 자바스크립트 콜백함수명 
		int nRecvPacketId = -1; // 서버로부터 전송된 패킷 아이디
		try {
		
			// HTTP헤드(Http Head) 정보 추출
			recvHttpHeadJson = getResponseHttpHeader(hd, packetSeq);
			
			// 원격서버로부터 수신데이터를 JSON Object로 변환
			recvDataJson = new JSONObject(rd);
			
			// 헤드(Head) 정보 추출
			headDataJson = (JSONObject)recvDataJson.get("head");
			PLog.i(CLASS_TAG, "// Response Header[" + headDataJson.toString() + "]");
			
			
			// 바디(Body) 정보 추출
			Object json = recvDataJson.get("body");
			if (json instanceof JSONObject){
			  //you have an object
				bodyObjDataJson = (JSONObject)recvDataJson.get("body");
				bodyDataJson = bodyObjDataJson.toString();
				PLog.i(CLASS_TAG, "// Response Data[" + bodyDataJson + "]");
			}else if (json instanceof JSONArray){
			  //you have an array
				bodyArrDataJson = (JSONArray)recvDataJson.get("body");
				bodyDataJson = bodyArrDataJson.toString();
				PLog.i(CLASS_TAG, "// Response Data[" + bodyDataJson + "]");
			}
			
				
			// 전문 코드 
			if(recvHttpHeadJson.isNull("user_com_code") == false)
				strTrCode = recvHttpHeadJson.getString("user_com_code");
			if ((strTrCode == null) || (strTrCode.equals(""))){
				strTrCode = (String) HttpPacketManager.getInstance().getTrCode(packetSeq);
			}
			
			// 결과 코드 
			if(headDataJson.isNull("result_code") == false)
				strResultCode = headDataJson.getString("result_code");
			
			// 결과 메시지 
			if(headDataJson.isNull("result_msg") == false)
				strResultMsg = headDataJson.getString("result_msg");
			
			// UI 화면 콜백함수
			if(headDataJson.isNull("callback_function") == false)
				strCallBackFunc = headDataJson.getString("callback_function");
			
			// 요청 화면의 패킷 아이디
			if(headDataJson.isNull("screen_id") == false){
				nRecvPacketId = Integer.valueOf(headDataJson.getString("screen_id"));
			}else{
				nRecvPacketId = packetSeq;
			}
			
			PLog.i(CLASS_TAG, "// Result Code[" + strResultCode + "], Message[" + strResultMsg + "], PacketId[" + nRecvPacketId + "]");
			PLog.i(CLASS_TAG, "////////////////////////////////////////////////////////////////////////////////");
		
		}catch(JSONException e) {
			Logger.getTraceLog(e);
		}
		
		// 수신 받은 패킷의 sequence id 정보를 이용하여 요청한 패킷 정보를 추출한다. 
		// 추출한 요청 패킷 정보에는 요청 전문번호, 콜백함수명, 프로그래스 객체, 요청화면 객체등의 정보가 있다. 
		// 패킷 아이디에 해당하는 패킷 정보가 없는 경우는 Skip 한다.
		AbstractActivity selectedActivity = (AbstractActivity)HttpPacketManager.getInstance().getCallerObject(nRecvPacketId);

		if (selectedActivity != null) {
			
			// Processing packet received informations
			// Call back function name
			String callBackFunc = (String)HttpPacketManager.getInstance().getCallBackFunctionName(nRecvPacketId);
			
			// Requested network options 
			NetReqOptions networkOptions = (NetReqOptions)HttpPacketManager.getInstance().getNetworkOptions(nRecvPacketId);
			
			// Requested progressDialog
			// 요청시 생성한 프로그래스 다이얼로그(인디게이터)를 제거한다. 
			HttpPacketManager.getInstance().removeProgressDialog(nRecvPacketId);
			
			// 요청에 대한 결과가 성공일 경우
			if (strResultCode.compareTo("200") == 0) {
				// 요청한 화면으로 수신한 데이터를 리턴한다.
				selectedActivity.responseData(IActivityNetworkable.RESPONSE_DATA_TYPE_HTTP, strTrCode, callBackFunc, bodyDataJson.toString(), networkOptions);
			} else {
				
				HttpPacketManager.getInstance().removeAllProgressDialog();
				
				// 요청에 대한 결과가 실패인 경우 에러처리를 한다.  
				handlingError(selectedActivity, strTrCode, Integer.valueOf(strResultCode), strResultMsg, networkOptions);
			}
		} else {
			HttpPacketManager.getInstance().removeAllProgressDialog();
			//AbstractActivity topAct = (AbstractActivity)ActivityHistoryManager.getInstance().getTopActivity();
			// 요청에 대한 결과가 실패인 경우 에러처리를 한다.  
			//handlingError(topAct, strTrCode, Integer.valueOf(strResultCode), strResultMsg, null);
		}
		
		// Remove packet information after finish to process received data.
		// 요청 패킷 풀에서 수신한 패킷의 정보를 제거한다.
		HttpPacketManager.getInstance().removePacketInfo(nRecvPacketId);

	}
	
	/**
	 * 네트워크 에러 처리 <br/>
	 * 내부 통신 에러가 아닌 경우에는 화면(Activity)에 에러 메시지를 전달한다.
	 * @param activity 요청화면 객체 
	 * @param trCode 전문 코드  
	 * @param errCode 에러 코드 
	 * @param errMessage 에러 메시지
	 */
	public synchronized void handlingError(final AbstractActivity activity, final String trCode, final int errCode, final String errMessage, final NetReqOptions netReqOpt)
	{
		PLog.i(CLASS_TAG, "// Handling Error trCode[" + trCode + "], errCode[" + errCode + "], errMessage[" + errMessage + "]");
		
		if (activity != null) {
			
	    	activity.runOnUiThread(new Runnable(){
	            @Override
	            public void run() {
	
	 	        	String code = String.valueOf(errCode);
	 	        	String message = errMessage;
	 	        	
					switch(errCode) {
					case LibDefinitions.errstatus.ERROR_CONNECTION:
					case LibDefinitions.errstatus.ERROR_INTERNAL_NETWORK:
		 	        	if (message == null || message.equals(""))
		 	        		message = activity.getString(Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_network_connection_error"));
		 	        	Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
		 	        	activity.handlingError(_agent, trCode, code, message, netReqOpt);
		 	        	break;
					case LibDefinitions.errstatus.ERROR_CANT_FIND_NETWORK:
						message = activity.getString(Utils.getDynamicID(commHandle.getApplicationContext(), "string", "mp_network_connection_error"));
						Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
						activity.handlingError(_agent, trCode, code, message, netReqOpt);
		 	        	break;
					case LibDefinitions.errstatus.ERROR_RETUREND_SERVER_ERROR:
					case LibDefinitions.errstatus.ERROR_URL:
					default:
						activity.handlingError(_agent, trCode, code, message, netReqOpt);
						break;
					}
		        }
	        });
		}
	}
	
	/**
	 * 통신 모듈 내부 에러 처리
	 * 아래 메서드는 반드시 구현되어야 한다. 
	 * @param errCode 에러 코드 
	 * @param errMessage 에러 메시지
	 */
	@Override
	public synchronized void handlingError(final int errCode, final String errMessage, final int packetSeq) {
        // Clear all packet information
		//HttpPacketManager.getInstance().clearAllPacketInfo();

		NetReqOptions netReqOptions = HttpPacketManager.getInstance().getNetworkOptions(packetSeq);
		String trCode = (String) HttpPacketManager.getInstance().getTrCode(packetSeq);
		
		// 다이얼로그 제거
		HttpPacketManager.getInstance().removeProgressDialog(packetSeq);
		
		// If sending packet is failed, remove sending failed packet.
		// 요청이 실패하는 경우 이미 저장된 패킷 정보를 제거한다.
		HttpPacketManager.getInstance().removePacketInfo(packetSeq);
		
		// 내부에서 에러가 리턴되는 경우에는 현재 화면으로 에러 메시지를 전달한다.
		AbstractActivity topAct = (AbstractActivity)ActivityHistoryManager.getInstance().getTopActivity();

		handlingError(topAct, trCode, errCode, errMessage, netReqOptions);
	}
	
	public synchronized void handlingError(final int errCode, final int resId, final int packetSeq)
	{
		AbstractActivity topAct = (AbstractActivity)ActivityHistoryManager.getInstance().getTopActivity();
		String strErrMsg = "";
		if (topAct != null) strErrMsg = topAct.getString(resId);
		handlingError(errCode, strErrMsg, packetSeq);
	}
	
	@Override
	public void disconnect() {
		
		// Clear all packet information
		HttpPacketManager.getInstance().clearAllPacketInfo();
		
		// You must call disconnect method of super below
		super.netDisconnect();
	}
	
	
//	public void extendResourceFileDownload(String _updateUrl, File _downFile, DownloadResourcesThread _downloadResourcesThread) {
//		PLog.i(CLASS_TAG, "extendResourceFileDownload");
//		(new ExtendResourceDownload(_updateUrl, _downFile, _downloadResourcesThread)).start();
//	}
//	
//	/**
//	 * 선택된 버전의 분할 리소스 다운로드 쓰레드
//	 * @author rebornvlolv
//	 */
//
//	private class ExtendResourceDownload extends Thread {
//		
//		private static final int BUFFER_SIZE = 1024 * 4;
//		private static final int BASE_VAR_NUM = 1024 * 10;
//
//		private String downloadUrl;
//		private File downFile;
//		private DownloadResourcesThread downloadResourcesThread;
//		
//		boolean isSuccess = true;
//		
//		public ExtendResourceDownload(String _updateUrl, File _downFile, DownloadResourcesThread _downloadResourcesThread) {
//			try {
//				downloadUrl = _updateUrl.trim();
//				downFile = _downFile;
//				downloadResourcesThread = _downloadResourcesThread;
//			}catch(Exception e) {
//				PLog.printTrace(e);
//			}
//		}
//		
//		public void run() {
//			
//			try {
//				PLog.i(CLASS_TAG, downloadUrl);
//				PLog.i("onProgress", "외부 모듈을 이용하여 다운로드 합니다.");
//				PLog.i("onProgress", "Will download res file[" + downFile.getPath() + "]");
//				
//				////////////////////////////////////////////////////////////////////////////////
//				// 현재 버전의 파일을 다운로드 한다.
//				URL _url = new URL(downloadUrl);
//				HttpURLConnection con = null;
//				con = (HttpURLConnection) _url.openConnection();
//				con.setRequestMethod("GET");   
//				con.setConnectTimeout(10000);
//				con.setReadTimeout(10000);
//				con.setUseCaches(false);
//				con.setDoInput(true);
//				con.setDoOutput(false);
//				con.connect();
//				
//				byte[] buffer=new byte[BUFFER_SIZE];
//				BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(downFile));
//				BufferedInputStream in = new BufferedInputStream(con.getInputStream());
//				
//				int baseVarNum = BASE_VAR_NUM;
//				int accRead = 0;
//				int read = 0;
//				while((read = in.read(buffer)) != -1) {
//					
//					// 리소스 업데이트 오류가 발생한 경우 압축해제 중지
//					if (HttpAppUpdatingManager.getIsFailAppUpdating()) return;
//					
//					accRead += read;
//					out.write(buffer, 0, read);
//					if (accRead > baseVarNum) {
//						baseVarNum += BASE_VAR_NUM;
//						//다운로드 중간 화면으로 현재 상태를 리포트
//						HttpAppUpdatingManager.deliveryProgressInfo(read);
//					} else {
//						//다운로드 중간 화면으로 현재 다운로드 상태를 저장함.
//						HttpAppUpdatingManager.setTotReceivedData(HttpAppUpdatingManager.getTotReceivedData() + read);
//					}
//				}
//				out.flush();
//				out.close();
//				in.close();
//				con.disconnect();
//				con = null;
//				
//				//리소스 다운로드 종료후 반드시 호출해 줘야 
//				downloadResourcesThread.downloadFinish();
//				
//			}catch(Exception e) {
//				HttpAppUpdatingManager.processResUpdateError();
//				PLog.i("UpdateResource RES", "httpUpdateCallBack.onFail #3");
//			}
//			
//		}
//		
//	}
}
