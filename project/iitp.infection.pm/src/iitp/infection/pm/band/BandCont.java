package iitp.infection.pm.band;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.yc.pedometer.info.BreatheInfo;
import com.yc.pedometer.info.HeartRateHeadsetSportModeInfo;
import com.yc.pedometer.info.OxygenInfo;
import com.yc.pedometer.info.SleepTimeInfo;
import com.yc.pedometer.info.SportsModesInfo;
import com.yc.pedometer.info.StepInfo;
import com.yc.pedometer.info.StepOneDayAllInfo;
import com.yc.pedometer.info.StepOneHourInfo;
import com.yc.pedometer.info.TemperatureInfo;
import com.yc.pedometer.listener.BreatheRealListener;
import com.yc.pedometer.listener.OxygenRealListener;
import com.yc.pedometer.listener.RateCalibrationListener;
import com.yc.pedometer.listener.TemperatureListener;
import com.yc.pedometer.listener.TurnWristCalibrationListener;
import com.yc.pedometer.sdk.BLEServiceOperate;
import com.yc.pedometer.sdk.BloodPressureChangeListener;
import com.yc.pedometer.sdk.BluetoothLeService;
import com.yc.pedometer.sdk.DataProcessing;
import com.yc.pedometer.sdk.ICallback;
import com.yc.pedometer.sdk.ICallbackStatus;
import com.yc.pedometer.sdk.OnServerCallbackListener;
import com.yc.pedometer.sdk.RateChangeListener;
import com.yc.pedometer.sdk.RateOf24HourRealTimeListener;
import com.yc.pedometer.sdk.ServiceStatusCallback;
import com.yc.pedometer.sdk.SleepChangeListener;
import com.yc.pedometer.sdk.StepChangeListener;
import com.yc.pedometer.sdk.UTESQLOperate;
import com.yc.pedometer.sdk.WriteCommandToBLE;
import com.yc.pedometer.utils.BandLanguageUtil;
import com.yc.pedometer.utils.BreatheUtil;
import com.yc.pedometer.utils.CalendarUtils;
import com.yc.pedometer.utils.GetFunctionList;
import com.yc.pedometer.utils.GlobalVariable;
import com.yc.pedometer.utils.OxygenUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import iitp.infection.pm.R;
import iitp.infection.pm.database.DBConfig;
import iitp.infection.pm.database.DBHelper;
import iitp.infection.pm.samples.utils.CommUtils;
import m.client.android.library.core.utils.FileLogger;
import m.client.android.library.core.view.MainActivity;

