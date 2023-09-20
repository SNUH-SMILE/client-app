package iitp.infection.pm.implementation;

import iitp.infection.pm.IitpFGService;
import iitp.infection.pm.R;
import iitp.infection.pm.band.BandCont;
import iitp.infection.pm.band.BandQueryDataSet;
import iitp.infection.pm.band.BandScan;
import iitp.infection.pm.band.CommConfig;
import iitp.infection.pm.band.DataQuery;
import iitp.infection.pm.database.DBConfig;
import iitp.infection.pm.gps.GpsTracker;
import iitp.infection.pm.samples.utils.CommUtils;
import m.client.android.library.core.bridge.InterfaceJavascript;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.view.MainActivity;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebView;
import android.widget.Toast;

import com.yc.pedometer.utils.CalendarUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;


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
	public void exBandScan(String schBluetooth, final String callback){
		Log.d(CLASS_TAG, "exBandScan");
		//CommConfig.CHECKFIT_SMART_WATCH = schBluetooth;
		MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
		if(Arrays.asList(CommConfig.SMART_WATCH_FILTER).contains(CommConfig.SMART_WATCH_FILTER[0])){
			mBandScan = BandScan.getInstance(topAct,callerObject.getApplicationContext(),callback);
		}
	}
	public void exBandScan(String obj){
		MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
		try {
			JSONObject object = new JSONObject(obj);
			Log.d(CLASS_TAG, "exBandScan ");
			String schBluetooth = object.optString("schBluetooth","");
			if(Arrays.asList(CommConfig.SMART_WATCH_FILTER).contains(CommConfig.SMART_WATCH_FILTER[0])){
				mBandScan = BandScan.getInstance(topAct,callerObject.getApplicationContext(),object.optString("callback","cbBandList"));
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
		mBandScan.bandScanStop();
	}
	/**
	 * 밴드 connect
	 * 추후 밴드 종류에 따라 connect 클래스는 달라져야 할 수도 있음
	 * new BandCont 은 Check fit 스마트 워치 업체에서 제공하는 SDK API 사용에 연결되어 있음
	 * */
	private BandCont mBandCont;
	public void exBandConnect(String obj){
		MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
		try {
			JSONObject object = new JSONObject(obj);
			String schBluetooth = object.optString("schBluetooth","");
			String bandAddr = object.optString("bandAddr","");
			String callback = object.optString("callback","connectResult");
			CommConfig.dataResetType = object.optString("resetType","2");

			if(Arrays.asList(CommConfig.SMART_WATCH_FILTER).contains(CommConfig.SMART_WATCH_FILTER[0])){
				mBandScan.bandScanStop();
				mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),callback);
				mBandCont.BandConnect(bandAddr);
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	//밴드 연결 해제
	public void exBandDisconnect(){
		MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
		mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		if(mBandCont != null){
			mBandCont.BandDisConnect();
			mBandCont.newBandContAble = true;
		}
	}
	//밴드 연결 상태 체크
	public String exIsBandConnect(){
		if(mBandCont == null){
			MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		}
		boolean state = mBandCont.isBandConnected();
		Log.d(CLASS_TAG,"exIsBandConnect() state : "+ state);
		return state ? "T" : "F";
	}
	/**
	 * 밴드 데이터 동기화
	 * 추후 밴드 종류에 따라 데이터 동기화 클래스는 달라져야 할 수도 있음
	 * bandDataSync 은 Check fit 스마트 워치 업체에서 제공하는 SDK API 사용에 연결되어 있음
	 **/
	public void exBandAllDataSync(String popupShowState){
		if(mBandCont == null){
			Toast.makeText(callerObject,"밴드 연결 상태를 확인해 주세요.",Toast.LENGTH_SHORT).show();
			return;
		}
		CommConfig.PROGRESS_BAR_SHOW = Boolean.valueOf(popupShowState);
		mBandCont.bandDataSync(mBandCont.BAND_SYNC_STEP);//스텝 싱크 시작
	}
	
	/**
	* 메인 화면에서 사용할 당일 전체 Check Fit 데이터
	**/
	DataQuery mDataQuery = new DataQuery(callerObject.getApplicationContext(), DBConfig.BAND_SDK_DB_NAME,13);
	public void exMainAllData(final String callback){
		if(mBandCont == null){
			MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		}
		final BluetoothDevice deviceInfo = mBandCont.isBandConnectedInfo();
		callerObject.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				BandQueryDataSet.isDetailQuery = false;
				JSONObject resultObj;// = new JSONObject();
				JSONObject queryObj;

				try {
					String toDay = CalendarUtils.getCalendar(0);
					resultObj = new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_0000),callerObject.getString(R.string.MSG_0000));
					queryObj =  mDataQuery.queryCommDbStep(toDay,deviceInfo.getAddress());//스탭 쿼리
					resultObj.put("todayStepCountList",queryObj.optJSONArray("stepCountList"));
					queryObj = mDataQuery.queryCommDbSleep(toDay,deviceInfo.getAddress());//수면 쿼리
					resultObj.put("todaySleepTimeList",queryObj.optJSONArray("sleepTimeList"));
					resultObj.put("todayTotalSleepTime",queryObj.optString("totalSleepTime",""));
					queryObj = mDataQuery.queryCommDbRate(toDay,deviceInfo.getAddress());//심박 쿼리
					resultObj.put("todayHrList",queryObj.optJSONArray("hrList"));
					queryObj = mDataQuery.queryCommDbBlood(toDay,deviceInfo.getAddress());//혈압
					resultObj.put("todayBpList",queryObj.optJSONArray("bpList"));
					queryObj = mDataQuery.queryCommDbOxygen(toDay,deviceInfo.getAddress());//혈중산소포화도
					resultObj.put("todaySpO2List",queryObj.optJSONArray("spO2List"));
					queryObj = mDataQuery.queryCommDbTemp(toDay,deviceInfo.getAddress());//체온
					resultObj.put("todayBtList",queryObj.optJSONArray("btList"));
				} catch (JSONException e) {
					e.printStackTrace();
					resultObj = new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_9999),callerObject.getString(R.string.MSG_9999));
				}
				String script = String.format("javascript:"+callback+"("+resultObj+")");
				((MainActivity)callerObject).getWebView().loadUrl(script);
			}
		});

	}
	/**
	* 서버에 생체 데이터 동기화(전송) 시 사용할 데이터 조회
	**/
	public void exServerSyncData(final String callbackFun){
		if(mBandCont == null){
			MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		}
		callerObject.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				BandQueryDataSet.isDetailQuery = false;
				JSONObject resultObj;// = new JSONObject();
				JSONObject queryObj;

				try {
					resultObj = new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_0000),callerObject.getString(R.string.MSG_0000));
					queryObj =  mDataQuery.serverSendQueryCommDbStep();//스탭 쿼리
					resultObj.put("stepCountList",queryObj.optJSONArray("stepCountList"));
					queryObj = mDataQuery.serverSendQueryCommDbSleep();//수면 쿼리
					resultObj.put("sleepTimeList",queryObj.optJSONArray("sleepTimeList"));
					queryObj = mDataQuery.serverSendQueryCommDbRate();//심박 쿼리
					resultObj.put("hrList",queryObj.optJSONArray("hrList"));
					queryObj = mDataQuery.serverSendQueryCommDbBlood();//혈압
					resultObj.put("bpList",queryObj.optJSONArray("bpList"));
					queryObj = mDataQuery.serverSendQueryCommDbOxygen();//혈중산소포화도
					resultObj.put("spO2List",queryObj.optJSONArray("spO2List"));
					queryObj = mDataQuery.serverSendQueryCommDbTemp();//체온
					resultObj.put("btList",queryObj.optJSONArray("btList"));
				} catch (JSONException e) {
					e.printStackTrace();
					resultObj = new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_9999),callerObject.getString(R.string.MSG_9999));
				}
				String script = String.format("javascript:"+callbackFun+"("+resultObj+")");
				((MainActivity)callerObject).getWebView().loadUrl(script);
			}
		});
	}
	/**
	* 서버에 생체 데이터 동기화(전송) 완료 후 로컬 공통 DB(SmartBand.db)에 서버 동기화 완료 값으로 데이터 업데이
	**/
	public void exServerSyncDataFinish(){
		mDataQuery.bodyDataServerSyncOKUpdate();
	}
	/**
	 * 생체 데이터 개별 상세 조회 시 
	 **/
	public void exBodyDetailData(String obj){
		Log.d(CLASS_TAG,"exBodyDetailData()");
		if(mBandCont == null){
			MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		}
		try {
			final BluetoothDevice deviceInfo = mBandCont.isBandConnectedInfo();
			JSONObject object = new JSONObject(obj);
			final String schDate = object.optString("schDate","");
			final String queryDataType = object.optString("queryDataType","");
			final String callback = object.optString("callback","");
			BandQueryDataSet.isDetailQuery = true;
			callerObject.runOnUiThread(new Runnable() {
				@Override
				public void run() {
					JSONObject resultobj = new JSONObject();
					if(schDate.isEmpty() || queryDataType.isEmpty() || callback.isEmpty()){
						resultobj= new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_9990), callerObject.getString(R.string.MSG_9990));
					}else{
						resultobj= new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_0000), callerObject.getString(R.string.MSG_0000));
						try {
							switch (queryDataType){
								case "STEP":
									JSONObject stepJSON = mDataQuery.queryCommDbStep(schDate,deviceInfo.getAddress());
									resultobj.put("stepCountList",stepJSON.getJSONArray("stepCountList"));
									break;
								case "SLEEP":
									JSONObject sleepJSON = mDataQuery.queryCommDbSleep(schDate,deviceInfo.getAddress());
									resultobj.put("sleepTimeList",sleepJSON.getJSONArray("sleepTimeList"));
//									resultobj.put("totalSleepTime",sleepJSON.getString("totalSleepTime"));
//									resultobj.put("resultStartDateTime",sleepJSON.getString("resultStartDateTime"));
//									resultobj.put("resultEndDateTime",sleepJSON.getString("resultEndDateTime"));
									break;
								case "RATE":
									JSONObject rateJSON = mDataQuery.queryCommDbRate(schDate,deviceInfo.getAddress());
									resultobj.put("hrList",rateJSON.getJSONArray("hrList"));
									break;
								case "TEMP":
									JSONObject tempJSON = mDataQuery.queryCommDbTemp(schDate,deviceInfo.getAddress());
									resultobj.put("btList",tempJSON.getJSONArray("btList"));
									break;
								case "OXYGEN":
									JSONObject oxygenJSON = mDataQuery.queryCommDbOxygen(schDate,deviceInfo.getAddress());
									resultobj.put("spO2List",oxygenJSON.getJSONArray("spO2List"));
									//resultobj = mDataQuery.queryOxygenCustom(schDate);
									break;
								case "BLOOD":
									JSONObject bloodJSON = mDataQuery.queryCommDbBlood(schDate,deviceInfo.getAddress());
									resultobj.put("bpList",bloodJSON.getJSONArray("bpList"));
									//resultobj = mDataQuery.queryBloodCustom(schDate);
									break;
								default:
									break;
							}
						}catch (JSONException e) {
							e.printStackTrace();
							resultobj= new CommUtils().setJSONResutlCode(callerObject.getString(R.string.CD_9999), callerObject.getString(R.string.MSG_9999));
						}

					}
					String script = String.format("javascript:"+callback+"("+resultobj+")");
					((MainActivity)callerObject).getWebView().loadUrl(script);
				}
			});
			
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 밴드 언어 셋팅
	**/
	public void exWNSetBandLang(int lang){
		if(mBandCont == null){
			MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		}
		mBandCont.setBandLanguage(lang);
	}
	/**
	 * 밴드에 현재 셋팅된 언어 체크
	 **/
	public String exWNGetBandLang(){
		if(mBandCont == null){
			MainActivity topAct = (MainActivity) ActivityHistoryManager.getInstance().getTopActivity();
			mBandCont = BandCont.getInstance(topAct,callerObject.getApplicationContext(),null);
		}
		return String.valueOf(mBandCont.getBandLanguage());
	}
	private GpsTracker mMyGpsTracker;
	public void exWnCurrentLocationStart() {
		if (mMyGpsTracker == null) {
			mMyGpsTracker = new GpsTracker(callerObject.getApplicationContext());
		}

		mMyGpsTracker.setOnLocationListener(new GpsTracker.OnLocationListener() {
			@Override
			public void onResult(final Location location) {
				// TODO Auto-generated method stub
				Log.d(CLASS_TAG, "location = " + location);
				Log.d(CLASS_TAG, "location.getLatitude() = " + location.getLatitude());
				Log.d(CLASS_TAG, "location.getLongitude() = " + location.getLongitude());
				callerObject.runOnUiThread(new Runnable() {
					@Override
					public void run() {
						((MainActivity)callerObject).getWebView().loadUrl("javascript:OnCurrentLocation('" + location.getLatitude() + "','"+location.getLongitude()+"');");
					}
				});
			}
		});
		mMyGpsTracker.startCurrentLocation();
	}

	public String exWnLastKnownLocation() {
		JSONObject object = new JSONObject();
		final LocationManager lm = (LocationManager) callerObject.getSystemService(Context.LOCATION_SERVICE);
		@SuppressLint("MissingPermission")
		Location location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
		try {
			object.put("provider", location.getProvider());// 위치정보
			object.put("longitude", location.getLongitude());// 위도
			object.put("latitude", location.getLatitude());// 경도
			object.put("altitude", location.getAltitude());// 고도
		} catch (JSONException e) {
		}
		return object.toString();
	}

	public void exWnCurrentLocationStop() {
		GpsTracker.getInstance(callerObject.getApplicationContext()).stopCurrentLocation();
	}
	//혈압 측정 시작 요청
	public void exBloodPresureTestStart(){
		mBandCont.BloodPressureCheck("START");
	}
	//혈압 측정 종료 요청
	public void exBloodPresureTestStop(){
		mBandCont.BloodPressureCheck("STOP");
	}
	//혈중 산소포화도 측정 요청
	public void exSpo2TestStart(){
		mBandCont.OxgenPressureCheck("START");
	}
	//혈중 산소포화도 측정 종료
	public void exSpo2TestStop(){
		mBandCont.OxgenPressureCheck("STOP");
	}
	//혈중 산소포화도 측정 중 여부
	public boolean exIsSpo2Test(){
		boolean result = false;
		result = mBandCont.IS_OXYGEN_CHECKING;
		Log.d(CLASS_TAG,"exIsSpo2Test() IS_OXYGEN_CHECKING : "+result);
		return result;
	}

	//앱 foreground 서비스 구동
	public void exForeGroundStart(){
		Intent intent = new Intent(callerObject, IitpFGService.class);
		if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
			callerObject.startForegroundService(intent);
		}else{
			callerObject.startService(intent);
		}
	}
	//foreground 서비스 종료
	public void exForeGroundStop(){
		Intent intent = new Intent(callerObject,IitpFGService.class);
		callerObject.stopService(intent);
	}
	//foreground 서비스 구동 상태
	public boolean exWNIsFGServiceRunning() {
		PLog.i(CLASS_TAG, "exWNIsFGServiceRunning()");
		return new CommUtils().isServiceRunning(callerObject,IitpFGService.class.getName());
	}

}
