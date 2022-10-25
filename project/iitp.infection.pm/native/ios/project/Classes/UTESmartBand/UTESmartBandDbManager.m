//
//  UTESmartBandDbManager.m
//  iitp.infection.pm
//
//  Created by 유라클 on 2021/11/29.
//

#import "UTESmartBandDbManager.h"
#import <MDb/MDatabaseManager.h>

@interface UTESmartBandDbManager ()

@property (nonatomic, retain) MDatabaseManager *mngr;

@end

@implementation UTESmartBandDbManager

SHARED_m(UTESmartBandDbManager)
SHARED_init

// 싱클톤 init
- (instancetype)initPrivate {
    self = [super init];
    if (self) {
        self.mngr = [MDatabaseManager defaultManagerWithPath:@"SmartBand.db"];
        
        BOOL res1 = [self.mngr createDatabase];
        BOOL res2 = [self.mngr openDatabase];

        NSLog(@"create db : %d", res1);
        NSLog(@"open db : %d", res2);
        
        NSString *qry = nil;
        NSError *err = nil;
        
        // 디바이스 관련 테이블 만듬
        qry = @"CREATE TABLE IF NOT EXISTS SbDevice(dId VARCHAR PRIMARY KEY NOT NULL, dName VARCHAR, dFirstSync INTEGER, dLastSync INTEGER, dLastConn INTEGER)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        // 동기화 데이터
        qry = @"CREATE TABLE IF NOT EXISTS SbSyncStep(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        qry = @"CREATE INDEX IF NOT EXISTS SbSyncStep_Index ON SbSyncStep(sDeviceId, sDate)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        // 동기화 데이터
        qry = @"CREATE TABLE IF NOT EXISTS SbSyncSleep(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        qry = @"CREATE INDEX IF NOT EXISTS SbSyncSleep_Index ON SbSyncSleep(sDeviceId, sDate)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        // 동기화 데이터
        qry = @"CREATE TABLE IF NOT EXISTS SbSyncHRM(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        qry = @"CREATE INDEX IF NOT EXISTS SbSyncHRM_Index ON SbSyncHRM(sDeviceId, sDate)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        // 동기화 데이터
        qry = @"CREATE TABLE IF NOT EXISTS SbSyncBP(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        qry = @"CREATE INDEX IF NOT EXISTS SbSyncBP_Index ON SbSyncBP(sDeviceId, sDate)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        // 동기화 데이터
        qry = @"CREATE TABLE IF NOT EXISTS SbSyncTemperature(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        qry = @"CREATE INDEX IF NOT EXISTS SbSyncTemperature_Index ON SbSyncTemperature(sDeviceId, sDate)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        // 동기화 데이터
        qry = @"CREATE TABLE IF NOT EXISTS SbSyncOxygen(sDeviceId VARCHAR, sDate VARCHAR, sDate1 VARCHAR, sTime1 VARCHAR, sDate2 VARCHAR, sTime2 VARCHAR, sV1 VARCHAR, sV2 VARCHAR, sV3 VARCHAR, sV4 VARCHAR, sV5 VARCHAR, sSyncServer INTEGER, PRIMARY KEY (sDeviceId, sDate1, sTime1))";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        qry = @"CREATE INDEX IF NOT EXISTS SbSyncOxygen_Index ON SbSyncOxygen(sDeviceId, sDate)";
        err = nil;
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        /*
         
         //    STEP(걸음정보) - 1
         //    SLEEP(수면정보) - 2
         //    RATE(심박정보) - 3
         //    BLOOD(혈압정보) - 4
         //    TEMP(체온정보) - 5
         //    OXYGEN(혈중산소포화도 정보) - 6
         
         */
        
        
        
        
    }
    return self;
}

- (BOOL) saveSbDevice :(NSString *) dId :(NSString *) dName :(NSDate *) firstSync :(NSDate *) lastSync {
    
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat:@"UPDATE SbDevice SET dLastConn = %@ WHERE dId != %@", [self boolToQuery:NO], [self stringToQuery:dId]];
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return NO;
    }
    
    NSMutableDictionary *dic = [self selectSbDevice:dId];
    
    if (dic == nil) {
        qry = [NSString stringWithFormat:@"INSERT INTO SbDevice VALUES (%@,%@,%@, %@,%@)", [self stringToQuery:dId], [self stringToQuery:dName], [self dateToQuery:firstSync], [self dateToQuery:lastSync], [self boolToQuery:YES]];
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        if (err != nil) {
            return NO;
        }
        
    } else {
        
        // 디바이스 이름 업데이트
        qry = [NSString stringWithFormat:@"UPDATE SbDevice SET dName = %@, dLastConn = %@ WHERE dId = %@", [self stringToQuery:dName], [self boolToQuery:YES], [self stringToQuery:dId]];
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        if (err != nil) {
            return NO;
        }
        
        // 최후 sync 시간 업데이트
        if (lastSync != nil) {
            qry = [NSString stringWithFormat:@"UPDATE SbDevice SET dLastSync = %@ WHERE dId = %@ AND (dLastSync < %@ OR dLastSync IS NULL)", [self dateToQuery:lastSync], [self stringToQuery:dId], [self dateToQuery:lastSync]];
            [self.mngr executeQuery:qry error:&err];
            [self log:qry :err];
            
            if (err != nil) {
                return NO;
            }
        }
        
        // 최초 sync 시간 업데이트
        if (firstSync != nil) {
            qry = [NSString stringWithFormat:@"UPDATE SbDevice SET dFirstSync = %@ WHERE dId = %@ AND (dFirstSync > %@ OR dFirstSync IS NULL)", [self dateToQuery:firstSync], [self stringToQuery:dId], [self dateToQuery:firstSync]];
            [self.mngr executeQuery:qry error:&err];
            [self log:qry :err];
            
            if (err != nil) {
                return NO;
            }
        }
    }
    
    return YES;
}

