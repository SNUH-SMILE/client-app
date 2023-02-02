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
	private final CommonLibHandler mCommLibHandle = CommonLibHandler.getInstance();
	private final PushManager mPushManager = PushManager.getInstance();
	
	
	
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
    	JSONObject payload = null;
	    MainActivity _activity = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
    	try {
			payload = new JSONObject(notification);
			payload.put("ns", pushType);
		    if (mCommLibHandle.g_strExtWNIClassPackageName == null || _activity == null) {
			    payload.put("status", PushConstants.APP_STATUS_START);
		    }else{
			    boolean isRunningApp = PushUtils.isRunningPushApps(this);
				payload.put("status", (isRunningApp)? PushConstants.APP_STATUS_ACTIVE : PushConstants.APP_STATUS_BACKGROUND);
		    }
			notification = payload.toString();
		} catch (JSONException e) {
			e.printStackTrace();
		}
    	
    	mPushManager.setPushJsonData(this, notification);
		
		// 프로그램이 정상적으로 구동되지 않고 바로 실행되는 경우에는 프로그램 초기화 처리를 거쳐야 한다. 
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

			CommonLibUtil.setVariable("_PUSHDATA", notification);
			finish();

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
						
						Log.e("PushMessageManager", "Push message!!" + tempJSON);
						activity.getWebView().loadUrl("javascript:onReceiveNotification("+ tempJSON +")");

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

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		Logger.e("new Intent");
	}
}
