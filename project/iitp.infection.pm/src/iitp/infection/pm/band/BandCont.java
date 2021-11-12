package iitp.infection.pm.band;

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
import com.yc.pedometer.info.SportsModesInfo;
import com.yc.pedometer.info.StepOneDayAllInfo;
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
import com.yc.pedometer.utils.BreatheUtil;
import com.yc.pedometer.utils.GlobalVariable;

import iitp.infection.pm.R;
import iitp.infection.pm.samples.utils.CommUtils;
import m.client.android.library.core.view.MainActivity;

public class BandCont implements ICallback, ServiceStatusCallback, OnServerCallbackListener, RateCalibrationListener,
        TurnWristCalibrationListener, TemperatureListener, OxygenRealListener, BreatheRealListener{
    private String CLASS_TAG = BandCont.class.getSimpleName();
    private static BandCont instance = null;
    private static Context mContext;
    private MainActivity mActivity;
    private BLEServiceOperate mBLEServiceOperate;
    private BluetoothLeService mBluetoothLeService;
    private SharedPreferences sp;
    private DataProcessing mDataProcessing;
    private WriteCommandToBLE mWriteCommand;//밴드 데이터 가져오기 위함
    private UTESQLOperate mySQLOperate;
    private boolean newBandContAble = false;//현재 연결된 밴드가 아닌 새로운 Check fit 밴드가 연결되는지 확인
    //private boolean isBandConnect;
//    private final int CONNECTED = 1;
//    private final int CONNECTING = 2;
//    private final int DISCONNECTED = 3;
//    private int CURRENT_STATUS = DISCONNECTED;
    public final int BAND_SYNC_STEP = 0;
    public final int BAND_SYNC_SLEEP = 1;
    public final int BAND_SYNC_RATE = 2;
    public final int BAND_SYNC_BLOOD = 3;
    public final int BAND_SYNC_TEMPERATURE = 4;

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
    private final int BAND_SYNC_DATA_FAIL = 9990;
    public static BandCont getInstance(MainActivity activity, Context context) {
        if (instance == null) {
            instance = new BandCont(activity, context);
        }
        return instance;

    }
    public BandCont(MainActivity activity, Context applicationContext){
        mContext = applicationContext;
        mActivity = activity;
        sp = mContext.getSharedPreferences(GlobalVariable.SettingSP, 0);
        mySQLOperate = UTESQLOperate.getInstance(mContext);// 2.2.1版本修改
    }
    //밴드 연결
    public void BandConnect(String bandAddr){
        mBLEServiceOperate = BLEServiceOperate.getInstance(mContext);
        mBLEServiceOperate.setServiceStatusCallback(this);
        mBluetoothLeService = mBLEServiceOperate.getBleService();
        if (mBluetoothLeService != null) {
            mBluetoothLeService.setICallback(this);

            mBluetoothLeService.setRateCalibrationListener(this);//设置心率校准监听(심박수 보정 모니터 설정)
            mBluetoothLeService.setTurnWristCalibrationListener(this);//设置翻腕校准监听(손목시계 보정 설정)
            mBluetoothLeService.setTemperatureListener(this);//设置体温测试(체온 테스트 설정)，采样数据回调(샘플 데이터 콜백)
            mBluetoothLeService.setOxygenListener(this);//Oxygen(산소) Listener
            mBluetoothLeService.setBreatheRealListener(this);//Breathe Listener

        }
        mRegisterReceiver();//밴드 버전 및 배터리 체크를 위한 리시버 등록
        dataProcessingListenerInit();//밴드 생체 데이터 sync 리스너 등록
        mWriteCommand = WriteCommandToBLE.getInstance(mContext);
       // mWriteCommand.sendBandLanguageToBle(BandLanguageUtil.BAND_LANGUAGE_KO);//언어설정 국어
        String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
        Log.i(CLASS_TAG, "BandConnect lastConnectAddr0:["+lastConnectAddr0+"] new addr ["+bandAddr+"]");
        if(lastConnectAddr0 != bandAddr){
            newBandContAble = true;
            boolean isBandConnect = sp.getBoolean(GlobalVariable.BLE_CONNECTED_SP,false);
            if (isBandConnect) {
                Log.d(CLASS_TAG, "step Sync isBandConnect :"+isBandConnect);
                mBLEServiceOperate.disConnect();
            }
        }
        mBLEServiceOperate.connect(bandAddr);
        CommUtils.showLoading(mActivity,"",false);

    }
    //밴드 연결 해제
    public void BandDisConnect(){
        if (mBluetoothLeService != null) {
            mBLEServiceOperate.disConnect();
        }
    }
    private void dataProcessingListenerInit(){
        mDataProcessing = DataProcessing.getInstance(mContext);
        mDataProcessing.setOnStepChangeListener(mOnStepChangeListener);//걸음
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
        public void handleMessage(Message msg) {
            final Bundle bundle = msg.getData();

            switch (msg.what) {
                case DISCONNECT_MSG:
                    Toast.makeText(mContext, "disconnect", Toast.LENGTH_SHORT).show();
                    if(!newBandContAble){
                        //마지막에 연결되었던 밴드 재 연결
                        String lastConnectAddr0 = sp.getString(GlobalVariable.LAST_CONNECT_DEVICE_ADDRESS_SP,"00:00:00:00:00:00");
                        boolean connectResute0 = mBLEServiceOperate.connect(lastConnectAddr0);
                        mBLEServiceOperate.connect(lastConnectAddr0);
                        Log.i(CLASS_TAG, "disconnect lastConnectAddr0:["+lastConnectAddr0+"]");
                    }else{
                        newBandContAble = false;
                    }

                    break;
                case CONNECTED_MSG://밴드 연결 성공
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
//                    CURRENT_STATUS = CONNECTED;
                    Toast.makeText(mContext, mContext.getString(R.string.connect), Toast.LENGTH_SHORT).show();
                    bandDataSync(BAND_SYNC_STEP);//스텝 싱크 시작
                    break;
                case UPDATE_STEP_UI_MSG://걸음수가 Change되는 경우
                    //final Bundle bundle = msg.getData();
                    Log.d(CLASS_TAG, "step : "+bundle.getInt("step")+" distance: "+bundle.getInt("distance")+" calories:"+bundle.getInt("calories"));
//                    mActivity.runOnUiThread(new Runnable(){
//                        @Override
//                        public void run() {
//                            mActivity.getWebView().loadUrl("javascript:exCBStepCnt("+bundle.getInt("step")+")");
//                        }
//                    });
                    break;
                case UPDATE_SLEEP_UI_MSG://수면 정보
                    new DataQuery().querySleepInfo(mySQLOperate,"");
                    Log.d(CLASS_TAG, "UPDATE_SLEEP_UI_MSG");
                    break;
                case UPDATA_REAL_RATE_MSG://심박 측정 정보
                    //final Bundle bundle = msg.getData();
                    if (bundle.getInt("status") == GlobalVariable.RATE_TEST_FINISH) {
                        //new DataQuery().UpdateUpdataRateMainUI(mySQLOperate,"");//최저,최고,평균 심박이 필요한 경우 사용
                        //그렇지 않을 경우 그냥 현재 심박만
                        int rate = bundle.getInt("rate");
                        Log.d(CLASS_TAG, "UPDATA_REAL_RATE_MSG 심박 : " + rate);
                    }
                    break;
                case OFFLINE_STEP_SYNC_OK_MSG://스탭 싱크가 완료된 경우
                    new DataQuery().queryStepInfo(mySQLOperate,"");
                    bandDataSync(BAND_SYNC_SLEEP);//수면 싱크 시작
                    break;
                case OFFLINE_SLEEP_SYNC_OK_MSG://수면 싱크가 완료된 경우
                    bandDataSync(BAND_SYNC_RATE);//심박 싱크 시작
                    break;
                case OFFLINE_24_HOUR_RATE_SYNC_OK_MSG://심박 싱크가 완료된 경우
                    bandDataSync(BAND_SYNC_BLOOD);//혈압 싱크 시작
                    break;
                case OFFLINE_BLOOD_PRESSURE_SYNC_OK_MSG://혈압 싱크가 완료된 경우
                    bandDataSync(BAND_SYNC_TEMPERATURE);//혈압 싱크 시작
                    break;
                case SYNC_TEMPERATURE_COMMAND_OK_MSG:
                    CommUtils.hideLoading(mActivity);//
                    break;
                case BAND_SYNC_DATA_FAIL:
                    Log.d(CLASS_TAG, "mHandler status : "+bundle.getInt("status"));
                    CommUtils.hideLoading(mActivity);
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
                Log.d(CLASS_TAG, "step Sync isBandConnect :"+isBandConnect);
                if (isBandConnect) {
                    Log.d(CLASS_TAG, "step Sync");
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
            Bundle bundle = new Bundle();
            message.what = UPDATE_STEP_UI_MSG;
            //message.obj = info;
            if (info!=null) {
                bundle.putInt("step",info.getStep());
                bundle.putFloat("distance",info.getDistance());
                bundle.putFloat("calories",info.getCalories());
                bundle.putInt("runSteps",info.getRunSteps());
                bundle.putFloat("runDistance",info.getRunDistance());
                bundle.putFloat("runCalories",info.getRunCalories());
                bundle.putFloat("runDurationTime",info.getRunDurationTime());
                bundle.putFloat("walkSteps",info.getWalkSteps());
                bundle.putFloat("walkCalories",info.getWalkCalories());
                bundle.putFloat("walkDistance",info.getWalkDistance());
                bundle.putFloat("walkDurationTime",info.getWalkDurationTime());
                message.setData(bundle);

            }
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
//            tempRate = rate;
//            tempStatus = status;
//            Log.i(TAG, "Rate_tempRate =" + tempRate);
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
            if(type =="START"){
                mWriteCommand.sendBloodPressureTestCommand(GlobalVariable.BLOOD_PRESSURE_TEST_START);
            }else{
                mWriteCommand.sendBloodPressureTestCommand(GlobalVariable.BLOOD_PRESSURE_TEST_STOP);
            }
        } else {
            Toast.makeText(mContext, mContext.getString(R.string.disconnect),
                    Toast.LENGTH_SHORT).show();
        }
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
//                mHandler.postDelayed(new Runnable() {
//
//                    @Override
//                    public void run() {
//                        mWriteCommand.sendToQueryPasswardStatus();
//                    }
//                }, 600);// 2.2.1版本修改

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

    @Override
    public void onTestResult(int i, OxygenInfo oxygenInfo) {

    }

    @Override
    public void onRateCalibrationStatus(int i) {

    }

    @Override
    public void onTestResult(TemperatureInfo temperatureInfo) {

    }

    @Override
    public void onSamplingResult(TemperatureInfo temperatureInfo) {

    }

    @Override
    public void onTurnWristCalibrationStatus(int i) {

    }
    @Override
    public void OnDataResult(boolean b, int i, byte[] bytes) {

    }

    @Override
    public void onCharacteristicWriteCallback(int i) {

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

    }

    @Override
    public void OnServerCallback(int i, String s) {

    }

    @Override
    public void OnServiceStatuslt(int i) {

    }

}
