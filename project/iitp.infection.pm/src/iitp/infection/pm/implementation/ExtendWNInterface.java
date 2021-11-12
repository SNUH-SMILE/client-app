package iitp.infection.pm.implementation;

import iitp.infection.pm.band.BandCont;
import iitp.infection.pm.band.BandScan;
import iitp.infection.pm.band.CommConfig;
import m.client.android.library.core.bridge.InterfaceJavascript;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.view.MainActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

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
	private String CLASS_TAG = ExtendWNInterface.class.getSimpleName();
	final MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
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
	/**
	* 밴드 스켄 시작
 	* 추후 밴드 종류에 따라 Scan 클래스는 달라져야 할 수도 있음
 	* new BandScan 은 Check fit 스마트 워치 업체에서 제공하는 SDK API 사용에 연결되어 있음
	* */
	private BandScan mBandScan;
	public void exBandScan(String schBand, final String callback){
		Log.d(CLASS_TAG, "exBandScan");
		//CommConfig.CHECKFIT_SMART_WATCH = schBand;
		if(schBand.equals(CommConfig.CHECKFIT_SMART_WATCH)){
			mBandScan = new BandScan(topAct,callerObject.getApplicationContext(),callback);
		}
	}
	public void exBandScan(String obj){

		try {
			JSONObject object = new JSONObject(obj);
			Log.d(CLASS_TAG, "exBandScan ");
			//CommConfig.CHECKFIT_SMART_WATCH = object.optString("schBand","COVID") ;
			String schBand = object.optString("schBand","");
			if(schBand.equals(CommConfig.CHECKFIT_SMART_WATCH)){
				mBandScan = new BandScan(topAct,callerObject.getApplicationContext(),object.optString("callback","cbBandList"));
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}

	}
	/**
	 * 밴드 스켄 중지
	 * 추후 밴드 종류에 따라 Scan 중지 클래스는 달라져야 할 수도 있음
	 * bandScanStop() 은 Check fit 스마트 워치 업체에서 제공하는 SDK API 사용에 연결되어 있음
	 * */
	public void exBandScanStop(){
		mBandScan.getInstance(topAct,callerObject.getApplicationContext()).bandScanStop();
	}
	/**
	 * 밴드 connect
	 * 추후 밴드 종류에 따라 connect 클래스는 달라져야 할 수도 있음
	 * new BandCont 은 Check fit 스마트 워치 업체에서 제공하는 SDK API 사용에 연결되어 있음
	 * */
	private BandCont mBandCont;
	public void exBandConnect(String connBand, String bandAddr){
		if(connBand.equals(CommConfig.CHECKFIT_SMART_WATCH)){
			mBandScan.getInstance(topAct,callerObject.getApplicationContext()).bandScanStop();
			//mBandScan.bandScanStop();
			mBandCont = new BandCont(topAct,callerObject.getApplicationContext());
			mBandCont.BandConnect(bandAddr);
		}
	}
	/**
	 * 밴드 데이터 동기화
	 * 추후 밴드 종류에 따라 데이터 동기화 클래스는 달라져야 할 수도 있음
	 * bandDataSync 은 Check fit 스마트 워치 업체에서 제공하는 SDK API 사용에 연결되어 있음
	 **/
	public void exBandDataSync(){
		mBandCont.getInstance(topAct,callerObject.getApplicationContext()).bandDataSync(mBandCont.BAND_SYNC_STEP);//스텝 싱크 시작
		//mBandCont.bandDataSync(mBandCont.BAND_SYNC_STEP);

	}
	/**
	* 메인 화면에서 사용할 당일 전체 Check Fit 데이터
	**/
	public void exMainAllData(String callback){

	}


}
