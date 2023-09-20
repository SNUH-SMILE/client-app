package iitp.infection.pm;

import iitp.infection.pm.band.BandCont;
import iitp.infection.pm.samples.utils.ComListener;

import iitp.infection.pm.samples.utils.CommUtils;
import m.client.android.library.core.control.Controller;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.view.MainActivity;
import m.client.push.library.common.Logger;
import m.client.push.library.common.PushConstants;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.WebView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * BaseActivity Class
 * 
 * @author 김태욱(<a mailto="tukim@uracle.co.kr">tukim@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2013.08.01</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * 모피어스 내에서 제공되는 모든 Web 페이지의 기본이 되는 Activity
 * html 화면은 모두 BaseActivity 상에서 출력된다.
 * 제어를 원하는 이벤트들은 overriding 하여 구현하며, 각각 페이지 별 이벤트는 화면 단위로 분기하여 처리한다.
 * 플랫폼 내부에서 사용하는 클래스로 해당 클래스의 이름은 변경할 수 없다.
 * 
 * Copyright (c) 2001-2011 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */

public class BaseActivity extends MainActivity {
	private final int REQUEST_ENABLE_BT = 1;
	private final String CLASS_TAG = BaseActivity.class.getSimpleName();
	/**
	 * Webview가 시작 될 때 호출되는 함수
	 */
	@Override
	public void onPageStarted (WebView view, String url, Bitmap favicon) {
		super.onPageStarted(view, url, favicon);
		WebView.setWebContentsDebuggingEnabled(true);
	}
	
	/**
	 * Webview내 컨텐츠가 로드되고 난 후 호출되는 함수
	 */
	@Override
	public void onPageFinished(WebView view, String url)  {
		super.onPageFinished(view, url);
		
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//우선 임시로 시작하자마자 foreground 서비스를 구동 시키자
		//추후에는 해당 영역 주석으로 막고 사용자가 자가격리 주소를 저장하고, 로그인을 하는 시점에 foreground 서비스를 화면단에서 호출하는 형태로 변
		boolean isForegroundRunning = new CommUtils().isServiceRunning(this,IitpFGService.class.getName());
		Log.d(CLASS_TAG,"onCreate() isForegroundRunning:"+isForegroundRunning);
		/*if(!isForegroundRunning){
			Intent intent = new Intent(this, IitpFGService.class);
			if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
				startForegroundService(intent);
			}else{
				startService(intent);
			}
		}*/

	}

	@Override
	protected void onResume() {
		super.onResume();

		String push = CommonLibUtil.getVariable("_PUSHDATA");

		if(!TextUtils.isEmpty(push)){
			JSONObject object = null;
			try {
				object = new JSONObject(push);
				Logger.e(object.toString(2));
				String status = object.optString("status");
				if(!status.equals(PushConstants.APP_STATUS_START)) {
					//CommonLibUtil.setVariable("_PUSHDATA", "");
					getWebView().loadUrl("javascript:onReceiveNotification(" + push + ")");
				}
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}


	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		//BandCont.getInstance(this,getApplicationContext(),null).mUnRegisterReceiver();
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		if(ComListener.mPermissionsResultListener != null) {
			ComListener.mPermissionsResultListener.onPermissionsResultListener(requestCode, permissions, grantResults);
		}
	}

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		super.onActivityResult(requestCode, resultCode, data);
		if (requestCode == REQUEST_ENABLE_BT && resultCode == Activity.RESULT_CANCELED) {
			Toast.makeText(this, R.string.bluetooth_Disabled, Toast.LENGTH_SHORT).show();
			return;
		}
		if (requestCode == REQUEST_ENABLE_BT && resultCode == Activity.RESULT_OK) {
			ComListener.mBluetoothResultListener.onBluetoothResultListener();
			return;
		}

	}

	@Override
	public void onBackPressed() {
		if(getWebView().getFilePath().contains("https://www.mobile-ok.com/")
				||getWebView().getFilePath().contains("https://connect.garmin.com/")
				||getWebView().getFilePath().contains("https://smile.hconnect.co.kr:44300/garmin/oauth")){
			finish();
		}
		super.onBackPressed();
	}
}
