package iitp.infection.pm.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class DBHelper extends SQLiteOpenHelper {
    String CLASS_TAG = DBHelper.class.getSimpleName();
    public DBHelper(Context context,String dbFileNm,int dbVersion){

        super(context,dbFileNm,null,dbVersion);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        Log.d(CLASS_TAG,"onCreate");
        //밴드 데이터 스마트 폰 로컬 DB 관리를 밴드 제조사에서 직접 적재하는 DB 파일이 아닌
        //별도의 공통 DB 파일로 생성해서 관리 하는 것으로 이야기가 나와 DB 파일 및 테이블을 새로 만든다.
        //CHECK FIT 제폼은 밴드 데이터를 직접적으로 받을 수 없어, 밴드 SDK내에서 저장하는 DB를 쿼리하여 신규 DB에 다시 insert 해야 한다.
        db.execSQL(DBConfig.T_CREAT_SBDEVICE);
        db.execSQL(DBConfig.T_CREAT_STEP);
        db.execSQL(DBConfig.I_CREAT_STEP);
        db.execSQL(DBConfig.T_CREAT_SLEEP);
        db.execSQL(DBConfig.I_CREAT_SLEEP);
        db.execSQL(DBConfig.T_CREAT_BP);
        db.execSQL(DBConfig.I_CREAT_BP);
        db.execSQL(DBConfig.T_CREAT_HRM);
        db.execSQL(DBConfig.I_CREAT_HRM);
        db.execSQL(DBConfig.T_CREAT_OXYGEN);
        db.execSQL(DBConfig.I_CREAT_OXYGEN);
        db.execSQL(DBConfig.T_CREAT_TEMP);
        db.execSQL(DBConfig.I_CREAT_TEMP);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.d(CLASS_TAG,"onUpgrade");
        //밴드 데이터 스마트 폰 로컬 DB 관리를 밴드 제조사에서 직접 적재하는 DB 파일이 아닌
        //별도의 공통 DB 파일로 생성해서 관리 하는 것으로 이야기가 나와 DB 파일 및 테이블을 새로 만든다.
        //CHECK FIT 제폼은 밴드 데이터를 직접적으로 받을 수 없어, 밴드 SDK내에서 저장하는 DB를 쿼리하여 신규 DB에 다시 insert 해야 한다.
        String dropTabel = "DROP TABLE IF EXISTS ";
        db.execSQL(dropTabel + DBConfig.T_CREAT_SBDEVICE);
        db.execSQL(dropTabel + DBConfig.T_CREAT_STEP);
        db.execSQL(dropTabel + DBConfig.I_CREAT_STEP);
        db.execSQL(dropTabel + DBConfig.T_CREAT_SLEEP);
        db.execSQL(dropTabel + DBConfig.I_CREAT_SLEEP);
        db.execSQL(dropTabel + DBConfig.T_CREAT_BP);
        db.execSQL(dropTabel + DBConfig.I_CREAT_BP);
        db.execSQL(dropTabel + DBConfig.T_CREAT_HRM);
        db.execSQL(dropTabel + DBConfig.I_CREAT_HRM);
        db.execSQL(dropTabel + DBConfig.T_CREAT_OXYGEN);
        db.execSQL(dropTabel + DBConfig.I_CREAT_OXYGEN);
        db.execSQL(dropTabel + DBConfig.T_CREAT_TEMP);
        db.execSQL(dropTabel + DBConfig.I_CREAT_TEMP);
        onCreate(db);
    }
    //데이터 insert
    public boolean insertData(String tableName, ContentValues contentValues){
        SQLiteDatabase db = this.getWritableDatabase();
        long result = db.insert(tableName,null,contentValues);
        if(result == -1){
            return false;
        }else{
            return true;
        }
    }
    public void insertAndReplace(String sql){
        SQLiteDatabase db = this.getWritableDatabase();
        db.execSQL(sql);
        //int catId = (int) db.insertWithOnConflict(tableName,null,contentValues,SQLiteDatabase.CONFLICT_REPLACE);
        //Log.d(CLASS_TAG,"insertWithOnConflict () catID :"+catId);
    }
    public void dataDelect(String tableNm){
//        SQLiteDatabase db = this.getWritableDatabase();
//        String sql = "DELETE FROM "+tableNm;
//        db.execSQL(sql);
        SQLiteDatabase db = this.getWritableDatabase();
        String sql = "DELETE FROM "+tableNm;
        if(tableNm == DBConfig.SDK_DB_BLOOD){
            String allTableSelSql = "select DISTINCT tbl_name from sqlite_master WHERE tbl_name LIKE 'blood_pressure_%'";
            Cursor cursor = queryData(allTableSelSql);
            while (cursor.moveToNext()){
                Log.d(CLASS_TAG,"queryAllBloodInsert() table Name : "+cursor.getString(0));
                sql = "DELETE FROM "+ cursor.getString(0);
                db.execSQL(sql);
            }
            cursor.close();
        }else{
            db.execSQL(sql);
        }

    }
    public boolean updateData(String tableName,ContentValues contentValues,String whereKey, String whereValue){
        SQLiteDatabase db = this.getWritableDatabase();
        //db.execSQL(sql);
        long result = db.update(tableName,contentValues,whereKey + " = ?",new String[]{whereValue});
        Log.d(CLASS_TAG,"updateData () result:"+result);
        if(result == -1){
            return false;
        }else{
            return true;
        }
    }
    //데이터 쿼리
    public Cursor queryData(String queryStr){
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor resultCus = db.rawQuery(queryStr,null);
        return resultCus;
    }
    //데이터 중복 체크
    public boolean chkDuplicated(String query){
        boolean duplicated = false;
        SQLiteDatabase db = this.getReadableDatabase();
        Cursor curChk = db.rawQuery(query, null);

        if (curChk.moveToFirst()) {
            duplicated = true;
        }

        curChk.close();
        return duplicated;
    }
    //테이블이 존재하는지 확인
    public boolean tableIsExists(String tableNm){
        SQLiteDatabase db = this.getReadableDatabase();
        String sQ = "select DISTINCT tbl_name from sqlite_master WHERE tbl_name = '"+tableNm+"'";
        Cursor resultCus = db.rawQuery(sQ,null);
        boolean resultState = false;
        if(resultCus.getCount() >0){
            //테이블 존재
            resultState = true;
        }else{
            //테이블 미존
            resultState = false;
        }
        Log.d("SONG","존재여부 : "+resultCus.getCount());
        return resultState;
    }
}
