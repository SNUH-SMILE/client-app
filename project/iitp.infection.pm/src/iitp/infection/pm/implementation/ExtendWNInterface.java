package iitp.infection.pm.implementation;

import m.client.android.library.core.bridge.InterfaceJavascript;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.AbstractActivity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.view.KeyEvent;
import android.webkit.WebView;

/**
 * ExtendWNInterface Class
 * 
 * @author 류경민(<a mailto="kmryu@uracle.co.kr">kmryu@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2011.04</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * 사용자 정의 확장 인터페이스 구현
 * 
 * Copyright (c) 2011-2013 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */
public class ExtendWNInterface extends InterfaceJavascript {

	/**
	 * 아래 생성자 메서드는 반드시 포함되어야 한다. 
	 * @param callerObject
	 * @param webView
	 */
	public ExtendWNInterface(AbstractActivity callerObject, WebView webView) {
		super(callerObject, webView);
	}
	
	/**
	 * 보안 키보드 데이터 콜백 함수 
	 * @param data 
	 */
	public void wnCBSecurityKeyboard(Intent data) {  
		// callerObject.startActivityForResult(newIntent,libactivities.ACTY_SECU_KEYBOARD);
	}
	
	////////////////////////////////////////////////////////////////////////////////
	// 사용자 정의 네이티브 확장 메서드 구현
	
	//
	// 아래에 네이티브 확장 메서드들을 구현한다.
	// 사용 예
	//
	public String exWNTestReturnString(String receivedString) {
		String newStr = "I received [" + receivedString + "]";
		return newStr;
	}
	
	/**
	 * WebViewClient의 shouldOverrideUrlLoading()을 확장한다.
	 * @param view
	 * @param url
	 * @return 
	 * 		InterfaceJavascript.URL_LOADING_RETURN_STATUS_NONE	확장 구현을하지 않고 처리를 모피어스로 넘긴다.
	 * 		InterfaceJavascript.URL_LOADING_RETURN_STATUS_TRUE	if the host application wants to leave the current WebView and handle the url itself
	 * 		InterfaceJavascript.URL_LOADING_RETURN_STATUS_FALSE	otherwise return false.
	 */
	public int extendShouldOverrideUrlLoading(WebView view, String url) {

		// Custom url schema 사용 예
//		if(url.startsWith("custom:")) {
//		    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
//		    callerObject.startActivity( intent ); 
//    		return InterfaceJavascript.URL_LOADING_RETURN_STATUS_FALSE;
//    	}
		
		return InterfaceJavascript.URL_LOADING_RETURN_STATUS_NONE;
	}
	
	/**
	 * 페이지 로딩이 시작되었을때 호출된다.
	 * @param view
	 * @param url
	 * @param favicon
	 */
	public void onExtendPageStarted (WebView view, String url, Bitmap favicon) {
		PLog.i("", ">>> 여기는 ExtendWNInterface onPageStarted입니다!!!");
	}
	
	/**
	 * 페이지 로딩이 완료되었을때 호출된다.
	 * @param view
	 * @param url
	 */
	public void onExtendPageFinished(WebView view, String url) {
		PLog.i("", ">>> 여기는 ExtendWNInterface onPageFinished!!!");
	}
	
	/**
	 * Give the host application a chance to handle the key event synchronously
	 * @param view
	 * @param event
	 * @return True if the host application wants to handle the key event itself, otherwise return false
	 */
	public boolean extendShouldOverrideKeyEvent(WebView view, KeyEvent event) {
		
		return false;
	}
	
	/**
	 * onActivityResult 발생시 호출.
	 */
	public void onExtendActivityResult(Integer requestCode, Integer resultCode, Intent data) {
		PLog.i("", ">>> 여기는 ExtendWNInterface onExtendActivityResult!!!  requestCode => [ " + requestCode + " ], resultCode => [ " + resultCode + " ]");
	}
	
	/*
	public String syncTest(String param1, String param2) {
		return param1 + param2;
	}
	
	public void asyncTest(final String callback) {
		callerObject.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				String format = "javascript:%s('abc', 1, {'a':'b'});";
				String jsString = String.format(format, callback);
				PLog.d("asyncTest", jsString);
    			webView.loadUrl(jsString);
			}
		});
	}
	*/
}
