package iitp.infection.pm.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class AlarmDBHelper extends SQLiteOpenHelper {
	String CLASS_TAG = DBHelper.class.getSimpleName();
	public AlarmDBHelper(Context context, String dbFileNm, int dbVersion){

		super(context,dbFileNm,null,dbVersion);
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		Log.d(CLASS_TAG,"onCreate");
		//밴드 데이터 스마트 폰 로컬 DB 관리를 밴드 제조사에서 직접 적재하는 DB 파일이 아닌
		//별도의 공통 DB 파일로 생성해서 관리 하는 것으로 이야기가 나와 DB 파일 및 테이블을 새로 만든다.
		//CHECK FIT 제폼은 밴드 데이터를 직접적으로 받을 수 없어, 밴드 SDK내에서 저장하는 DB를 쿼리하여 신규 DB에 다시 insert 해야 한다.
		db.execSQL(AlarmDBConfig.T_CREAT_ALARM);
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		Log.d(CLASS_TAG,"onUpgrade");
		//밴드 데이터 스마트 폰 로컬 DB 관리를 밴드 제조사에서 직접 적재하는 DB 파일이 아닌
		//별도의 공통 DB 파일로 생성해서 관리 하는 것으로 이야기가 나와 DB 파일 및 테이블을 새로 만든다.
		//CHECK FIT 제폼은 밴드 데이터를 직접적으로 받을 수 없어, 밴드 SDK내에서 저장하는 DB를 쿼리하여 신규 DB에 다시 insert 해야 한다.
		String dropTabel = "DROP TABLE IF EXISTS ";
		db.execSQL(dropTabel + AlarmDBConfig.T_CREAT_ALARM);
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
