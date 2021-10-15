package iitp.infection.pm.implementation;

import java.util.Timer;
import java.util.TimerTask;

import m.client.android.library.core.control.Controller;
import m.client.android.library.core.view.MainActivity;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.common.Parameters;
import m.client.android.library.core.managers.ActivityHistoryManager;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.PLog;
import m.client.android.library.core.utils.PushWakeLock;
import iitp.infection.pm.samples.activity.ShowPushPopup;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Vibrator;
import android.widget.Toast;


/**
 * PushServiceManager Class
 * 
 * @author 류경민(<a mailto="kmryu@uracle.co.kr">kmryu@uracle.co.kr</a>)
 * @version v 1.0.0
 * @since Android 2.2 <br>
 *        <DT><B>Date: </B>
 *        <DD>2011.04</DD>
 *        <DT><B>Company: </B>
 *        <DD>Uracle Co., Ltd.</DD>
 *        
 * Push 알림 관리 클래스
 * C2DM에 서비스 등록, 메시지 수신등을 처리한다. 
 * 
 * Copyright (c) 2001-2011 Uracle Co., Ltd. 
 * 166 Samseong-dong, Gangnam-gu, Seoul, 135-090, Korea All Rights Reserved.
 */
public class PushServiceManager extends BroadcastReceiver {
	
	public PushServiceManager()
	{
		
	}

	@Override   
	public void onReceive(Context context, Intent intent)
    {
        PLog.i("C2DM", "onReceive");
 
        //서버에 정상적으로 등록이 완료되었을 때
        if (intent.getAction().equals("com.google.android.c2dm.intent.REGISTRATION"))
        {
            handleRegistration(context, intent);
        }
        //서버에서 메시지가 도착했을 때
        else if (intent.getAction().equals("com.google.android.c2dm.intent.RECEIVE"))
        {
            handleMessage(context, intent);
        }
    }
 
    private void handleRegistration(final Context context, final Intent intent)
    {
		new Thread() {
		    public void run() {
		    	
		        PLog.i("C2DM", "handleRegistration");
		        //서버에서 넘어오는 메시지의 내용에 key이름 "registration_id"에는 이 기기에만 사용하는 인증키값이 담겨서 넘어온다.
		        final String registration = intent.getStringExtra("registration_id");
		        if (intent.getStringExtra("error") != null)
		        {
		            PLog.i("C2DM", "error");
		            
		            // Push 서비스 등록에 실패했을 경우
		            CommonLibHandler.getInstance().pushCallBack.onFail("FAIL");
		            
		            // Retry to set push service
		            //CommonLibUtil.procRegistPushInfo(registration);
		        }
		        else if (intent.getStringExtra("unregistered") != null)
		        {
		            PLog.i("C2DM", "unregistered");
		            
		            // Push 서비스 해제에 실패했을 경우
		            CommonLibHandler.getInstance().pushCallBack.onSuccess("SUCCESS");
		        }
		        else if (registration != null)
		        {
		            PLog.i("C2DM", "Registration ID : " + registration);
		            
		            // Push 서비스 등록에 성공했을 경우
		            CommonLibHandler.getInstance().pushCallBack.onSuccess(registration);
		            
		            // Push start page
		//            CommonLibUtil.setConfigInfomation("STARTPAGE_BY_NOTI_OF_PUSH", "15_current.total.html", context);
		//            
		//            Intent startIntent = new Intent(); 
		//            startIntent.setClass(context.getApplicationContext(), MorpheusMobile.class);
		//            startIntent.setAction(MorpheusMobile.class.getName());
		//            startIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		            
		            // 프로그램 초기화 처리
					// 프로그램이 정상적으로 구동되지 않고 바로 실행되는 경우에는 프로그램 초기화 처리를 거쳐야 한다. 
		//			if (CommonLibHandler.getInstance().g_strExtWNIClassPackageName == null) {
		//				CommonLibHandler.getInstance().processAppInit(context, false);
		//			}
		            
		            // ActivityHistoryManager.getInstance()
		            
		            // Try to set push service
		            //CommonLibUtil.procRegistPushInfo(registration);
		        } else {
		        	
		        	// Push 서비스 등록에 실패했을 경우
		            CommonLibHandler.getInstance().pushCallBack.onFail("FAIL");
		        }
		    }
        }.start();
        
    }
 
