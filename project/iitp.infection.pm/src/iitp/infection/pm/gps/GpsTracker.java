package iitp.infection.pm.gps;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import android.util.Log;
import android.widget.Toast;

public class GpsTracker implements LocationListener {
    private static final String CLASS_TAG = GpsTracker.class.getSimpleName();

    /** 최소 GPS 정보 업데이트 거리 1미터 */
    private static final float UPDATE_DISTANCE = 1.0f;
    /** 최소 GPS 정보 업데이트 시간 밀리세컨 1초 */
    private static final long UPDATE_TIME = 1000 * 10;
    private Context mContext;
    private static GpsTracker instance = null;
    private Location mLastLocation;

    /** GPS 위치 수신 리스너 **/
    private OnLocationListener mOnLocationListener;
    public interface OnLocationListener {
        void onResult(Location location);
    }
    public void setOnLocationListener(OnLocationListener l) {
        mOnLocationListener = l;
    }

    public GpsTracker(Context context) {
        mContext = context;
    }
    public static GpsTracker getInstance(Context context) {
        if (instance == null) {
            instance = new GpsTracker(context);
        }
        return instance;

    }

    /**
     * GPS 현재위치 수신 시작
     **/
    public void startCurrentLocation(){
        Log.i(CLASS_TAG, "startCurrentLocation");

        // Acquire a reference to the system Location Manager
        final LocationManager locationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
        if (locationManager == null) {
            return;
        }

        // GPS 프로바이더 사용가능여부
        final boolean isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        // 네트워크 프로바이더 사용가능여부
        final boolean isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

        Log.d(CLASS_TAG, "isGPSEnabled = " + isGPSEnabled);
        Log.d(CLASS_TAG, "isNetworkEnabled = " + isNetworkEnabled);

        if (!isGPSEnabled && !isNetworkEnabled) {
            Log.e(CLASS_TAG, "if (!isGPSEnabled && !isNetworkEnabled)");
            return;
        }

        int checkSelfPermission = ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION);
        Log.d(CLASS_TAG, "checkSelfPermission = " + checkSelfPermission);

        if(checkSelfPermission != PackageManager.PERMISSION_GRANTED) {
            Log.e(CLASS_TAG, "ACCESS_FINE_LOCATION PERMISSION_DENIED");
            return;
        }

        Location gpsLastKnownLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        Log.e(CLASS_TAG, "gpsLastKnownLocation = " + gpsLastKnownLocation);
        Location netLastKnownLocation = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        Log.e(CLASS_TAG, "netLastKnownLocation = " + netLastKnownLocation);

        // requestLocationUpdates 시도한다고 해도  바로 현위치 좌표가 onLocationChanged 메소드로 들어오지 않는 경우가 있다 따라서 마지막 수신된 좌표를
        // 최초 콜백하여 현위치 좌표로 사용할 수 있다 단 해당 마지막 좌표를 언제 획득했는지에 대한 시간을 확인 할 수 있으므로 오랜된 좌표인지 아닌지를 판단하여 사용 할 것
        if(mLastLocation == null) {
            mLastLocation = gpsLastKnownLocation != null ? gpsLastKnownLocation : netLastKnownLocation;

        }

        Criteria criteria = new Criteria();
        criteria.setHorizontalAccuracy(Criteria.ACCURACY_HIGH);
        criteria.setVerticalAccuracy(Criteria.ACCURACY_HIGH);
        //criteria.setAccuracy(Criteria.ACCURACY_COARSE);
        criteria.setPowerRequirement(Criteria.POWER_HIGH);
        criteria.setAltitudeRequired(false);
        criteria.setSpeedRequired(true);
        criteria.setCostAllowed(true);
        criteria.setBearingRequired(false);

        // 우선순위에 따라 하나의 위치정보값만 사용
        // 시간과 거리는 OR 조건이 아닌 AND 조건임.
        // 시간내에 거리가 만족하면 onLocationChanged가 호출됨.
        locationManager.requestLocationUpdates(UPDATE_TIME, UPDATE_DISTANCE, criteria, this, null);
//        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,UPDATE_TIME,UPDATE_DISTANCE,this,null);
    }
    /*
     * GPS 현재위치 수신 종료
    **/
    public void stopCurrentLocation(){
        Log.i(CLASS_TAG, "stopCurrentLocation");
        LocationManager locationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
        locationManager.removeUpdates(this);
        // 리스너 삭제
        mOnLocationListener = null;
    }
    @Override
    public void onLocationChanged(Location location) {
        Log.d(CLASS_TAG, "mLastLocation = " + mLastLocation);
        Log.d(CLASS_TAG, "location = " + location);
        Log.d(CLASS_TAG, "location.getLatitude() = " + location.getLatitude());
        Log.d(CLASS_TAG, "location.getLongitude() = " + location.getLongitude());
        Log.d(CLASS_TAG, "location.getAccuracy() = " + location.getAccuracy());
        Toast.makeText(mContext,"onLocationChanged Provider11: "+location.getProvider(),Toast.LENGTH_LONG).show();
        mLastLocation = location;

        if(mOnLocationListener != null) {
            mOnLocationListener.onResult(mLastLocation);
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }
}
