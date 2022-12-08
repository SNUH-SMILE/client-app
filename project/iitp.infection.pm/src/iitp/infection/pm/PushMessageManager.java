package iitp.infection.pm;

import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.common.Parameters;
import m.client.android.library.core.control.Controller;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.view.MainActivity;
import m.client.push.library.PushManager;
import m.client.push.library.common.PushConstants;
import m.client.push.library.utils.PushUtils;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.webkit.WebView;

public class PushMessageManager extends Activity {
	private CommonLibHandler mCommLibHandle = CommonLibHandler.getInstance();
	private PushManager mPushManager = PushManager.getInstance();
	
	
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	super.onCreate(savedInstanceState);
    	
    	requestWindowFeature(Window.FEATURE_NO_TITLE);
    	//private AbstractActivity thisObj = (AbstractActivity)ActivityHistoryManager.getInstance().getTopActivity();
    	
    	Intent intent = getIntent(); 
    	String notification = intent.getStringExtra("JSON");
    	final String pushType = intent.getStringExtra("PUSH_TYPE");
    	final String pushStatus = intent.getStringExtra("PUSH_STATUS");
    	final String originData = intent.getStringExtra("ENCRYPT");
    	   Logger.e("================ encrypt ================"); 
           Logger.e(originData);
           Logger.e("================ !encrypt ================"); 
    	JSONObject payload = null;
    	try {
			payload = new JSONObject(notification);
			payload.put("ns", pushType);
			notification = payload.toString();
		} catch (JSONException e) {
			e.printStackTrace();
		}
    	
    	mPushManager.setPushJsonData(this, notification);
		
		// 프로그램이 정상적으로 구동되지 않고 바로 실행되는 경우에는 프로그램 초기화 처리를 거쳐야 한다. 
    	
    	//Log.d("mCommLibHandle.g_strExtWNIClassPackageName",mCommLibHandle.g_strExtWNIClassPackageName);
		 MainActivity _activity = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();

		if (mCommLibHandle.g_strExtWNIClassPackageName == null || _activity == null) {
			Log.d("PushMessageManager", "PushMessageManager Process App Init!!");
			CommonLibUtil.setVariable("payload", notification);
	    	CommonLibUtil.setVariable("type", pushType);
			CommonLibUtil.setVariable("status", PushConstants.APP_STATUS_START);
			
			// Startup 과 같은 초기화 작업
//			mCommLibHandle.processAppInit(this,false);
			if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
				WebView.setWebContentsDebuggingEnabled(true);
			}
			mCommLibHandle.processAppInit(this);
			//CommonLibUtil.setDefaultTabAnimation(0, 0, "", this);
			
			// 파라메터 설정
//			Parameters pubParams = new Parameters();
//
//			// 파라메터 정보를 보내는 경우
//			Parameters inParam = new Parameters();
//			JSONObject tempJSON = new JSONObject();
//
//			try {
//				tempJSON.put("payload", notification);
//				tempJSON.put("type", pushType);
//				tempJSON.put("encrypt", originData);
//				tempJSON.put("status", PushConstants.APP_STATUS_START);
//			} catch (JSONException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//
//			inParam.putParam("notiData", tempJSON.toString());
//			inParam.putParam("enter", "outApp");
//			pubParams.putParam("PARAMETERS", inParam.getParamString());
//
//			// 웹 컨테이너에서 보여질 html 페이지
//			pubParams.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + "www/html/IITP_ALARM_V001.html");
//
//			// 화면 방향 설정
//			// DEFAULT : 단말기에서 기본적으로 제공되는 방향 설정 적용
//		    // PORT : 세로 고정
//		    // LAND : 가로 고정
//		    // ALL : 가로, 세로 방향 변경 가능
//			pubParams.putParam("ORIENT_TYPE", "PORT");
//
//			// Action type
//			// NEW_SCR : 대상이 되는 화면을 화면 관리 스택에 새롭게 추가한다.
//	        // NO_HISTORY : 대상이 되는 화면을 화면 관리 스택에 추가하지 않는다.
//	        // CLEAR_TOP : 대상이 되는 이전 화면으로 이동한다. 이동시 현재 화면에서 대상 화면 사이의 모든 화면들은 제거된다.
//	    	int actionType = CommonLibUtil.getActionType("NEW_SCR");
//
//	    	// Animation Type
//	    	// DEFALUT : 왼쪽으로 이동되는 슬라이드 효과(SLIDE_LEFT)
//	        // NONE : 애니메이션 효과 없음
//	        // SLIDE_LEFT : 왼쪽으로 이동되는 슬라이드 효과
//	        // SLIDE_RIGHT : 오른쪽으로 이동되는 슬라이드 효과
//	        // SLIDE_TOP : 위쪽으로 이동되는 슬라이드 효과
//	        // SLIDE_BOTTOM : 아래쪽으로 이동되는 슬라이드 효과
//	        // ZOOM_IN : 줌인 효과
//	        // ZOOM_OUT : 줌아웃 효과
//	        // FADE : 페이드 효과
//	        // MODAL_UP : 원본 화면은 고정되어 있고 대상 화면만 위쪽으로 이동되는 슬라이드 효과
//	        // MODAL_DOWN : 원본 화면은 고정되어 있고 대상 화면만 아래쪽으로 이동되는 슬라이드 효과
//
//	    	// 하이브리드 웹화면으로 이동시에는 타겟 클래스 인텍스가 반드시 LibDefinitions.libactivities.ACTY_MAIN 이어야 한다.
//
//
//	    	//thisObj.setViewForMovingScreen(thisObj.getRootView(this));
//
//	    	Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN,
//	    												actionType,
//	    												this,
//	    												"MODAL_UP",
//	    												pubParams);
//	    	finish();
			CommonLibUtil.setVariable("_PUSHDATA", notification);
			Logger.e(CommonLibUtil.getVariable("_PUSHDATA"));
		}
		else { // 푸시 웹 화면을 호출한다.
			Log.d("PushMessageManager", "PushMessageManager Action Move Push Activity!!" + notification);

			final MainActivity activity = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			final String status = (pushStatus == null)? PushConstants.APP_STATUS_START  : pushStatus;    
			final String payloadVal = notification;
			activity.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					JSONObject tempJSON = new JSONObject();
					
					try {
						tempJSON.put("payload", payloadVal);
						tempJSON.put("type", pushType);
						tempJSON.put("status", status);
						tempJSON.put("encrypt", originData);
						
						Log.e("PushMessageManager", "Push message!!" + tempJSON.toString());
						activity.getWebView().loadUrl("javascript:onReceiveNotification("+tempJSON.toString()+")");

					//	CommonLibUtil.setVariable("_PUSHDATA", payloadVal);
					} 
					catch (Exception e) {
						e.printStackTrace();
					}
				}
			});
			
		    finish();
		}
    }
}
