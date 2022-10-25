package iitp.infection.pm.database;

public class DBConfig {
    public static int BAND_SDK_DB_VER = 13;
    public static String BAND_SDK_DB_NAME = "pedometer.db";
    public static int COM_DB_VER = 1;
    public static String COM_DB_NAME = "SmartBand.db";
    //CHECK FIT 스마트 밴드 SDK를 통하여 생성된 DB 테이블
    public static String SDK_DB_OXYGEN= "oxygen_table";
    public static String SDK_DB_24RATE= "rate_24_hour_table_name";
    public static String SDK_DB_SLEEP= "sleep_total_table";
    public static String SDK_DB_STEP= "step_total_table";
    public static String SDK_DB_BLOOD= "blood_pressure_";//혈압은 날짜별로 테이블을 생성하므로 끝에 날자가 추가로 붙어야
    public static String SDK_DB_TEMP= "temperature_table";

    //공통 DB 테이블 정보
    //테이블 및 INDEX 명
    public static String DB_T_SBDEVICE= "SbDevice";
    public static String DB_T_STEP= "SbSyncStep";
    public static String DB_I_STEP= "SbSyncStep_Index";
    public static String DB_T_SLEEP= "SbSyncSleep";
    public static String DB_I_SLEEP= "SbSyncSleep_Index";
    public static String DB_T_HRM= "SbSyncHRM";
    public static String DB_I_HRM= "SbSyncHRM_Index";
    public static String DB_T_BP= "SbSyncBP";
    public static String DB_I_BP= "SbSyncBP_Index";
    public static String DB_T_TEMP= "SbSyncTemperature";
    public static String DB_I_TEMP= "SbSyncTemperature_Index";
    public static String DB_T_OXYGEN= "SbSyncOxygen";
    public static String DB_I_OXYGEN= "SbSyncOxygen_Index";
    //테이블 creat 쿼리문
    public static String T_CREAT_SBDEVICE = "CREATE TABLE IF NOT EXISTS "+DB_T_SBDEVICE+"(dId VARCHAR PRIMARY KEY NOT NULL, dName VARCHAR, dFirstSync INTEGER, dLastSync INTEGER, dLastConn INTEGER)";
    public static String T_CREAT_STEP = "CREATE TABLE IF NOT EXISTS "+DB_T_STEP+"(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER default 0, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
    public static String I_CREAT_STEP= "CREATE INDEX IF NOT EXISTS "+DB_I_STEP+" ON SbSyncStep(sDeviceId, sDate)";
    public static String T_CREAT_SLEEP= "CREATE TABLE IF NOT EXISTS "+DB_T_SLEEP+"(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER default 0, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
    public static String I_CREAT_SLEEP= "CREATE INDEX IF NOT EXISTS "+DB_I_SLEEP+" ON SbSyncSleep(sDeviceId, sDate)";
    public static String T_CREAT_HRM= "CREATE TABLE IF NOT EXISTS "+DB_T_HRM+"(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER default 0, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
    public static String I_CREAT_HRM= "CREATE INDEX IF NOT EXISTS "+DB_I_HRM+" ON SbSyncHRM(sDeviceId, sDate)";
    public static String T_CREAT_BP= "CREATE TABLE IF NOT EXISTS "+DB_T_BP+"(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER default 0, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
    public static String I_CREAT_BP= "CREATE INDEX IF NOT EXISTS "+DB_I_BP+" ON SbSyncBP(sDeviceId, sDate)";
    public static String T_CREAT_TEMP= "CREATE TABLE IF NOT EXISTS "+DB_T_TEMP+"(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER default 0, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
    public static String I_CREAT_TEMP= "CREATE INDEX IF NOT EXISTS "+DB_I_TEMP+" ON SbSyncTemperature(sDeviceId, sDate)";
    public static String T_CREAT_OXYGEN= "CREATE TABLE IF NOT EXISTS "+DB_T_OXYGEN+"(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER default 0, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
    public static String I_CREAT_OXYGEN= "CREATE INDEX IF NOT EXISTS "+DB_I_OXYGEN+" ON SbSyncOxygen(sDeviceId, sDate)";

}
