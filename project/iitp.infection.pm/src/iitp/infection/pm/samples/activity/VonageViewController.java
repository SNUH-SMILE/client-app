package iitp.infection.pm.samples.activity;

import m.client.android.library.core.control.Controller;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.model.NetReqOptions;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.DataHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.common.Parameters;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.PLog;
import iitp.infection.pm.R;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.EditText;

import pub.devrel.easypermissions.AfterPermissionGranted;
import pub.devrel.easypermissions.EasyPermissions;
import java.util.List;
import android.Manifest;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Connection;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import android.opengl.GLSurfaceView;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.Toast;

/**
 * VonageViewController Class
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
public class VonageViewController extends AbstractActivity implements EasyPermissions.PermissionCallbacks {
	
	private final Activity thisObj;
	private static final int PERMISSIONS_REQUEST_CODE = 124;

	private Session session;
	private Publisher publisher;
	private Subscriber subscriber;

	private FrameLayout largeContainer;
	private FrameLayout smallContainer;
	private FrameLayout topContainer;
	private FrameLayout bottomContainer;
	private LinearLayout halfContainer;
	private LinearLayout roundContainer;

	private String apikey;
	private String sessionid;
	private String token;

	private int btnStatus;

	public VonageViewController() {
		super();
		thisObj = this;
	}

	@Override
	public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
		EasyPermissions.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
	}

	@Override
	public void onPermissionsGranted(int requestCode, List<String> perms) {
	}

	@Override
	public void onPermissionsDenied(int requestCode, List<String> perms) {
	}

	@AfterPermissionGranted(PERMISSIONS_REQUEST_CODE)
	private void requestPermissions() {
		String[] perms = {Manifest.permission.INTERNET, Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO};

		if (EasyPermissions.hasPermissions(this, perms)) {
			initializeSession(apikey, sessionid, token);
		} else {
			EasyPermissions.requestPermissions(this, "", PERMISSIONS_REQUEST_CODE, perms);
		}
	}

	private void initializeSession(String apiKey, String sessionId, String token) {
        /*
        The context used depends on the specific use case, but usually, it is desired for the session to
        live outside of the Activity e.g: live between activities. For a production applications,
        it's convenient to use Application context instead of Activity context.
         */
		session = new Session.Builder(this, apiKey, sessionId).build();
		session.setSessionListener(sessionListener);
		session.setConnectionListener(connectionListener);
		session.connect(token);
	}

	private final PublisherKit.PublisherListener publisherListener = new PublisherKit.PublisherListener() {
		@Override
		public void onStreamCreated(PublisherKit publisherKit, Stream stream) {
		}

		@Override
		public void onStreamDestroyed(PublisherKit publisherKit, Stream stream) {
		}

		@Override
		public void onError(PublisherKit publisherKit, OpentokError opentokError) {
		}
	};

	SubscriberKit.SubscriberListener subscriberListener = new SubscriberKit.SubscriberListener() {
		@Override
		public void onConnected(SubscriberKit subscriberKit) {
		}

		@Override
		public void onDisconnected(SubscriberKit subscriberKit) {
		}

		@Override
		public void onError(SubscriberKit subscriberKit, OpentokError opentokError) {
		}
	};


	private final Session.SessionListener sessionListener = new Session.SessionListener() {
		@Override
		public void onConnected(Session session) {
			publisher = new Publisher.Builder(VonageViewController.this).build();
			publisher.setPublisherListener(publisherListener);
			publisher.getRenderer().setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
			largeContainer.addView(publisher.getView(),0);
			session.publish(publisher);
		}

		@Override
		public void onDisconnected(Session session) {
		}

		@Override
		public void onStreamReceived(Session session, Stream stream) {
			if (subscriber == null) {
				subscriber = new Subscriber.Builder(VonageViewController.this, stream).build();
				subscriber.getRenderer().setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FIT);
				subscriber.setSubscriberListener(subscriberListener);
				session.subscribe(subscriber);
				switch (btnStatus)
				{
					case 1:
						smallContainer.addView(subscriber.getView());
						break;
					case 2:
						largeContainer.addView(subscriber.getView());
						break;
					case 3:
						topContainer.addView(subscriber.getView());
						break;
				}
			}
		}

		@Override
		public void onStreamDropped(Session session, Stream stream) {
			if (subscriber != null) {
				subscriber = null;
				switch (btnStatus)
				{
					case 1:
						smallContainer.removeAllViews();
						break;
					case 2:
						largeContainer.removeAllViews();
						break;
					case 3:
						topContainer.removeAllViews();
						break;
				}
			}
		}

		@Override
		public void onError(Session session, OpentokError opentokError) {
		}
	};

	private final Session.ConnectionListener connectionListener = new Session.ConnectionListener()
	{
		public void onConnectionCreated(Session ses, Connection con)
		{
		}
		public void onConnectionDestroyed(Session ses, Connection con)
		{
			Toast.makeText(getApplicationContext(),"통화가 종료되었습니다",Toast.LENGTH_LONG).show();
			session.disconnect();
			removeContainer();
			onBackPressed();
		}
	};


	public void removeContainer()
	{
		largeContainer.removeAllViews();
		smallContainer.removeAllViews();
		topContainer.removeAllViews();
		bottomContainer.removeAllViews();
	}



	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		btnStatus = 1;

		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.vonage);
		
		//Orientation Setting 부분 반듯이 호출해야함.(호출하지 않으면 Orientation 관련 Error 발생 )
		setActivityOrientation();
		
		//NANIVE_ANIM - 애니메이션 적용을 위해 필수 코드
		String anim = LibDefinitions.string_ani.ANI_DEFAULT;
		if (mParams.getParam("ANI_TYPE") != null) {
			anim = (String) mParams.getParam("ANI_TYPE");
		}
		
		CommonLibUtil.activityAnimation(anim, this);

		largeContainer = findViewById(R.id.large_container);
		smallContainer = findViewById(R.id.small_container);
		topContainer = findViewById(R.id.top_container);
		bottomContainer = findViewById(R.id.bottom_container);
		halfContainer = findViewById(R.id.half_container);
		roundContainer = findViewById(R.id.round_container);

		Parameters receivedParams = new Parameters(getParamsString());
		apikey = ""+receivedParams.getParam("apikey", "UTF-8");
		sessionid = ""+receivedParams.getParam("sessionid", "UTF-8");
		token = ""+receivedParams.getParam("token", "UTF-8");

		requestPermissions();

        // 이전 버튼
        findViewById(R.id.back_button).setOnClickListener(new OnClickListener() {
        	
        	@Override
    		public void onClick(View arg0) {
				session.disconnect();
				removeContainer();
        		onBackPressed();
        	}
        });

		// 1버튼
		findViewById(R.id.button1).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				btnStatus = 1;
				removeContainer();
				if(publisher != null) {
					largeContainer.addView(publisher.getView());
					largeContainer.addView(roundContainer);
				}
				if (subscriber != null) {
					smallContainer.addView(subscriber.getView());
				}
			}
		});

		// 2버튼
		findViewById(R.id.button2).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				btnStatus = 2;
				removeContainer();
				if (subscriber != null) {
					largeContainer.addView(subscriber.getView());
				}
				if(publisher != null) {
					smallContainer.addView(publisher.getView());
					smallContainer.addView(roundContainer);
				}
			}
		});

		// 3버튼
		findViewById(R.id.button3).setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View arg0) {
				btnStatus = 3;
				removeContainer();
				if(publisher != null) {
					bottomContainer.addView(publisher.getView());
					bottomContainer.addView(roundContainer);
				}
				if (subscriber != null) {
					topContainer.addView(subscriber.getView());
				}
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
		/*
		 * AppManifest.xml에 정의된 네트워크 정보를 타켓 서버 이름으로 네트워크 정보를 읽어와서 요청한다.
		 */
		CommonLibHandler.getInstance().requestDataUsingNetworkInfo(stTrCode, otherInfos, dhSendData, this, netReqOptions);		

	}

	/**
	 * 데이터 수신
	 * 데이터를 받은 후 처리하는 부분을 구현해야한다.
	 * 
	 * @param stTrCode : 전문 식별 문자열
	 * @param otherInfos : 기타 정보 
	 * @param dhRecvData : 수신 데이터
	 * @param tagId : 화면 객체 구분 태그
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
		//Parameters backParam = new Parameters();
		//Controller.getInstance().actionHistoryBack(backParam, "DEFAULT");
		finish();
	}

	/**
	 * 화면이 복원될때 호출된다.
	 */
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
