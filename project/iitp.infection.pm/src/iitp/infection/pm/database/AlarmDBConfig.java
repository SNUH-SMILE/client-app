package iitp.infection.pm.database;

public class AlarmDBConfig {
    public static int COM_DB_VER = 1;
    public static String COM_DB_NAME = "SmartBand.db";

    //공통 DB 테이블 정보

    //테이블 및 INDEX 명
    public static String DB_T_ALARM= "alarm";

    public static String DB_C_ID= "id";
    public static String DB_C_TITLE= "title";
    public static String DB_C_BODY= "body";
    public static String DB_C_TYPE= "type";
    public static String DB_C_TIME= "time";
    public static String DB_C_EXT= "ext";
    //테이블 creat 쿼리문
    public static String T_CREAT_ALARM = "CREATE TABLE IF NOT EXISTS "+DB_T_ALARM+"(id VARCHAR, title VARCHAR, body VARCHAR, type VARCHAR, time VARCHAR, ext VARCHAR)";

}
