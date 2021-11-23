package iitp.infection.pm.band;


import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;

import android.support.v4.app.ActivityCompat;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.yc.pedometer.sdk.BLEServiceOperate;
import com.yc.pedometer.sdk.DeviceScanInterfacer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import iitp.infection.pm.R;
import iitp.infection.pm.samples.utils.ComListener;
import iitp.infection.pm.samples.utils.CommUtils;
import m.client.android.library.core.view.MainActivity;


public class BandScan implements DeviceScanInterfacer, ComListener.PermissionsResultListener,ComListener.BluetoothResultListener  {
    private String CLASS_TAG = "BandCon";
    private String mCallback;
    //public static String schBandNM = "COVID";//특정 밴드만 목록으로 조회할 명칭
    private static Context mContext;
    private MainActivity mActivity;
    private boolean mScanning;
    private Handler mHandler;
    // Stops scanning after 10 seconds.
    private final long SCAN_PERIOD = 3000;
    private BLEServiceOperate mBLEServiceOperate;
    private static BandScan instance = null;
    JSONArray bandInfoList; //= new JSONArray();


    public static BandScan getInstance(MainActivity activity, Context context,String callback) {
        if (instance == null) {
            instance = new BandScan(activity, context, callback);
        }else{
            instance.bleServiceOperate();
        }
        return instance;

    }
    public BandScan(MainActivity activity, Context applicationContext, String callback){
        mContext = applicationContext;
        mActivity = activity;
        mCallback = callback;
        bleServiceOperate();
    }

    private void bleServiceOperate(){
        mHandler = new Handler();
        mBLEServiceOperate = BLEServiceOperate.getInstance(mContext);

        // Checks if Bluetooth is supported on the device.
        if (!mBLEServiceOperate.isSupportBle4_0()) {
            Toast.makeText(mContext, R.string.not_support_ble, Toast.LENGTH_SHORT).show();
            mActivity.finish();
            return;
        }
        //블루투스 활성화 result 리스너
        ComListener.setBluetoothResultListener(this);
        //퍼미션 체크
        ComListener.setPermissionsResultListener(this);
        if (!ComListener.hasPermissions(mActivity, ComListener.PERMISSIONS)) {
            //허용이 안되어 있는 경우
            ActivityCompat.requestPermissions(mActivity, ComListener.PERMISSIONS, 100);
        } else {
            // 허용이 되어 있는 경우
            scanLeDevice(true);
        }

    }

    //밴드 스캔
    public void scanLeDevice(final boolean enable) {
        bandInfoList = new JSONArray();
        //Bluetooth가 활성화되어 있는지 체크
        if (!mBLEServiceOperate.isBleEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            mActivity.startActivityForResult(enableBtIntent, 1);
            return;
        }
        mBLEServiceOperate.setDeviceScanListener(this);
        if (enable) {
            // Stops scanning after a pre-defined scan period.
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    bandScanStop();
                    mActivity.runOnUiThread(new Runnable(){

                        @Override
                        public void run() {
                            Log.d(CLASS_TAG, "scanLeDevice band Stop & list Callback "+mCallback);
                            mActivity.getWebView().loadUrl("javascript:" + mCallback + "("+new CommUtils().setJSONData("list",bandInfoList)+")");
                        }
                    });

                }
            }, SCAN_PERIOD); //10초동안 스켄 종료

            mScanning = true;
            mBLEServiceOperate.startLeScan();
            CommUtils.showLoading(mActivity,"밴드 스캔 중입니다.",false);
            Log.i(CLASS_TAG,"startLeScan");
        } else {
            bandScanStop();
        }

    }
    //밴드 스켄 중지
    public void bandScanStop(){
        Log.i(CLASS_TAG,"bandScanStop");
        if (mScanning) {
            mBLEServiceOperate.stopLeScan();
            mScanning = false;
            CommUtils.hideLoading(mActivity);
        }
    }
    //스캔된 밴드 리스트 생성
    @SuppressLint("NewApi")
    public void addBandList(JSONObject device) throws JSONException {
        boolean repeat = false;
        for (int i=0; i < bandInfoList.length(); i++){
            JSONObject parseObj = (JSONObject) bandInfoList.get(i);
            if(parseObj.get("band_addr").equals(device.getString("band_addr"))){
                bandInfoList.remove(i);
                bandInfoList.put(device);
                repeat = true;
            }
        }
        if (!repeat) {
            bandInfoList.put(device);
        }
    }
    @Override
    public void LeScanCallback(final BluetoothDevice device, final int rssi, byte[] bytes) {
        final JSONObject bandInfo = new JSONObject();
        mActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {

                if (device != null) {
                    if (TextUtils.isEmpty(device.getName())) {
                        return;
                    }
                    Log.i(CLASS_TAG,"LeScanCallback [deviceNM : "+device.getName() + "] [deviceAddr : "+device.getAddress() +"] [rssi : "+rssi+"]");
                    BandDevices mBleDevices = new BandDevices(device.getName(),device.getAddress(), rssi);
                    try {
                        bandInfo.put("band_name",device.getName());
                        bandInfo.put("band_addr",device.getAddress());
                        if(device.getName().contains(CommConfig.CHECKFIT_SMART_WATCH)){//CHECK FIT 스마트 워치만 목록으로 담기
                            addBandList(bandInfo);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

    }

    @Override
    public void onPermissionsResultListener(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case ComListener.PERMISSION_ALL: {
                if (!ComListener.hasPermissions(mActivity, permissions)) {
                    //사용자가 거부한 경우
                    if(ComListener.per_dont_ask){
                        //NO_DONT_ASK
                    }else{
                        //NO
                    }

               } else {
                    //사용자가 허용한 경우
                    scanLeDevice(true);
                }
                break;
            }
        }
    }

    @Override
    public void onBluetoothResultListener() {
        scanLeDevice(true);
    }
}