- (BOOL) disconnectSbDevice {
    
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat:@"UPDATE SbDevice SET dLastConn = %@", [self boolToQuery:NO]];
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return NO;
    }
    
    return YES;
}

- (NSMutableDictionary *) selectSbDevice :(NSString *) dId {
    
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat: @"SELECT * FROM SbDevice WHERE dId = %@", [self stringToQuery:dId]];
    MRecordSet *rs = [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return nil;
    }
    
    while ([rs moveNext]) {
        NSMutableDictionary *md = [NSMutableDictionary dictionaryWithDictionary:[rs data]];
        return md;
    }
    
    return nil;
}

- (NSString *) lastConnectedIdentifier {
    
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = @"SELECT * FROM SbDevice WHERE dLastConn = 1";
    MRecordSet *rs = [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return nil;
    }
    
    while ([rs moveNext]) {
        NSMutableDictionary *md = [NSMutableDictionary dictionaryWithDictionary:[rs data]];
        return (NSString *) md[@"dId"];
    }
    
    return @"";
}

- (void) saveSynchronized :(int) index :(NSString *) identifier :(NSString *) date :(NSString *) date1 :(NSString *) time1 :(NSString *) date2 :(NSString *) time2 :(NSString *) v1 :(NSString *) v2 :(NSString *) v3 :(NSString *) v4 :(NSString *) v5 :(BOOL) overwrite {
    
    if (overwrite) {
    
        if ([self isExistsSynchronized:index :identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5]) {
            
            NSLog(@"DATA IS EXISTS");
            return;
        }
        
        [self deleteSynchronized:index :identifier :date1 :time1];
        
        NSString *qry = nil;
        NSError *err = nil;
        
        qry = [NSString stringWithFormat: @"INSERT INTO %@ VALUES(%@,%@,%@,%@,%@,%@,%@,%@,%@,%@,%@,0)", [self getTableName:index], [self stringToQuery:identifier], [self stringToQuery:date], [self stringToQuery:date1], [self stringToQuery:time1], [self stringToQuery:date2], [self stringToQuery:time2], [self stringToQuery:v1], [self stringToQuery:v2], [self stringToQuery:v3], [self stringToQuery:v4], [self stringToQuery:v5]];
        [self.mngr executeQuery:qry error:&err];
        [self log:qry :err];
        
        if (err != nil) {
            return;
        }
    } else {
        
        NSMutableDictionary *dic = [self selectSynchronized:index :identifier :date1 :time1];
        
        if (dic == nil) {
            
            NSString *qry = nil;
            NSError *err = nil;
            
            qry = [NSString stringWithFormat: @"INSERT INTO %@ VALUES(%@,%@,%@,%@,%@,%@,%@,%@,%@,%@,%@,0)", [self getTableName:index], [self stringToQuery:identifier], [self stringToQuery:date], [self stringToQuery:date1], [self stringToQuery:time1], [self stringToQuery:date2], [self stringToQuery:time2], [self stringToQuery:v1], [self stringToQuery:v2], [self stringToQuery:v3], [self stringToQuery:v4], [self stringToQuery:v5]];
            [self.mngr executeQuery:qry error:&err];
            [self log:qry :err];
            
            if (err != nil) {
                return;
            }
        }
    }
}

// 똑 같은 데이터가 존재하는지 여부, 똑 같은 데이터가 있으면, 삭제 입력 하지 않음
- (BOOL) isExistsSynchronized :(int) index :(NSString *) identifier :(NSString *) date :(NSString *) date1 :(NSString *) time1 :(NSString *) date2 :(NSString *) time2 :(NSString *) v1 :(NSString *) v2 :(NSString *) v3 :(NSString *) v4 :(NSString *) v5 {
    
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat: @"SELECT * FROM %@ WHERE sDeviceId = %@ AND sDate1 = %@ AND sTime1 = %@ AND sDate = %@ AND sDate2 = %@ AND sTime2 = %@ AND sV1 = %@ AND sV2 = %@ AND sV3 = %@ AND sV4 = %@ AND sV5 = %@", [self getTableName:index], [self stringToQuery:identifier], [self stringToQuery:date1], [self stringToQuery:time1], [self stringToQuery:date], [self stringToQuery:date2], [self stringToQuery:time2], [self stringToQuery:v1], [self stringToQuery:v2], [self stringToQuery:v3], [self stringToQuery:v4], [self stringToQuery:v5]];
    MRecordSet *rs = [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return NO;
    }
    
    while ([rs moveNext]) {
        return YES;
    }
    
    return NO;
}