public class BandCont implements ICallback, ServiceStatusCallback, OnServerCallbackListener, RateCalibrationListener,
        TurnWristCalibrationListener, TemperatureListener, OxygenRealListener, BreatheRealListener{
    private String CLASS_TAG = BandCont.class.getSimpleName();
    private static BandCont instance = null;
    private static Context mContext;
    private static MainActivity mActivity;
    private static String mCallback;
    private BLEServiceOperate mBLEServiceOperate;
    private BluetoothLeService mBluetoothLeService;
    private SharedPreferences sp;
    private SharedPreferences.Editor spEditor;
    private DataProcessing mDataProcessing;
    private WriteCommandToBLE mWriteCommand;//밴드 데이터 가져오기 위함
    private UTESQLOperate mySQLOperate;
    public boolean newBandContAble = false;//현재 연결된 밴드가 아닌 새로운 Check fit 밴드가 연결되는지 확인
    public boolean IS_OXYGEN_CHECKING = false;
    public final int BAND_SYNC_STEP = 0;
    public final int BAND_SYNC_SLEEP = 1;
    public final int BAND_SYNC_RATE = 2;
    public final int BAND_SYNC_BLOOD = 3;
    public final int BAND_SYNC_TEMPERATURE = 4;
    public final int BAND_SYNC_OXYGEN = 5;

    private final int UPDATE_STEP_UI_MSG = 0;
    private final int UPDATE_SLEEP_UI_MSG = 1;
    private final int DISCONNECT_MSG = 18;
    private final int CONNECTED_MSG = 19;
    private final int UPDATA_REAL_RATE_MSG = 20;
    private final int OFFLINE_RATE_SYNC_OK_MSG = 21;
    private final int OPEN_CHANNEL_OK_MSG = 22;
    private final int CLOSE_CHANNEL_OK_MSG = 23;
    private final int TEST_CHANNEL_OK_MSG = 24;
    private final int OFFLINE_SWIM_SYNC_OK_MSG = 25;
    private static final int SHOW_SET_PASSWORD_MSG = 26;
    private static final int SHOW_INPUT_PASSWORD_MSG = 27;
    private static final int SHOW_INPUT_PASSWORD_AGAIN_MSG = 28;
    private final int UPDATA_REAL_BLOOD_PRESSURE_MSG = 29;
    private final int OFFLINE_BLOOD_PRESSURE_SYNC_OK_MSG = 30;
    private final int SERVER_CALL_BACK_OK_MSG = 31;
    private final int OFFLINE_SKIP_SYNC_OK_MSG = 32;
    private final int test_mag1 = 35;
    private final int test_mag2 = 36;
    private final int OFFLINE_STEP_SYNC_OK_MSG = 37;
    private final int UPDATE_SPORTS_TIME_DETAILS_MSG = 38;

    private final int UNIVERSAL_INTERFACE_SDK_TO_BLE_SUCCESS_MSG = 39;//sdk发送数据到ble完成，并且校验成功，返回状态
    private final int UNIVERSAL_INTERFACE_SDK_TO_BLE_FAIL_MSG = 40;   //sdk发送数据到ble完成，但是校验失败，返回状态
    private final int UNIVERSAL_INTERFACE_BLE_TO_SDK_SUCCESS_MSG = 41;//ble发送数据到sdk完成，并且校验成功，返回数据
    private final int UNIVERSAL_INTERFACE_BLE_TO_SDK_FAIL_MSG = 42;   //ble发送数据到sdk完成，但是校验失败，返回状态

    private final int OFFLINE_24_HOUR_RATE_SYNC_OK_MSG = 43;
    private final int OFFLINE_SLEEP_SYNC_OK_MSG = 44;
    private final int SYNC_TEMPERATURE_COMMAND_OK_MSG = 45;
    private final int SYNC_TIME_OK_MSG = 46;
    private final int OFFLINE_OXYGEN_SYNC_OK_MSG = 47;
    private final int TEMP_CHECKING = 48;
    private final int TEMP_CHECKING_START = 49;
    private final int OXYGEN_CHECK_START = 0063;
    private final int OXYGEN_CHECK_STOP = 0064;
    private final int OXYGEN_CHECKING = 0065;
    private final int BAND_SYNC_DATA_FAIL = 9990;

    public static BandCont getInstance(MainActivity activity, Context context,String callback) {
        Log.d("BandCont", "BandConnect getInstance instance :"+instance+"/// callback:"+callback);
        if (instance == null) {
            instance = new BandCont(activity, context,callback);
        }else{
            mActivity = activity;
            mContext = context;
            mCallback = callback;
        }
        return instance;

    }
    public BandCont(MainActivity activity, Context applicationContext,String callback){
        mContext = applicationContext;
        mActivity = activity;
        mCallback = callback;
        sp = mContext.getSharedPreferences(GlobalVariable.SettingSP, 0);
        spEditor = sp.edit();
        mySQLOperate = UTESQLOperate.getInstance(mContext);// 2.2.1版本修改
    }
    //밴드 연결
    public void BandConnect(String bandAddr){
        mBLEServiceOperate = BLEServiceOperate.getInstance(mContext);
        mBLEServiceOperate.setServiceStatusCallback(this);
        mBluetoothLeService = mBLEServiceOperate.getBleService();
        Log.d(CLASS_TAG, "BandConnect mBLEServiceOperate:"+mBLEServiceOperate);
        Log.d(CLASS_TAG, "BandConnect mBluetoothLeService:"+mBluetoothLeService);
        if (mBluetoothLeService != null) {
            mBluetoothLeService.setICallback(this);

            mBluetoothLeService.setRateCalibrationListener(this);//设置心率校准监听(심박수 보정 모니터 설정)
            mBluetoothLeService.setTurnWristCalibrationListener(this);//设置翻腕校准监听(손목시계 보정 설정)
            mBluetoothLeService.setTemperatureListener(this);//设置体温测试(체온 테스트 설정)，采样数据回调(샘플 데이터 콜백)
            mBluetoothLeService.setOxygenListener(this);//Oxygen(산소) Listener
            mBluetoothLeService.setBreatheRealListener(this);//Breathe Listener

        }else{
            Log.i(CLASS_TAG, "BandConnect mBluetoothLeService Null return");
            return;
        }
        //mRegisterReceiver();//밴드 버전 및 배터리 체크를 위한 리시버 등록
        dataProcessingListenerInit();//밴드 생체 데이터 sync 리스너 등록
        mWriteCommand = WriteCommandToBLE.getInstance(mContext);
        String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
        Log.i(CLASS_TAG, "BandConnect lastConnectAddr01:["+lastConnectAddr0+"] new addr ["+bandAddr+"]");
        if(!lastConnectAddr0.equals(bandAddr)){
            newBandContAble = true;
        }
        boolean isBandConnect = isBandConnected();//sp.getBoolean(GlobalVariable.BLE_CONNECTED_SP,false);
        Log.d(CLASS_TAG, "BandConnect isBandConnect :"+isBandConnect);
        if (isBandConnect) {
            mBLEServiceOperate.disConnect();
        }else{

        }
        mBLEServiceOperate.connect(bandAddr);
        CommUtils.showLoading(mActivity,"",false);
    }
    //밴드 연결 해제
    public void BandDisConnect(){
        if (mBluetoothLeService != null) {
            mBLEServiceOperate.disConnect();
            spEditor.putString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
            spEditor.commit();
            mBLEServiceOperate=null;
        }
    }
    //밴드 연결 상태 확인
    public boolean isBandConnected(){
        String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
        int connectionState = BluetoothProfile.STATE_DISCONNECTED;
        BluetoothManager bluetoothManager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothDevice device = BluetoothAdapter.getDefaultAdapter().getRemoteDevice(lastConnectAddr0);
        Log.d(CLASS_TAG,"isBandConnected() device : "+device);
        if(device != null && bluetoothManager != null){
            connectionState = bluetoothManager.getConnectionState(device,BluetoothProfile.GATT_SERVER);
        }
        Log.d(CLASS_TAG,"isBandConnected() connectionState : "+connectionState);
        if(connectionState == BluetoothProfile.STATE_CONNECTED){
            return true;
        }else{
            return false;
        }
    }
    //연결되어 있는 밴드 정보
    public BluetoothDevice isBandConnectedInfo(){
        String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
        int connectionState = BluetoothProfile.STATE_DISCONNECTED;
        BluetoothManager bluetoothManager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothDevice device = BluetoothAdapter.getDefaultAdapter().getRemoteDevice(lastConnectAddr0);
        Log.d(CLASS_TAG,"isBandConnected() device : "+device);
        if(device != null && bluetoothManager != null){
            connectionState = bluetoothManager.getConnectionState(device,BluetoothProfile.GATT_SERVER);
        }
        Log.d(CLASS_TAG,"isBandConnected() connectionState : "+connectionState);
        if(connectionState == BluetoothProfile.STATE_CONNECTED){
            return device;
        }else{
            return null;
        }
    }
    //스마트 밴드 언어 셋팅
    public void setBandLanguage(int lang){
        if(!isBandConnected()){
            Toast.makeText(mContext, mContext.getString(R.string.band_not_connect), Toast.LENGTH_SHORT).show();
            return;
        }
        if(GetFunctionList.isSupportFunction_Second(mContext,GlobalVariable.IS_SUPPORT_BAND_LANGUAGE_FUNCTION)){
            //언어 셋팅을 지원하면 BandLanguageUtil.BAND_LANGUAGE_KO
            mWriteCommand.syncBandLanguage(lang);
        }else{
            Toast.makeText(mContext, mContext.getString(R.string.band_lang_not_support), Toast.LENGTH_SHORT).show();
        }
    }
    //현재 밴드에 셋팅되어 있는 언어 정보 확인
    public int getBandLanguage(){
        int bandLang = sp.getInt(GlobalVariable.BAND_LANGUAGE_SP,0);
        return bandLang;
    }
    /**
     * 데이터 초기화
     * state : 0 (밴드 데이터 초기화 & 로컬 공통 DB 데이터초기화)
     * state : 1 (밴드 데이터 초기)화
     * state : 2 무시
    **/
    public void bandDeviceResetAndSync(/*String state*/){
        Log.d(CLASS_TAG,"bandDeviceResetAndSync() resetType : "+ CommConfig.dataResetType);
        if(CommConfig.dataResetType.equals("0")){
            mWriteCommand.deleteDevicesAllData();
            //공통 DB 테이블 초기화
            DBHelper comDB = new DBHelper(mContext, DBConfig.COM_DB_NAME,DBConfig.COM_DB_VER);
            comDB.dataDelect(DBConfig.DB_T_BP);
            comDB.dataDelect(DBConfig.DB_T_STEP);
            comDB.dataDelect(DBConfig.DB_T_SLEEP);
            comDB.dataDelect(DBConfig.DB_T_HRM);
            comDB.dataDelect(DBConfig.DB_T_OXYGEN);
            comDB.dataDelect(DBConfig.DB_T_TEMP);
            //Check Fit 스마트 밴드 SDK에서 생성한 DB 데이터 초기화
            comDB = new DBHelper(mContext, DBConfig.BAND_SDK_DB_NAME,DBConfig.BAND_SDK_DB_VER);
            comDB.dataDelect(DBConfig.SDK_DB_24RATE);
            comDB.dataDelect(DBConfig.SDK_DB_OXYGEN);
            comDB.dataDelect(DBConfig.SDK_DB_SLEEP);
            comDB.dataDelect(DBConfig.SDK_DB_STEP);
            comDB.dataDelect(DBConfig.SDK_DB_TEMP);
            comDB.dataDelect(DBConfig.SDK_DB_BLOOD);
        }else if(CommConfig.dataResetType.equals("1")){
            mWriteCommand.deleteDevicesAllData();
        }
        CommConfig.dataResetType = "2";

    }
    private void dataProcessingListenerInit(){
        mDataProcessing = DataProcessing.getInstance(mContext);
        mDataProcessing.setOnStepChangeListener(mOnStepChangeListener);//걸음수
        mDataProcessing.setOnSleepChangeListener(mOnSleepChangeListener);//수면
        mDataProcessing.setOnRateListener(mOnRateListener);//심박
        mDataProcessing.setOnRateOf24HourListenerRate(mOnRateOf24HourListener);//Max 심박, min심박, 평균치 심박
        mDataProcessing.setOnBloodPressureListener(mOnBloodPressureListener);//혈압
    }
    //밴드 버전 및 배터리 체크를 위한 리시버 등록
    private void mRegisterReceiver() {
        IntentFilter mFilter = new IntentFilter();
        mFilter.addAction(GlobalVariable.READ_BATTERY_ACTION);
        mFilter.addAction(GlobalVariable.READ_BLE_VERSION_ACTION);
        mActivity.registerReceiver(mReceiver, mFilter);
    }
    //밴드 버전 및 배터리 체크 리시버 해제
    public void mUnRegisterReceiver(){
        mActivity.unregisterReceiver(mReceiver);
    }
    private BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals(GlobalVariable.READ_BLE_VERSION_ACTION)) {//밴드 버전 정보
                String version = intent
                        .getStringExtra(GlobalVariable.INTENT_BLE_VERSION_EXTRA);
                if (sp.getBoolean(BluetoothLeService.IS_RK_PLATFORM_SP, false)) {
                    String bandVersion = version;
                    String bandVersionNM = sp.getString(GlobalVariable.PATH_LOCAL_VERSION_NAME_SP,"");
                } else {
                    String bandVersion = version;
                }

            } else if (action.equals(GlobalVariable.READ_BATTERY_ACTION)) {//밴드 잔류 배터리
                int battery = intent.getIntExtra(GlobalVariable.INTENT_BLE_BATTERY_EXTRA, -1);
            }
        }
    };
    private Handler mHandler = new Handler() {
        public void handleMessage(final Message msg) {
            final Bundle bundle = msg.getData();
            DataQuery mDataQuery = new DataQuery(mContext,DBConfig.BAND_SDK_DB_NAME,13);
            String bandLastAddr = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");

            switch (msg.what) {
                case DISCONNECT_MSG:
                    Toast.makeText(mContext, "disconnect", Toast.LENGTH_SHORT).show();
                    Log.i(CLASS_TAG, "disconnect newBandContAble:["+newBandContAble+"]");
                    Log.i(CLASS_TAG, "disconnect lastConnectAddr0:["+bandLastAddr+"]");
                    if(!newBandContAble && !bandLastAddr.equals("00:00:00:00:00:00")){
                        //마지막에 연결되었던 밴드 재 연결
                        //String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
                        //boolean connectResute0 = mBLEServiceOperate.connect(bandLastAddr);
                        mBLEServiceOperate.connect(bandLastAddr);

                    }else{
//                        newBandContAble = false;
                    }
                    CommUtils.hideLoading(mActivity);//로딩 팝업 종료
                    break;
                case CONNECTED_MSG://밴드 연결 성공
                    CommUtils.hideLoading(mActivity);//로딩 팝업 종료
                    mBluetoothLeService.setRssiHandler(mHandler);
                    new Thread(new Runnable() {
                        @Override
                        public void run() {
                            while (!Thread.interrupted()) {
                                try {
                                    Thread.sleep(1000);
                                } catch (InterruptedException e) {
                                    // TODO Auto-generated catch block
                                    e.printStackTrace();
                                }
                                if (mBluetoothLeService != null) {
                                    mBluetoothLeService.readRssi();
                                }
                            }
                        }
                    }).start();
                    Log.d(CLASS_TAG,"handleMessage() activity : "+mActivity);
                    if(mActivity != null) {
                        mActivity.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Log.d(CLASS_TAG, "Band Connect Callback :"+mCallback);
                                JSONObject setJsonDt = new CommUtils().setJSONResutlCode(mContext.getString(R.string.CD_0000), mContext.getString(R.string.MSG_0000));
                                String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP, "00:00:00:00:00:00");
                                try {
                                    setJsonDt.put("deviceId", lastConnectAddr0);
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                Toast.makeText(mContext, mContext.getString(R.string.connect), Toast.LENGTH_SHORT).show();
                                if (mCallback != null) {
                                    mActivity.getWebView().loadUrl("javascript:" + mCallback + "(" + setJsonDt + ")");
                                }
                                newBandContAble = false;

                            }
                        });
                    }
                    //setTempAutoChecking(true,10);
                    break;
                case SYNC_TIME_OK_MSG:
                    //체온 측정 10분 단위로 자동 측정
                    setTempAutoChecking(true,10);

                    if(CommConfig.dataResetType.equals("2")){
                        Log.d(CLASS_TAG,"handle SYNC_TIME_OK_MSG : dataResetType 2");
                        bandDataSync(BAND_SYNC_STEP);//스텝 싱크 시작
                    }else{
                        //밴드 연결이 성공 후 시간 셋팅이 완료되면  밴드 초기화 값에 따라 초기화를 진행을 먼저 시도 한다.
                        Log.d(CLASS_TAG,"handle SYNC_TIME_OK_MSG : dataResetType != 2");
                        bandDeviceResetAndSync();
                    }
                    //bandDataSync(BAND_SYNC_STEP);//스텝 싱크 시작
                    break;
                case UPDATE_STEP_UI_MSG://걸음수가 Change되는 경우
                    final StepOneDayAllInfo stepInfo = (StepOneDayAllInfo) msg.obj;
                    Log.d(CLASS_TAG,"onStepChange() step : "+stepInfo.getStep());
                    Log.d(CLASS_TAG,"onStepChange() distance : "+stepInfo.getDistance());
                    //걸음수가 Change되는 경우 밴드 업체 SDK를 통하여 자동 저장되는 Step 마지막 데이터를 가져와서 공통 DB에도 저장한다.
                    try {
                        BandQueryDataSet.isDetailQuery = true;
                        JSONArray stepQueryArry = mDataQuery.queryStepCustom(CalendarUtils.getCalendar(0)).getJSONArray("stepCountList");
                        JSONObject lastData = stepQueryArry.getJSONObject(stepQueryArry.length()-1);
                        mDataQuery.changeStepInsert(bandLastAddr,lastData);
                        BandQueryDataSet.isDetailQuery = false;
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    if(mActivity != null) {
                        mActivity.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mActivity.getWebView().loadUrl("javascript:onChangeStep(" + stepInfo.getStep() + "," + stepInfo.getDistance() + ")");
                            }
                        });
                    }
                    break;
                case UPDATE_SLEEP_UI_MSG://수면 정보
                    //new DataQuery().querySleepInfo(mySQLOperate,"",false);
                    mDataQuery.queryAllSleepInsert(bandLastAddr,CalendarUtils.getCalendar(0));
                    Log.d(CLASS_TAG, "UPDATE_SLEEP_UI_MSG");
                    break;
                case UPDATA_REAL_RATE_MSG://심박 측정 정보
                    if (bundle.getInt("status") == GlobalVariable.RATE_TEST_FINISH || bundle.getInt("status") == GlobalVariable.RATE_TESTING) {
                        final int rate = bundle.getInt("rate");
                        if(bundle.getInt("status") == GlobalVariable.RATE_TEST_FINISH){
                            //공통 DB에 저장
                        }
                        if(mActivity != null) {
                            mActivity.runOnUiThread(new Runnable() {
                                final TemperatureInfo tempInfo = (TemperatureInfo) msg.obj;

                                @Override
                                public void run() {
                                    mActivity.getWebView().loadUrl("javascript:onChangeRate(" + rate + ")");
                                }
                            });
                        }
                        Log.d(CLASS_TAG, "UPDATA_REAL_RATE_MSG 심박 : " + rate);
                    }
                    break;
                case OFFLINE_STEP_SYNC_OK_MSG://스탭 싱크가 완료된 경우
                    //new DataQuery().queryStepInfo(mySQLOperate,"");
                    //업체 SDK를 이용하여 밴드에서 스마트폰 로컬 DB로 sync된 데이터를 따로 관리하는 공통 DB로 inster 한다.
                    mDataQuery.queryAllStepInsert(bandLastAddr);
                    bandDataSync(BAND_SYNC_SLEEP);//수면 싱크 시작
                    break;
                case OFFLINE_SLEEP_SYNC_OK_MSG://수면 싱크가 완료된 경우
                    mDataQuery.queryAllSleepInsert(bandLastAddr,"");
                    bandDataSync(BAND_SYNC_RATE);//심박 싱크 시작
                    break;
                case OFFLINE_24_HOUR_RATE_SYNC_OK_MSG://심박 싱크가 완료된 경우
                    mDataQuery.queryAllRateInsert(bandLastAddr);
                    bandDataSync(BAND_SYNC_BLOOD);//혈압 싱크 시작
                    break;
                case OFFLINE_BLOOD_PRESSURE_SYNC_OK_MSG://혈압 싱크가 완료된 경우
                    mDataQuery.queryAllBloodInsert(bandLastAddr);
                    bandDataSync(BAND_SYNC_TEMPERATURE);//체온 싱크 시작
                    break;
                case SYNC_TEMPERATURE_COMMAND_OK_MSG://체온 데이터 동기화 완료된 경우
                    //bandDataSync(BAND_SYNC_OXYGEN);//혈중산소포화도 싱크 시작 동기화 진행은 정상적으로 완료되나, 로컬 DB에 정보를 쌓지 않고 있어서 동기화 과정 제외하고 측정할 때마다 강제 DB적제
                    mDataQuery.queryAllTempInsert(bandLastAddr);
                    CommUtils.hideLoading(mActivity);//로딩 팝업 종료
                    Toast.makeText(mContext,R.string.band_sync_ok,Toast.LENGTH_LONG).show();
                    break;
                case OFFLINE_OXYGEN_SYNC_OK_MSG://혈중 산소포화도 동기화 완료된 경우
