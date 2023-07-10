package iitp.infection.pmtablet.samples.activity;

import java.util.ArrayList;

import m.client.android.library.core.control.Controller;
import m.client.android.library.core.model.NetReqOptions;
import m.client.android.library.core.utils.Logger;
import m.client.android.library.core.view.AbstractActivity;
import m.client.android.library.core.common.CommonLibHandler;
import m.client.android.library.core.common.DataHandler;
import m.client.android.library.core.common.LibDefinitions;
import m.client.android.library.core.common.Parameters;
import m.client.android.library.core.utils.CommonLibUtil;
import m.client.android.library.core.utils.PLog;
import iitp.infection.pmtablet.samples.utils.ListAdapter;
import iitp.infection.pmtablet.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;

public class SampleNativeListActivity extends AbstractActivity {
	private ArrayList<String[]> mArray;
	private ListAdapter<String[]> mAdapter;
	private int mItemResourceId;
	
	private Activity thisObj;
	
	public SampleNativeListActivity() {
		super();
		thisObj = this;
	}
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.nativelist);
		
		Button btn = (Button)findViewById(R.id.title_before);
		btn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
				finish();
			}
		});
		
		Button btnWeblist = (Button)findViewById(R.id.weblist);
		btnWeblist.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
				finish();
			}
		});
		
		Button btnView = (Button)findViewById(R.id.register);
		btnView.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View arg0) {
				// TODO Auto-generated method stub
				//등록 화면 이동
				
				// 화면에서 사용할 전역 변수 설정(웹화면에서의 사용:WNSetVariable, WNGetVariable) 
				//CommonLibUtil.setVariable("web_global1", "네이티브 화면에서 저장되는 전역변수 값1");	//WNGetvarible();

				// 프로그램이 설치되어 있는 동안 영구적으로 사용할 수 있는 영역(파일)에 정보 저장(웹화면에서의 사용:WNSetVariableToStorage, WNGetVariableFromStorage)
				//CommonLibUtil.setVariableToStorage("web_storage1", "네이티브 화면에서 저장되는 영속변수 값1", thisObj.getApplicationContext());
				
				// 파라메터 설정
				Parameters pubParams = new Parameters();
				
				// 파라메터 정보를 보내는 경우 
				Parameters inParam = new Parameters();
				inParam.putParam("REQUEST_PARAM", "이 메시지는 네이티브 화면에서 보냅니다.");
				inParam.putParam("param1", "paramValue1");
				inParam.putParam("param2", "테&스트", "UTF-8"); 
				pubParams.putParam("PARAMETERS", inParam.getParamString());
				
				// 웹 컨테이너에서 보여질 html 페이지
				pubParams.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + "mp_register.html");	

				// 화면 방향 설정 
				// DEFAULT : 단말기에서 기본적으로 제공되는 방향 설정 적용
			    // PORT : 세로 고정
			    // LAND : 가로 고정
			    // ALL : 가로, 세로 방향 변경 가능
				pubParams.putParam("ORIENT_TYPE", "DEFAULT");
				
				// Action type
				// NEW_SCR : 대상이 되는 화면을 화면 관리 스택에 새롭게 추가한다.
		        // NO_HISTORY : 대상이 되는 화면을 화면 관리 스택에 추가하지 않는다.
		        // CLEAR_TOP : 대상이 되는 이전 화면으로 이동한다. 이동시 현재 화면에서 대상 화면 사이의 모든 화면들은 제거된다.
		    	int actionType = CommonLibUtil.getActionType("NEW_SCR");
		    	
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
		    	
		    	// 하이브리드 웹화면으로 이동시에는 타겟 클래스 인텍스가 반드시 LibDefinitions.libactivities.ACTY_MAIN 이어야 한다.
		    	
		    	//NANIVE_ANIM
		    	setViewForMovingScreen(getRootView(thisObj));
		    	
		    	Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN, 
		    												actionType, 
		    												thisObj, 
		    												"SLIDE_LEFT",
		    												pubParams);
			}
		});
		
		
		Handler handler = new Handler();
		handler.postDelayed(new Runnable() {
			public void run() {
				Parameters receivedParams = new Parameters(getParamsHashMap());
				String action = (String)receivedParams.getParam("action");
				if(action.equals("MAKENEW")){
					String nextpage = (String)receivedParams.getParam("nextpage");
					// 파라메터 설정
					//Parameters pubParams = new Parameters();
					Parameters pubParams = new Parameters(getParamsHashMap());
					
					// 파라메터 정보를 보내는 경우 
					Parameters inParam = new Parameters();
					
					pubParams.putParam("PARAMETERS", inParam.getParamString());
					pubParams.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + nextpage);
					// 화면 방향 설정 
					// DEFAULT : 단말기에서 기본적으로 제공되는 방향 설정 적용
				    // PORT : 세로 고정
				    // LAND : 가로 고정
				    // ALL : 가로, 세로 방향 변경 가능
					pubParams.putParam("ORIENT_TYPE", "PORT");
					
					// Action type
					// NEW_SCR : 대상이 되는 화면을 화면 관리 스택에 새롭게 추가한다.
			        // NO_HISTORY : 대상이 되는 화면을 화면 관리 스택에 추가하지 않는다.
			        // CLEAR_TOP : 대상이 되는 이전 화면으로 이동한다. 이동시 현재 화면에서 대상 화면 사이의 모든 화면들은 제거된다.
			    	int actionType = CommonLibUtil.getActionType("NEW_SCR");
			    	
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
			    	
			    	// 하이브리드 웹화면으로 이동시에는 타겟 클래스 인텍스가 반드시 LibDefinitions.libactivities.ACTY_MAIN 이어야 한다.
			    	
			    	setViewForMovingScreen(getRootView(thisObj));
			    	
			    	Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN, 
			    												actionType, 
			    												thisObj, 
			    												"SLIDE_LEFT",
			    												pubParams);
				}else if(action.equals("GOBACK")){
					onBackPressed();
				}else{
					requestListData();
				}
			}
		}, 500);

		
		
		
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
	
	@Override
	public void handlingError(String callerServerName, String trCode, String errCode, String errMessage, NetReqOptions netReqOpt) {
		
		EditText handlingError = (EditText)findViewById(R.id.handling_error);
		handlingError.setText(errMessage);

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
		
		if(dhRecvData != null && dhRecvData.length() > 0){
			JSONObject jsonData = null;
			try {
				jsonData = new JSONObject(dhRecvData);
				
				JSONArray jsonArray = jsonData.getJSONArray("registers");

				mArray = new ArrayList<String[]>();
				
				int count = jsonArray.length();
				for(int i=0; i < count; i++){
					JSONObject arrayData =  (JSONObject)jsonArray.get(i);
					String[] data = new String[5];
					data[0] = arrayData.getString("name");
					data[1] = arrayData.getString("date");
					data[2] = arrayData.getString("latitude");
					data[3] = arrayData.getString("longitude");
					data[4] = arrayData.getString("id");
					mArray.add(data);
				}
				
				mItemResourceId = R.layout.listitem;
				mAdapter = new ListAdapter<String[]>(this, mItemResourceId, mArray) {
					
					@Override
					public View getView(final int position, View convertView, ViewGroup parent) {
						// TODO Auto-generated method stub
						LayoutInflater intInflater = (LayoutInflater) SampleNativeListActivity.this.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
						convertView =  intInflater.inflate(mItemResourceId, null);
						
						((LinearLayout)convertView.findViewById(R.id.list_item)).setOnClickListener(new View.OnClickListener() {
							@Override
							public void onClick(View v) {
								// TODO Auto-generated method stub
								//Detail View 화면 이동

								// 화면에서 사용할 전역 변수 설정(웹화면에서의 사용:WNSetVariable, WNGetVariable) 
								//CommonLibUtil.setVariable("web_global1", "네이티브 화면에서 저장되는 전역변수 값1");	//WNGetvarible();

								// 프로그램이 설치되어 있는 동안 영구적으로 사용할 수 있는 영역(파일)에 정보 저장(웹화면에서의 사용:WNSetVariableToStorage, WNGetVariableFromStorage)
								//CommonLibUtil.setVariableToStorage("web_storage1", "네이티브 화면에서 저장되는 영속변수 값1", thisObj.getApplicationContext());
								
								// 파라메터 설정
								Parameters pubParams = new Parameters();
								
								// 파라메터 정보를 보내는 경우 
								Parameters inParam = new Parameters();
								inParam.putParam("REQUEST_PARAM", "이 메시지는 네이티브 화면에서 보냅니다.");
								inParam.putParam("idx", mArray.get(position)[4]);
								pubParams.putParam("PARAMETERS", inParam.getParamString());
								
								// 웹 컨테이너에서 보여질 html 페이지
								pubParams.putParam("TARGET_URL", CommonLibHandler.getInstance().g_strHTMLDirForWeb + "mp_detailView.html");	

								// 화면 방향 설정 
								// DEFAULT : 단말기에서 기본적으로 제공되는 방향 설정 적용
							    // PORT : 세로 고정
							    // LAND : 가로 고정
							    // ALL : 가로, 세로 방향 변경 가능
								pubParams.putParam("ORIENT_TYPE", "DEFAULT");
								
								// Action type
								// NEW_SCR : 대상이 되는 화면을 화면 관리 스택에 새롭게 추가한다.
						        // NO_HISTORY : 대상이 되는 화면을 화면 관리 스택에 추가하지 않는다.
						        // CLEAR_TOP : 대상이 되는 이전 화면으로 이동한다. 이동시 현재 화면에서 대상 화면 사이의 모든 화면들은 제거된다.
						    	int actionType = CommonLibUtil.getActionType("NEW_SCR");
						    	
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
						    	
						    	// 하이브리드 웹화면으로 이동시에는 타겟 클래스 인텍스가 반드시 LibDefinitions.libactivities.ACTY_MAIN 이어야 한다.
						    	
						    	//NANIVE_ANIM
						    	setViewForMovingScreen(getRootView(thisObj));
						    	
						    	Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_MAIN, 
						    												actionType, 
						    												thisObj, 
						    												"SLIDE_LEFT",
						    												pubParams);
							}
						});
						
						((TextView)convertView.findViewById(R.id.list_name)).setText(mArray.get(position)[0]);
						((TextView)convertView.findViewById(R.id.list_date)).setText(mArray.get(position)[1]);
						((TextView)convertView.findViewById(R.id.list_location)).setText(mArray.get(position)[2]+ "\n" + mArray.get(position)[3]);
						((TextView)convertView.findViewById(R.id.list_location)).setOnClickListener(new View.OnClickListener() {
							@Override
							public void onClick(View v) {
								// TODO Auto-generated method stub
								//Map 이동
								// 화면에서 사용할 전역 변수 설정(웹화면에서의 사용:WNSetVariable, WNGetVariable) 
								CommonLibUtil.setVariable("native_global1", "네이티브 글로별 변수값1");	//WNGetvarible();
		
								// 프로그램이 설치되어 있는 동안 영구적으로 사용할 수 있는 영역(파일)에 정보 저장(웹화면에서의 사용:WNSetVariableToStorage, WNGetVariableFromStorage)
								CommonLibUtil.setVariableToStorage("natvie_storage1", "네이티브 저장 변수값1", thisObj.getApplicationContext());
								
								// 파라메터 설정
								Parameters pubParams = new Parameters();
								
								// 파라메터 정보를 보내는 경우 
								Parameters inParam = new Parameters();
								inParam.putParam("latitude", mArray.get(position)[2]);
								inParam.putParam("longitude", mArray.get(position)[3]);
								inParam.putParam("name", mArray.get(position)[0]); 
								pubParams.putParam("PARAMETERS", inParam.getParamString());
								
								// 화면 방향 설정 
								// DEFAULT : 단말기에서 기본적으로 제공되는 방향 설정 적용
							    // PORT : 세로 고정
							    // LAND : 가로 고정
							    // ALL : 가로, 세로 방향 변경 가능
								pubParams.putParam("ORIENT_TYPE", "DEFAULT");
								
								// Action type
								// NEW_SCR : 대상이 되는 화면을 화면 관리 스택에 새롭게 추가한다.
						        // NO_HISTORY : 대상이 되는 화면을 화면 관리 스택에 추가하지 않는다.
						        // CLEAR_TOP : 대상이 되는 이전 화면으로 이동한다. 이동시 현재 화면에서 대상 화면 사이의 모든 화면들은 제거된다.
						    	int actionType = CommonLibUtil.getActionType("NEW_SCR");
						    	
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
						    	
						    	// 네이티브 화면으로의 이동
						    	// 타켓 클래스 인덱스는 Definitions.activities 에 정의된 이동할 네이티브 화면의 인덱스 (예 : Definitions.activities.ACTY_SAMPLE2)
						    	
						    	//NANIVE_ANIM
						    	setViewForMovingScreen(getRootView(thisObj));
						    							    	
						    	Controller.getInstance().actionMoveActivity(LibDefinitions.libactivities.ACTY_CUSTOM, 
						    												actionType, 
						    												thisObj, 
						    												"SLIDE_LEFT",
						    												pubParams,
						    												"SampleNativeMapActivity");
							}
						});
						
						return convertView;
					}
				};
				
				
				ListView listview = (ListView) findViewById(R.id.listView);
				
				listview.setAdapter(mAdapter);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				Logger.e("JSON put error");
			}	
			
		}
	}

	@Override
	public void onFinishedCaptureView() {
		// TODO Auto-generated method stub

	}

	@Override
	public void onRestoreActivity(Parameters arg0) {
		// TODO Auto-generated method stub

	}
	
	/**
	 * 이전 키를 눌렀을때 처리 
	 */
	@Override
	public void onBackPressed() {
		
		// 이전 화면으로 이동
		
		// 파라메터 설정
		Parameters receivedParams = new Parameters(getParamsHashMap());
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
		Controller.getInstance().actionHistoryBack(receivedParams, "SLIDE_RIGHT");
		
	}
	
	public void requestListData() {

        /* 
         * 요청 전문 데이터 생성
         */
		JSONObject sendData = new JSONObject();
		
		/*
		 *  전문 송신에 관한 옵션
		 *  
		 *  encrypt 암호화 여부
		 *  indicator 인디케이터 사용여부
		 *  indicatorMsg 인디케이터 메시지
		 *  dummy 가상화 더미 서버사용여부
		 *  targetServerName 타켓 서버 이름 
		 *  retargetUrl 재접속 URL
		 */
		NetReqOptions netReqOptions = new NetReqOptions();
		netReqOptions.dummy = true;
		
		/*
		 * 데이터 송신 처리
		 * DataHandle 형식의 데이터를 요청한다.
		 * @param stTrCode : 전문 식별 문자열
		 * @param otherInfos : 기타 정보 (리턴 받을 자바스크립트 함수 이름)
		 * @param dhSendData : 송신 데이터(DataHandle 타입)
		 * @param netReqOptions : 전문 옵션
		 */
		netReqOptions.targetServerName = "HTTP_HH_MAIN";  // (중요 : 반드시 AppManifext.xml에서 정의한 타켓 서버 이름을 설정해야 한다.)
		netReqOptions.indicatorMsg = "데이터 요청중입니다..";
		requestData("rsc.sample_list", "", new DataHandler(sendData), netReqOptions);
		
		
	}

	@Override
	public void onApplicationWillTerminate() {
		// TODO Auto-generated method stub
		
	}

}




