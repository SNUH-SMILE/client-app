package iitp.infection.pm.samples.activity;

import java.util.Timer;
import java.util.TimerTask;
import java.io.IOException;
import m.client.android.library.core.control.Controller;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.common.Parameters;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.utils.PushWakeLock;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.media.SoundPool;
import android.net.Uri;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.Settings;
import android.view.LayoutInflater;
import android.view.Window;
import android.view.WindowManager;


public class ShowPushPopup extends Activity {
	Context context;
	//String[] data;
	Window window;
	
	MediaPlayer mAudia = null;
	boolean isPlay = false;
	
	private SoundPool sound_pool;
	private int sound_correct;
	private Activity thisObj;
	
	public ShowPushPopup()
	{
		super();
		thisObj = this;
	}
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		PushWakeLock.acquireCpuWakeLock(this);
		
		window = getWindow();
		window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
							| WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
							| WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
							//| WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
							//| WindowManager.LayoutParams.FLAG_BLUR_BEHIND //?룸같寃?諛섑닾紐??④낵
							);

		final String title;
		final String message;
		
		Bundle bun 	= getIntent().getExtras();
		title 		= bun.getString("KEY_TITLE");
		message 	= bun.getString("MESSAGE");
		
		AlertDialog.Builder alertDialog = new AlertDialog.Builder(ShowPushPopup.this);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		alertDialog.setPositiveButton("보기", new DialogInterface.OnClickListener() {
			@Override            
			public void onClick(DialogInterface dialog, int which) {

				// 웹 화면을 호출한다.
	        	// 파라메터 설정
				Parameters param = new Parameters();
				param.putParam("message", message);
				param.putParam("act_push", "push");	// 인트로 화면 이동시 현재 PUSH 메시지를 수신하여 이동한다는것을 알리기 위해 
				
				// 프로그램 초기화 처리
				// 프로그램이 정상적으로 구동되지 않고 바로 실행되는 경우에는 프로그램 초기화 처리를 거쳐야 한다. 
				if (CommonLibHandler.getInstance().g_strExtWNIClassPackageName == null) {
					CommonLibHandler.getInstance().processAppInit(thisObj, false);
				}
				
				// 화면에서 사용할 전역 변수 설정(WNSetVariable, WNGetVariable) 
				CommonLibUtil.setVariable("user_id", "reborn");	//WNGetvarible();

				// 프로그램이 설치되어 있는 동안 영구적으로 사용할 수 있는 영역(파일)에 정보 저장(WNSetVariableToStorage, WNGetVariableFromStorage)
				//CommonLibUtil.setConfigInfomation("save-info-to-file", "information", this);
				
				// 파라메터 정보를 보내는 경우 
				param.putParam("PARAMETERS", param.toString());
				param.putParam("ORIENT_TYPE", "PORT");
				param.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + "intro.html" );
				int actionType = CommonLibUtil.getActionType("NO_HISTORY");
			    Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN, 
			    actionType, 
			    thisObj, 
			    "SLIDE_RIGHT",
			    param);
			}
		});
		
		alertDialog.setNegativeButton("닫기", new DialogInterface.OnClickListener() {
			@Override            
			public void onClick(DialogInterface dialog, int which) {
				//PushWakeLock.releaseCpuLock();                
				ShowPushPopup.this.finish();     
				}         
			}); 
		
	
		LayoutInflater factory = LayoutInflater.from(ShowPushPopup.this);
	
		alertDialog.setTitle("PUSH 알림");
		alertDialog.setMessage(message);
//		final View textEntryView = factory.inflate(R.layout., null);
//		((TextView)textEntryView.findViewById(R.id.first_string)).setText(msg);
//		alertDialog.setView(this.findViewById(R.id.first_string));      
		alertDialog.show(); 
		
		Vibrator vibe = (Vibrator)getSystemService(Context.VIBRATOR_SERVICE);
		vibe.vibrate(1000);
		
/*		int maner = Settings.System.getInt(getContentResolver(), Settings.System.VOLUME_ALARM, 15000);
		if(maner != 0){
			play();
		}
*/
		TimerTask task = new TimerTask() {                 
			@Override                
			public void run() {
				PushWakeLock.releaseCpuLock();
			}        
		};
		Timer timer = new Timer();
		timer.schedule(task, 500);
	}
	
	public void play(){
		try{
			mAudia = new MediaPlayer();

			Uri alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
			mAudia.setDataSource(alert.toString());

			mAudia.prepare();
			mAudia.setLooping(false);
		}catch(IOException e){
			Logger.e("media play error");
		}
		mAudia.start();
	}

	@Override
	protected void onDestroy() {
		// TODO Auto-generated method stub
		super.onDestroy();
/*		int maner = Settings.System.getInt(getContentResolver(), Settings.System.VOLUME_SYSTEM, 1);
		if(maner != 0){
			mAudia.release();
		}
		*/

	}
	
	
}
