package iitp.infection.pmtablet.samples.activity;

import m.client.android.library.core.control.Controller;
import m.client.android.library.core.model.NetReqOptions;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.common.DataHandler;
import m.client.android.library.core.common.Parameters;
import iitp.infection.pmtablet.R;
import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.EditText;

/**
 * SampleActivity2 Class
 * 
 * @author 류경민(<a mailto="kmryu@uracle.co.kr">kmryu@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.1 <br>
 *        <DT><B>Date: </B>
 *        <DD>2011.04</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 * 
 * 이 클래스는 네이티브 샘플 화면 액티비티이다. 
 * 네이티브 화면 액티비티를 추가할 경우에는 아래의 샘플을 참조한다.  
 * 
 * Copyright (c) 2001-2011 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */
public class SampleActivity2 extends AbstractActivity {
	
	private Activity thisObj;
	
	public SampleActivity2() {
		super();
		thisObj = this;
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.sample2);
		
		//NANIVE_ANIM
		//Orientation Setting 부분 반듯이 호출해야함.(호출하지 않으면 Orientation 관련 Error 발생 )
		setActivityOrientation();
		/*
		 * 받은 파라메터
		 */
		Parameters receivedParams = new Parameters(getParamsString());
		System.out.println(">> parameters : [" + receivedParams + "]");
		System.out.println(">> native_param1 : " + receivedParams.getParam("native_param1"));
		System.out.println(">> native_param2 : " + receivedParams.getParam("native_param2", "UTF-8"));	// URL Decoding
		
		// 받은 파라메터 문자열 텍스트 상자에 넣기
		EditText result = (EditText)findViewById(R.id.received_param);
		result.setText("native_param1["+ receivedParams.getParam("native_param1") + "], native_param2["+receivedParams.getParam("native_param2", "UTF-8")+"]");
		
		
        // 이전 버튼
        findViewById(R.id.back_button).setOnClickListener(new OnClickListener() {
        	
        	@Override
    		public void onClick(View arg0) {
        		onBackPressed();
        	}
        });
        
	}
	
	@Override
	protected void onStop(){ 
		super.onStop(); 
	
//		PLog.i(CLASS_TAG, "Abstract onStop()"); 
	} 
	 
	@Override
	protected void onResume(){ 
		super.onResume(); 
//		PLog.i(CLASS_TAG, "Abstract onResume()"); 
	} 
	 
	@Override
	protected void onStart(){ 
		super.onStart(); 
//		PLog.i(CLASS_TAG, "Abstract onStart()"); 
	} 
	 
	@Override
	protected void onRestart(){ 
		super.onRestart(); 
//		PLog.i(CLASS_TAG, "Abstract onRestart()"); 
	} 
	
	@Override
	protected void onNewIntent(Intent intent)
	{
		super.onNewIntent(intent);
//		PLog.i(CLASS_TAG, "Abstract onNewIntent()"); 
	}
	 
	@Override
	protected void onDestroy(){ 
		super.onDestroy(); 
	} 
	
	@Override
    public void onConfigurationChanged(Configuration _newConfig) {
     super.onConfigurationChanged(_newConfig);
     
	}
	
	/**
	 * 네트워크 에러나 기타 에러 발생히 호출된다. 
	 * @param callerServerName 타켓서버이름
	 * @param trCode : 전문 번호 
	 * @param errCode : 에러 코드 
	 * @param errMessage : 에러 메시지
	 */
	@Override
	public void handlingError(String callerServerName, String trCode, String errCode, String errMessage, NetReqOptions netReqOpt) {
		
	}

	/**
	 * 데이터 송신 처리
	 * DataHandle 형식의 데이터를 요청한다.
	 * @param stTrCode : 전문 식별 문자열
	 * @param otherInfos : 기타 정보 
	 * @param dhSendData : 송신 데이터(DataHandle 타입)
	 * @param netReqOptions : 전문 옵션
	 */
	@Override
	public void requestData(String stTrCode, String otherInfos, DataHandler dhSendData, NetReqOptions netReqOptions) {

	}

	/**
	 * 데이터 수신
	 * 데이터를 받은 후 처리하는 부분을 구현해야한다.
	 * 
	 * @param stTrCode : 전문 식별 문자열
	 * @param otherInfos : 기타 정보 
	 * @param dhRecvData : 수신 데이터
	 * @param tagId : 화면 태그 객체 구분
	 */
	@Override
	public void responseData(int nDataType, String stTrCode, String otherInfos, String dhRecvData, NetReqOptions netReqOpt) {
	}
	
	/**
	 * 이전 키를 눌렀을때 처리 
	 */
	@Override
	public void onBackPressed() {
		
		// 이전 화면으로 이동
		
		// 파라메터 설정
		Parameters backParam = new Parameters();
		backParam.putParam("backParam1", "native 화면 2");
		backParam.putParam("backParam2", "하&하하2", "UTF-8");
		backParam.putParam("backParam3", "한글을 보낸다.2");
		
    	// Animation Type
		// DEFALUT : 왼쪽으로 이동되는 슬라이드 효과(SLIDE_LEFT)
        // NONE : 애니메이션 효과 없음
        // SLIDE_LEFT : 왼쪽으로 이동되는 슬라이드 효과
        // SLIDE_RIGHT : 오른쪽으로 이동되는 슬라이드 효과
        // SLIDE_TOP : 위쪽으로 이동되는 슬라이드 효과
        // SLIDE_BOTTOM : 아래쪽으로 이동되는 슬라이드 효과
        // ZOOM_IN : 줌인 효과
        // ZOOM_OUT : 줌아웃 효과
        // FADE : 페이드 효과
        // MODAL_UP : 원본 화면은 고정되어 있고 대상 화면만 위쪽으로 이동되는 슬라이드 효과
        // MODAL_DOWN : 원본 화면은 고정되어 있고 대상 화면만 아래쪽으로 이동되는 슬라이드 효과
		Controller.getInstance().actionHistoryBack(backParam, "ZOOM_OUT");
		
	}

	@Override
	public void onRestoreActivity(Parameters params) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onFinishedCaptureView() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onApplicationWillTerminate() {
		// TODO Auto-generated method stub
		
	}

}