//                    CommUtils.hideLoading(mActivity);//로딩 팝업 종료
//                    Toast.makeText(mContext,R.string.band_sync_ok,Toast.LENGTH_LONG).show();
                    break;
                case OXYGEN_CHECK_START://산소포화도 체크 시
                case OXYGEN_CHECKING://산소포화도 체크 중
                    IS_OXYGEN_CHECKING = true;
                    break;
                case OXYGEN_CHECK_STOP://산소포화도 체크 종료 작
                    //우선 산소포화도는 강제로 로컬 DB에 적제한다.
                    if(tempOxygenInfo !=null){
                        //DataQuery mDataQuery = new DataQuery(mContext,DBConfig.BAND_SDK_DB_NAME,13);
                        OxygenInfo oxygenInfo = tempOxygenInfo;
                        mDataQuery.insertOxygenCustom(oxygenInfo,bandLastAddr);
                    }

                    IS_OXYGEN_CHECKING = false;
                    break;
                case TEMP_CHECKING_START://최초 체온 측정 시작 시 들어오는 체온 정보를 공통 DB에 적재한다.
                    TemperatureInfo tempInfo = (TemperatureInfo) msg.obj;
                    mDataQuery.changeTempInsert(bandLastAddr,tempInfo);
                    mDataQuery.changeRateInsert(bandLastAddr,tempInfo.getCalendar(),tempInfo.getSecondTime()/60);
                case TEMP_CHECKING://웹 화면에 밴드에서 측정 중인 체온 데이터를 화면 갱신용도록 체온 정보만 전달 한다.
                    if(mActivity != null) {
                        mActivity.runOnUiThread(new Runnable() {
                            final TemperatureInfo tempInfo = (TemperatureInfo) msg.obj;

                            @Override
                            public void run() {
                                mActivity.getWebView().loadUrl("javascript:onChangeTemp(" + tempInfo.getBodyTemperature() + ")");
                            }
                        });
                    }
                    break;
                case BAND_SYNC_DATA_FAIL:
                    Log.d(CLASS_TAG, "mHandler status : "+bundle.getInt("status"));
                    CommUtils.hideLoading(mActivity);
                    Toast.makeText(mContext,R.string.band_sync_fail,Toast.LENGTH_LONG).show();
                    break;
                default:
                    break;
            }
        }
    };


    /**
    * band data Sync
    **/
    public void bandDataSync(final int syncType){
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                boolean isBandConnect = sp.getBoolean(GlobalVariable.BLE_CONNECTED_SP,false);
                Log.d(CLASS_TAG, "bandDataSync isBandConnect :"+isBandConnect);
                if (isBandConnect) {
                    Log.d(CLASS_TAG, "bandDataSync syncType :: "+syncType);
                    switch (syncType){
                        case BAND_SYNC_STEP:
                            Log.d(CLASS_TAG, "step Sync");
                            CommUtils.showLoading(mActivity,"밴드 DATA 동기화",false);
                            mWriteCommand.syncAllStepData();//걸음수 동기화 밴드에 존재하는 데이터 앱 내의 DB로 동기화
                            break;
                        case BAND_SYNC_SLEEP:
                            mWriteCommand.syncAllSleepData();//수면 정보 동기화 밴드에 존재하는 데이터 앱 내의 DB로 동기화
                            break;
                        case BAND_SYNC_RATE:
                            mWriteCommand.sync24HourRate();///심박 동기화 밴드에 존재하는 데이터 앱 내의 DB로 동기화
                            break;
                        case BAND_SYNC_BLOOD:
                            mWriteCommand.syncAllBloodPressureData();//혈압 동기화 밴드에 존재하는 데이터 앱 내의 DB로 동기화
                            break;
                        case BAND_SYNC_TEMPERATURE:
                            mWriteCommand.syncAllTemperatureData();//체온 동기화 밴드에 존재하는 데이터 앱 내의 DB로 동기화
                            break;
                        case BAND_SYNC_OXYGEN:
                            mWriteCommand.syncOxygenData();//OnResult(true, ICallbackStatus.OXYGEN_DATA_SYNCING) and OnResult(true, ICallbackStatus.SYNC_OXYGEN_COMMAND_OK)
                            break;
                        default:
                            break;

                    }
                } else {
                    Toast.makeText(mContext, mContext.getString(R.string.disconnect),
                            Toast.LENGTH_SHORT).show();
                }
            }
        }, 300);

    }

    /**
     * 밴드 관련 걸음수 리스너
     **/
    private StepChangeListener mOnStepChangeListener = new StepChangeListener() {
        @Override
        public void onStepChange(StepOneDayAllInfo info) {
            Message message = mHandler.obtainMessage();
            message.obj = info;
            message.what = UPDATE_STEP_UI_MSG;
            mHandler.sendMessage(message);

        }
    };
    /**
    * 수면
    **/
    private SleepChangeListener mOnSleepChangeListener = new SleepChangeListener() {
        @Override
        public void onSleepChange() {
            mHandler.sendEmptyMessage(UPDATE_SLEEP_UI_MSG);
        }
    };

    /**
     * 현재 심박
     **/
    private RateChangeListener mOnRateListener = new RateChangeListener() {

        @Override
        public void onRateChange(int rate, int status) {
            Log.i(CLASS_TAG, "mOnRateListener rate =" + rate+",status="+status);
            Message message = mHandler.obtainMessage();
            Bundle bundle = new Bundle();
            message.what = UPDATA_REAL_RATE_MSG;
            bundle.putInt("rate",rate);
            bundle.putInt("status",status);
            message.setData(bundle);
            mHandler.sendMessage(message);
        }
    };
    /**
     * 최소, 최대, 평균 심박
     **/
    private RateOf24HourRealTimeListener mOnRateOf24HourListener = new RateOf24HourRealTimeListener() {
        @Override
        public void onRateOf24HourChange(int maxHeartRateValue, int minHeartRateValue, int averageHeartRateValue, boolean isRealTimeValue) {
            Log.i(CLASS_TAG, "mOnRateOf24HourListener maxHeartRateValue =" + maxHeartRateValue+",minHeartRateValue="+minHeartRateValue+",averageHeartRateValue="+averageHeartRateValue);
        }
    };
    /**
     * 심박  측정 시작 & 종료
     **/
    public void RateCheck(String type){
        boolean isBandConnect = sp.getBoolean(GlobalVariable.BLE_CONNECTED_SP,false);
        if (isBandConnect) {
            if(type =="START"){
                mWriteCommand.sendRateTestCommand(GlobalVariable.RATE_TEST_START);
            }else{
                mWriteCommand.sendRateTestCommand(GlobalVariable.RATE_TEST_STOP);
            }
        } else {
            Toast.makeText(mContext, mContext.getString(R.string.disconnect),
                    Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 혈압
     **/
    private BloodPressureChangeListener mOnBloodPressureListener = new BloodPressureChangeListener() {

        @Override
        public void onBloodPressureChange(int hightPressure, int lowPressure,
                                          int status) {
            //tempBloodPressureStatus = status;
            //high_pressure = hightPressure;
            //low_pressure = lowPressure;
            Log.i(CLASS_TAG, "mOnBloodPressureListener status =" + status+",hightPressure="+hightPressure+", lowPressure="+lowPressure);
            mHandler.sendEmptyMessage(UPDATA_REAL_BLOOD_PRESSURE_MSG);
        }
    };

    /**
     * 혈압 측정 시작 & 종료
     **/
    public void BloodPressureCheck(String type){
        boolean isBandConnect = sp.getBoolean(GlobalVariable.BLE_CONNECTED_SP,false);
        if (isBandConnect) {
            if (GetFunctionList.isSupportFunction_Fifth(mContext, GlobalVariable.IS_SUPPORT_BLOOD_PRESSURE_FUNCTION)) {
                if(type =="START"){
                    mWriteCommand.sendBloodPressureTestCommand(GlobalVariable.BLOOD_PRESSURE_TEST_START);
                }else{
                    mWriteCommand.sendBloodPressureTestCommand(GlobalVariable.BLOOD_PRESSURE_TEST_STOP);
                }
            } else {
                Toast.makeText(mContext, "No support",
                        Toast.LENGTH_SHORT).show();
            }

        } else {
            Toast.makeText(mContext, mContext.getString(R.string.disconnect),
                    Toast.LENGTH_SHORT).show();
        }
    }
    /**
     * 산소포화도 측정 시작 & 종료
     **/
    public void OxgenPressureCheck(String type){
        boolean isBandConnect = sp.getBoolean(GlobalVariable.BLE_CONNECTED_SP,false);
        if (isBandConnect) {
            if (GetFunctionList.isSupportFunction_Fifth(mContext, GlobalVariable.IS_SUPPORT_OXYGEN)) {
                if(type =="START"){
                    mWriteCommand.startOxygenTest();//onTestResult
                }else{
                    mWriteCommand.stopOxygenTest();//onTestResult
                }
            } else {
                Toast.makeText(mContext, "No support",
                        Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(mContext, mContext.getString(R.string.disconnect),
                    Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 체온 자동 체킹 시작
    **/
    public void setTempAutoChecking(boolean status,int interval){
        mWriteCommand.syncTemperatureAutomaticTestInterval(status,interval);
    }

    /**
     * 메소드 Override 영역
     **/
    @Override
    public void OnResult(boolean result, int status) {
        Log.i(CLASS_TAG, "result=" + result + ",status=" + status);
        switch (status) {
            case ICallbackStatus.DISCONNECT_STATUS://disconnect
                mHandler.sendEmptyMessage(DISCONNECT_MSG);
                break;
            case ICallbackStatus.CONNECTED_STATUS://connect
                mHandler.sendEmptyMessage(CONNECTED_MSG);
                break;
            case ICallbackStatus.OFFLINE_STEP_SYNC_OK://스텝 동기화 완료
                mHandler.sendEmptyMessage(OFFLINE_STEP_SYNC_OK_MSG);
                break;
            case ICallbackStatus.OFFLINE_SLEEP_SYNC_OK://수면 동기화 완료
                mHandler.sendEmptyMessage(OFFLINE_SLEEP_SYNC_OK_MSG);
                break;
            case ICallbackStatus.OFFLINE_RATE_SYNC_OK://심박 동기화 완료
                mHandler.sendEmptyMessage(OFFLINE_RATE_SYNC_OK_MSG);
                break;
            case ICallbackStatus.OFFLINE_24_HOUR_RATE_SYNC_OK://24시간 심박 동기화 완료
                mHandler.sendEmptyMessage(OFFLINE_24_HOUR_RATE_SYNC_OK_MSG);
                break;
            case ICallbackStatus.SYNC_TEMPERATURE_COMMAND_OK://체온데이터 동기화 완료
                mHandler.sendEmptyMessage(SYNC_TEMPERATURE_COMMAND_OK_MSG);
                break;
            case ICallbackStatus.SYNC_OXYGEN_COMMAND_OK://혈중 산소 포화도 동기화 완료
                mHandler.sendEmptyMessage(OFFLINE_OXYGEN_SYNC_OK_MSG);
                break;
            case ICallbackStatus.OFFLINE_STEP_SYNC_TIMEOUT:
            case ICallbackStatus.OFFLINE_SLEEP_SYNC_TIMEOUT:
            case ICallbackStatus.OFFLINE_RATE_SYNC_TIMEOUT:
            case ICallbackStatus.OFFLINE_24_HOUR_RATE_SYNC_TIMEOUT:
            case ICallbackStatus.OFFLINE_BLOOD_PRESSURE_SYNC_TIMEOUT:
            case ICallbackStatus.SYNC_TEMPERATURE_COMMAND_FINISH_CRC_FAIL:
                Message message = mHandler.obtainMessage();
                Bundle bundle = new Bundle();
                message.what = BAND_SYNC_DATA_FAIL;
                bundle.putInt("status",status);
                message.setData(bundle);
                mHandler.sendMessage(message);

                break;

            case ICallbackStatus.OFFLINE_BLOOD_PRESSURE_SYNCING:
                Log.d(CLASS_TAG, "血压数据同步中");
                break;
            case ICallbackStatus.OFFLINE_BLOOD_PRESSURE_SYNC_OK:
                Log.d(CLASS_TAG, "血压数据同步完成");
                mHandler.sendEmptyMessage(OFFLINE_BLOOD_PRESSURE_SYNC_OK_MSG);
                break;
            case ICallbackStatus.SYNC_TIME_OK:// (时间在同步在SDK内部已经帮忙同步，你不需要同步时间了，sdk内部同步时间完成会自动回调到这里)
                //同步时间成功后，会回调到这里，延迟20毫秒，获取固件版本
                // delay 20ms  send
                // to read
                // localBleVersion
                // mWriteCommand.sendToReadBLEVersion();
                mHandler.sendEmptyMessage(SYNC_TIME_OK_MSG);
                break;
            case ICallbackStatus.GET_BLE_VERSION_OK:// 获取固件版本成功后会回调到这里，延迟20毫秒，设置身高体重到手环
                // localBleVersion
                // finish,
                // then sync
                // step
                // mWriteCommand.syncAllStepData();
                break;

            case ICallbackStatus.DISCOVERY_DEVICE_SHAKE:
                Log.d(CLASS_TAG, "摇一摇拍照");
                // Discovery device Shake
                break;

            case ICallbackStatus.SET_METRICE_OK: // 设置公制单位成功
                break;
            case ICallbackStatus.SET_INCH_OK: //// 设置英制单位成功
                break;
            case ICallbackStatus.SET_FIRST_ALARM_CLOCK_OK: // 设置第1个闹钟OK
                break;
            case ICallbackStatus.SET_SECOND_ALARM_CLOCK_OK: //设置第2个闹钟OK
                break;
            case ICallbackStatus.SET_THIRD_ALARM_CLOCK_OK: // 设置第3个闹钟OK
                break;
            case ICallbackStatus.SEND_PHONE_NAME_NUMBER_OK:
                //mWriteCommand.sendQQWeChatVibrationCommand(5);
                break;
            case ICallbackStatus.SEND_QQ_WHAT_SMS_CONTENT_OK:
                //mWriteCommand.sendQQWeChatVibrationCommand(1);
                break;
            case ICallbackStatus.PASSWORD_SET:
                Log.d(CLASS_TAG, "没设置过密码，请设置4位数字密码");
                mHandler.sendEmptyMessage(SHOW_SET_PASSWORD_MSG);
                break;
            case ICallbackStatus.PASSWORD_INPUT:
                Log.d(CLASS_TAG, "已设置过密码，请输入已设置的4位数字密码");
                mHandler.sendEmptyMessage(SHOW_INPUT_PASSWORD_MSG);
                break;
            case ICallbackStatus.PASSWORD_AUTHENTICATION_OK:
                Log.d(CLASS_TAG, "验证成功或者设置密码成功");
                break;
            case ICallbackStatus.PASSWORD_INPUT_AGAIN:
                Log.d(CLASS_TAG, "验证失败或者设置密码失败，请重新输入4位数字密码，如果已设置过密码，请输入已设置的密码");
                mHandler.sendEmptyMessage(SHOW_INPUT_PASSWORD_AGAIN_MSG);
                break;
            case ICallbackStatus.OFFLINE_SWIM_SYNCING:
                Log.d(CLASS_TAG, "游泳数据同步中");
                break;
            case ICallbackStatus.OFFLINE_SWIM_SYNC_OK:
                Log.d(CLASS_TAG, "游泳数据同步完成");
                mHandler.sendEmptyMessage(OFFLINE_SWIM_SYNC_OK_MSG);
                break;
            case ICallbackStatus.OFFLINE_SKIP_SYNCING:
                Log.d(CLASS_TAG, "跳绳数据同步中");
                break;
            case ICallbackStatus.OFFLINE_SKIP_SYNC_OK:
                Log.d(CLASS_TAG, "跳绳数据同步完成");
                mHandler.sendEmptyMessage(OFFLINE_SKIP_SYNC_OK_MSG);
                break;
            case ICallbackStatus.PRESS_SWITCH_SCREEN_BUTTON:
                Log.d(CLASS_TAG, "表示按键1短按下，用来做切换屏,表示切换了手环屏幕");
                mHandler.sendEmptyMessage(test_mag1);
                break;
            case ICallbackStatus.PRESS_END_CALL_BUTTON:
                Log.d(CLASS_TAG, "表示按键1长按下，一键拒接来电");
                break;
            case ICallbackStatus.PRESS_TAKE_PICTURE_BUTTON:
                Log.d(CLASS_TAG, "表示按键2短按下，用来做一键拍照");
                break;
            case ICallbackStatus.PRESS_SOS_BUTTON:
                Log.d(CLASS_TAG, "表示按键3短按下，用来做一键SOS");
                mHandler.sendEmptyMessage(test_mag2);
                break;
            case ICallbackStatus.PRESS_FIND_PHONE_BUTTON:
                Log.d(CLASS_TAG, "表示按键按下，手环查找手机的功能。");

                break;
            case ICallbackStatus.READ_ONCE_AIR_PRESSURE_TEMPERATURE_SUCCESS:
                Log.d(CLASS_TAG, "读取当前气压传感器气压值和温度值成功，数据已保存到数据库，查询请调用查询数据库接口，返回的数据中，最新的一条为本次读取的数据");
                break;
            case ICallbackStatus.SYNC_HISORY_AIR_PRESSURE_TEMPERATURE_SUCCESS:
                Log.d(CLASS_TAG, "同步当天历史数据成功，包括气压传感器气压值和温度值，数据已保存到数据库，查询请调用查询数据库接口");
                break;
            case ICallbackStatus.SYNC_HISORY_AIR_PRESSURE_TEMPERATURE_FAIL:
                Log.d(CLASS_TAG, "同步当天历史数据失败，数据不保存");
                break;
            case ICallbackStatus.START_BREATHE_COMMAND_OK:
                Log.d(CLASS_TAG, "开启测试呼吸率");
                BreatheUtil.LogI("开启测试呼吸率");
                break;
            case ICallbackStatus.STOP_BREATHE_COMMAND_OK:
                BreatheUtil.LogI("关闭测试呼吸率");
                break;
            case ICallbackStatus.QUERY_CURRENT_BREATHE_COMMAND_OK:
                BreatheUtil.LogI("获取当前呼吸率测试状态");
                break;
            case ICallbackStatus.BREATHE_DATA_SYNCING:
                BreatheUtil.LogI("同步呼吸率数据中");
                break;
            case ICallbackStatus.SYNC_BREATHE_COMMAND_OK:
                BreatheUtil.LogI("同步呼吸率数据完成");
                break;
            case ICallbackStatus.SET_BREATHE_AUTOMATIC_TEST_COMMAND_OK:
                BreatheUtil.LogI("设置呼吸率自动测试完成");
                break;
            case ICallbackStatus.SYNC_BREATHE_TIME_PERIOD_COMMAND_OK:
                BreatheUtil.LogI("设置呼吸率时间段和开关");
                break;
            default:
                break;
        }
    }
    @Override
    public void onBreatheResult(int i, BreatheInfo breatheInfo) {

    }

    /**
     * Oxygen 측정 데이터
    **/
    OxygenInfo tempOxygenInfo = null;
    @Override
    public void onTestResult(int status, OxygenInfo info) {
        Message message = new Message();

        if (status == OxygenUtil.OXYGEN_TEST_START_HAS_VALUE) { //산소 포화도 측정 중
            message.what = OXYGEN_CHECKING;//status;
            //message.obj = info;
            if(info.getCalendar() !=null){
                tempOxygenInfo = info;
            }
        } else if (status == OxygenUtil.OXYGEN_TEST_START_NO_VALUE) { //산소 포화도 측정 시작
            message.what = OXYGEN_CHECK_START;//status;
            tempOxygenInfo = null;
        } else if (status == OxygenUtil.OXYGEN_TEST_STOP_HAS_VALUE) { //산소포화도 측정 종료
            message.what = OXYGEN_CHECK_STOP;//status;
            //message.obj = info;//oxygen value is "info.getOxygenValue()"
            if(info.getCalendar() !=null){
                tempOxygenInfo = info;
            }
        } else if (status == OxygenUtil.OXYGEN_TEST_STOP_NO_VALUE) {//stop has no oxygen value
            message.what = status;
        } else if (status == OxygenUtil.OXYGEN_TEST_TIME_OUT) {//Test time out
            message.what = status;
        }
        Log.d(CLASS_TAG,"onTestResult status =" + status + ",info =" + info.getCalendar()+"///"+info.getStartDate()+"////"+info.getTime()+"///"+info.getOxygenValue());
        mHandler.sendMessage(message);
    }

    @Override
    public void onRateCalibrationStatus(int i) {
        Log.d(CLASS_TAG,"onRateCalibrationStatus()");
    }

    @Override
    public void onTestResult(TemperatureInfo tempInfo) {
        Log.d(CLASS_TAG,"onTestResult() TempInfo calendar =" + tempInfo.getCalendar() + ",startDate =" + tempInfo.getStartDate() + ",secondTime =" + tempInfo.getSecondTime()
                + ",bodyTemperature =" + tempInfo.getBodyTemperature());
    }
    /**
    * 체온 측정 시 콜백 리스너
    **/
    int oldTempSecondTime = 0;
    @Override
    public void onSamplingResult(TemperatureInfo tempInfo) {
        Log.d(CLASS_TAG,"onSamplingResult() TempInfo type ="+tempInfo.getType()+",calendar =" + tempInfo.getCalendar() + ",startDate =" + tempInfo.getStartDate() + ",secondTime =" + tempInfo.getSecondTime()
                + ",bodyTemperature =" + tempInfo.getBodyTemperature()+",bodySurfaceTemperature ="+tempInfo.getBodySurfaceTemperature()
                +",ambientTemperature ="+tempInfo.getAmbientTemperature());
        Message message = new Message();
        message.obj = tempInfo;
        if(oldTempSecondTime == 0){
            //온도 측정 시작 시에 들어온 체온 데이터를 공통 DB(COM_DB_NAME = "SmartBand.db")에 저장하자.
            message.what = TEMP_CHECKING_START;
        }else if(oldTempSecondTime != 0 && (tempInfo.getSecondTime() - oldTempSecondTime) < 5){
            //온도 측정 시간이 이전 측정 시간의 차가 5초 이하면 계속 밴드에서 온도 측정중임으로 판단하고 onChangeTemp 호출하여 웹뷰 화면으로 값을 화면 갱신용 정도로만 사용할 수 있도록 전달 하자.
            message.what = TEMP_CHECKING;
        }else{
            //5초 이상이면 밴드에서 온도 측정이 종료 되었다가 다시 측정되었다는 의미로 간주하고 체온 데이터를 공통 DB(COM_DB_NAME = "SmartBand.db")에 저장하자.
            message.what = TEMP_CHECKING_START;
            oldTempSecondTime = 0;
        }
        Log.d(CLASS_TAG,"onSamplingResult() TempInfo oldSecondTime : "+oldTempSecondTime + ", oldTM-curTM : "+(tempInfo.getSecondTime() - oldTempSecondTime)+",message.what : "+message.what);
        mHandler.sendMessage(message);
        oldTempSecondTime = tempInfo.getSecondTime();
    }

    @Override
    public void onTurnWristCalibrationStatus(int i) {

    }
    @Override
    public void OnDataResult(boolean result, int status, byte[] bytes) {
        Log.i(CLASS_TAG, "OnDataResult() result=" + result + ",status=" + status);
    }

    @Override
    public void onCharacteristicWriteCallback(int status) {
        // 写入操作的系统回调，status = 0为写入成功，其他或无回调表示失败
        Log.d(CLASS_TAG, "Write System callback status = " + status);
    }

    @Override
    public void onIbeaconWriteCallback(boolean b, int i, int i1, String s) {

    }

    @Override
    public void onQueryDialModeCallback(boolean b, int i, int i1, int i2) {

    }

    @Override
    public void onControlDialCallback(boolean b, int i, int i1) {

    }

    @Override
    public void onSportsTimeCallback(boolean b, String s, int i, int i1) {

    }

    @Override
    public void OnResultSportsModes(boolean b, int i, boolean b1, int i1, SportsModesInfo sportsModesInfo) {

    }

    @Override
    public void OnResultHeartRateHeadset(boolean b, int i, int i1, int i2, HeartRateHeadsetSportModeInfo heartRateHeadsetSportModeInfo) {
        Log.d(CLASS_TAG,"OnResultHeartRateHeadset()");
    }

    @Override
    public void OnServerCallback(int i, String s) {

    }

    @Override
    public void OnServiceStatuslt(int status) {
        Log.d(CLASS_TAG, "OnServiceStatuslt status ="+status);
        if (status == ICallbackStatus.BLE_SERVICE_START_OK) {
            Log.d(CLASS_TAG, "OnServiceStatuslt mBluetoothLeService ="+mBluetoothLeService);
            if (mBluetoothLeService == null) {
                mBluetoothLeService = mBLEServiceOperate.getBleService();
                mBluetoothLeService.setICallback(this);
                Log.d(CLASS_TAG, "OnServiceStatuslt mBluetoothLeService22 ="+mBluetoothLeService);
                String bandLastAddr = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
                BandConnect(bandLastAddr);
            }
        }
    }

}