- (NSMutableDictionary *) selectSynchronized :(int) index :(NSString *) identifier :(NSString *) date1 :(NSString *) time1 {
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat: @"SELECT * FROM %@ WHERE sDeviceId = %@ AND sDate1 = %@ AND sTime1 = %@", [self getTableName:index], [self stringToQuery:identifier], [self stringToQuery:date1], [self stringToQuery:time1]];
    MRecordSet *rs = [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return nil;
    }
    
    while ([rs moveNext]) {
        NSMutableDictionary *md = [NSMutableDictionary dictionaryWithDictionary:[rs data]];
        return md;
    }
    
    return nil;
}

- (NSMutableArray *) querySynchronized :(int) index :(NSString *) identifier :(NSString *) date {
    NSString *qry = nil;
    NSError *err = nil;
    
    if (index == 4 || index == 6)
        qry = [NSString stringWithFormat: @"SELECT * FROM %@ WHERE sDate = %@ ORDER BY sDate1, sTime1", [self getTableName:index], [self stringToQuery:date]];
    else
        qry = [NSString stringWithFormat: @"SELECT * FROM %@ WHERE sDeviceId = %@ AND sDate = %@ ORDER BY sDate1, sTime1", [self getTableName:index], [self stringToQuery:identifier], [self stringToQuery:date]];
    MRecordSet *rs = [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return nil;
    }
    
    NSMutableArray *arr = [NSMutableArray array];
    while ([rs moveNext]) {
        [arr addObject: [NSMutableDictionary dictionaryWithDictionary:[rs data]]];
    }
    
    return arr;
}

- (void) deleteSynchronized :(int) index :(NSString *) identifier :(NSString *) date1 :(NSString *) time1 {
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat: @"DELETE FROM %@ WHERE sDeviceId = %@ AND sDate1 = %@ AND sTime1 = %@", [self getTableName:index], [self stringToQuery:identifier], [self stringToQuery:date1], [self stringToQuery:time1]];
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return;
    }
}

// 큐리 로그 기록
- (void) log: (NSString *) qry :(NSError *) err {
    NSLog(@"qry : %@", qry);
    if (err) NSLog(@"err : %@", err.localizedDescription);
}

// 데이터 형 변환
- (NSString *) stringToQuery: (NSObject *) obj {
    
    if (obj == nil) return @"null";
    if ([obj isEqual:[NSNull null]]) return @"null";
    if ([obj isKindOfClass:[NSString class]]) {
        NSString *str = (NSString *) obj;
        return [NSString stringWithFormat:@"'%@'", [str replaceAll:@"'" replace:@"''"]];
    }
    return @"null";
}

- (NSString *) boolToQuery: (BOOL) b {
    return b ? @"1" : @"0";
}

- (NSString *) dateToQuery: (NSDate *) d {
    
    if (d == nil) return @"null";
    return [NSString stringWithFormat:@"%d", (int) [d timeIntervalSince1970]];
}

- (NSString *) getTableName :(int) index {
    if (index == 1) return @"SbSyncStep";
    if (index == 2) return @"SbSyncSleep";
    if (index == 3) return @"SbSyncHRM";
    if (index == 4) return @"SbSyncBP";
    if (index == 5) return @"SbSyncTemperature";
    if (index == 6) return @"SbSyncOxygen";
    return @"";
}

- (NSMutableArray *) queryServerSync :(int) index {
    
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat: @"UPDATE %@ SET sSyncServer = 2 WHERE sSyncServer != 1", [self getTableName:index]];
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return nil;
    }
    
    qry = nil;
    err = nil;
    
    qry = [NSString stringWithFormat: @"SELECT * FROM  %@ WHERE sSyncServer == 2", [self getTableName:index]];
    
    MRecordSet *rs = [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return nil;
    }
    
    NSMutableArray *arr = [NSMutableArray array];
    while ([rs moveNext]) {
        [arr addObject: [NSMutableDictionary dictionaryWithDictionary:[rs data]]];
    }
    
    return arr;
}

- (void) saveServerSyncFinish :(int) index {
    NSString *qry = nil;
    NSError *err = nil;
    
    qry = [NSString stringWithFormat: @"UPDATE %@ SET sSyncServer = 1 WHERE sSyncServer == 2", [self getTableName:index]];
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    if (err != nil) {
        return;
    }
}

- (void) clearDB {
    NSString *qry = nil;
    NSError *err = nil;
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbDevice";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbSyncStep";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbSyncSleep";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbSyncHRM";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbSyncBP";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbSyncTemperature";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
    
    // 디바이스 관련 테이블 만듬
    qry = @"DELETE FROM SbSyncOxygen";
    err = nil;
    [self.mngr executeQuery:qry error:&err];
    [self log:qry :err];
}
@end