    private void handleMessage(Context context, Intent intent)
    {
        PLog.i("C2DM", "handleMessage");
        final String message = intent.getStringExtra("msg");
        
        Toast.makeText(context, message, 1000).show();
        
        PushWakeLock.acquireCpuWakeLock(context);
        
        final MainActivity topAct = (MainActivity)ActivityHistoryManager.getInstance().getTopActivity();
        
        // 프로그램이 이미 실행되고 있는 경우 처리 
        if (topAct != null) {
        	
	        if(topAct.getActivityType() != ActivityHistoryManager.ACTIVITY_TYPE_WEB) {

	        	// 현재 최상위 화면(액티비티)가 웹 화면인 경우에는 
	        	// extendWNInterface.js에 공통 정의 되어 있는 CBCommonPushNotification 함수로 메시지를 전달하여 처리한다.
	        	new Handler().post(new Runnable() {
					public void run() {
						topAct.getWebView().loadUrl("javascript:CBCommonPushNotification('" + message + "')");
						PushWakeLock.releaseCpuLock();
					}
				});	
	        	
	        } else {	
	        	
	        	// 현재 최상위 화면(액티비티)가 네이티브 화면인 경우
	        	// 알림 정보창을 띄워주고 해당하는 화면으로 이동 시킨다. 
	        	// 해당화면 이동시 필요한 정보를 파라메터로 전달한다. 
			    moveToPage(topAct, message);
	        	
	        }
        } else {
        	
        	// 프로그램이 실행되지 않고 있었을 경우 처리
        	// 알림 정보창을 띄워주고 해당하는 화면으로 이동 시킨다. 
        	// intro 화면으로 이동하여 프로그램 업데이트가 자동 진행 될 수 있게 하는것을 권장.
        	// intro 화면으로 이동시 자동 로그인 여부와 자동 로그인 후 이동할 페이지 정보를 넘겨준다.
        	Intent myIntent = new Intent(); // replace myIntent.class with your intent to launch
   			myIntent.setClass(context.getApplicationContext(), ShowPushPopup.class);
   			myIntent.setAction(ShowPushPopup.class.getName());
   			myIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			    Bundle b = new Bundle();
			    myIntent.putExtra("KEY_TITLE", "알림");
			    myIntent.putExtra("MESSAGE", message);
			    myIntent.putExtra("bundle",b);
		    context.startActivity(myIntent);
	         
/*
	// 웹 화면을 호출한다.

        	// 파라메터 설정
			Parameters param = new Parameters();
			param.putParam("message", message);
			param.putParam("test", "test-value");
			
			// 프로그램 초기화 처리
			// 프로그램이 정상적으로 구동되지 않고 바로 실행되는 경우에는 프로그램 초기화 처리를 거쳐야 한다. 
			if (CommonLibHandler.getInstance().g_strExtWNIClassPackageName == null) {
				CommonLibHandler.getInstance().processAppInit(this, false);
			}
			
			// 화면에서 사용할 전역 변수 설정(WNSetVariable, WNGetVariable) 
			CommonLibHandler.getInstance().setVariable("user_id", "reborn");	//WNGetvarible();

			// 프로그램이 설치되어 있는 동안 영구적으로 사용할 수 있는 영역(파일)에 정보 저장(WNSetVariableToStorage, WNGetVariableFromStorage)
			CommonLibUtil.setConfigInfomation("save-info-to-file", "information", this)
			
			// 파라메터 정보를 보내는 경우 
			param.putParam("PARAMETERS", param.toString());
			param.putParam("ORIENT_TYPE", "PORT");
			param.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + "intro.html" );
			int actionType = CommonLibUtil.getActionType("NEW_SCR");
		    Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN, 
		    actionType, 
		    this, 
		    "SLIDE_RIGHT",
		    param);
*/
			    
        }
        
        PushWakeLock.releaseCpuLock();
        
    }
    
    /**
     * 프로그램이 구동되어 있는 경우 특정 페이지로 이동한다.
     * @param topAct
     * @param message
     */
    private void moveToPage(final Activity topAct, final String message) {
    	
    	AlertDialog.Builder alert = new AlertDialog.Builder(topAct);
    	String title = "PUSH 메시지";
    	
    	// 타이틀 
    	if (title != null && title.trim().equals("") == false)
    		alert.setTitle(title);
    	
    	// 메시지
    	if (message != null && message.trim().equals("") == false)
    		alert.setMessage(message);
    	
    	alert.setPositiveButton("보기", new DialogInterface.OnClickListener() {
		    public void onClick(DialogInterface dialog, int which) {
		    	dialog.dismiss();
					
	    		// 웹 화면을 호출한다.
	        	// 파라메터 설정
				Parameters param = new Parameters();
				param.putParam("message", message);
				param.putParam("act_push", "push");	// 인트로 화면 이동시 현재 PUSH 메시지를 수신하여 이동한다는것을 알리기 위해 
				
				// 프로그램 초기화 처리
				// 프로그램이 정상적으로 구동되지 않고 바로 실행되는 경우에는 프로그램 초기화 처리를 거쳐야 한다. 
				if (CommonLibHandler.getInstance().g_strExtWNIClassPackageName == null) {
					CommonLibHandler.getInstance().basicAppInit(topAct);
				}
				
				// 화면에서 사용할 전역 변수 설정(WNSetVariable, WNGetVariable) 
				CommonLibHandler.getInstance().setVariable("user_id", "reborn");	//WNGetvarible();

				// 프로그램이 설치되어 있는 동안 영구적으로 사용할 수 있는 영역(파일)에 정보 저장(WNSetVariableToStorage, WNGetVariableFromStorage)
				//CommonLibUtil.setConfigInfomation("save-info-to-file", "information", this);
				
				// 파라메터 정보를 보내는 경우 
				param.putParam("PARAMETERS", param.getParamString());
				param.putParam("ORIENT_TYPE", "PORT");
				param.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + "15_current_total.html" );
				int actionType = CommonLibUtil.getActionType("NEW_SCR");
			    Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN, 
			    actionType, 
			    topAct, 
			    "SLIDE_RIGHT",
			    param);
		    		
		    }
		});
    	
    	alert.setNegativeButton("닫기", new DialogInterface.OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				dialog.dismiss();
			}
		});
    	alert.show();
    	
		Vibrator vibe = (Vibrator)topAct.getSystemService(Context.VIBRATOR_SERVICE);
		vibe.vibrate(1000);
		
		TimerTask task = new TimerTask() {                 
			@Override                
			public void run() {
				PushWakeLock.releaseCpuLock();
			}        
		};
		Timer timer = new Timer();
		timer.schedule(task, 500);
    }
	
}
