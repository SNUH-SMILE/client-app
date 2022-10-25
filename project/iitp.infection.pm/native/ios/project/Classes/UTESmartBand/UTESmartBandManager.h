//
//  UTESmartBandManager.h
//  iitp.infection.pm
//
//  Created by 유라클 on 2021/11/29.
//

#import <Foundation/Foundation.h>

@interface UTESmartBandManager : NSObject

SHARED_h

// 밴드 스캔 콜백함수 명
@property (retain, nonatomic) NSString *scanCbk;
// 밴드 스캔 스키마
@property (retain, nonatomic) NSString *scanSch;
// 디바이스 연결 콜백함수 명
@property (retain, nonatomic) NSString *connectCbk;
// 디바이스 연결 스키마
@property (retain, nonatomic) NSString *connectSch;
// 디바이스 연결 리셋타입
@property (retain, nonatomic) NSString *connectTyp;
// 데이터 변경이 된 경우
@property (retain, nonatomic) NSString *bpCbk;
@property (retain, nonatomic) NSString *hrm24Cbk;
@property (retain, nonatomic) NSString *hrmCbk;
@property (retain, nonatomic) NSString *spo2Cbk;
@property (retain, nonatomic) NSString *btCbk;
@property (retain, nonatomic) NSString *stepCbk;

// 전체 동기화 콜백
@property (retain, nonatomic) NSString *syncAllCbk;
// 동기화 콜백
@property (retain, nonatomic) NSString *syncCbk;
// -2 : 단순 동기화
// -1 : 연결시
// 0  : 메인데이터 조회
// 동기화 타입 : STEP(걸음정보) - 1, SLEEP(수면정보) - 2, RATE(심박정보) - 3, BLOOD(혈압정보) - 4, TEMP(체온정보) - 5, OXYGEN(혈중산소포화도 정보) - 6
@property (assign, nonatomic) int syncType;


@property (nonatomic, assign) BOOL isBloodPresureTest;
@property (nonatomic, assign) BOOL isSp02Test;

- (void) startScanDevices;
- (void) connectDevice :(NSString *) identifier;
- (void) syncAll;
- (void) sync :(NSDate *) date :(int) type;
- (BOOL) isDeviceConnected;
- (BOOL) onClickUTEOption :(NSInteger)option;
- (void) disconnectDevice;
- (void) stopScanDevices;
- (void) readBodyTemperatureCurrent;
- (void) lastDeviceId: (NSString *) callback;
//- (void) resetDevice;

- (void) serverSyncData :(NSString *) callback;
- (void) serverSyncDataFinish;
- (void) test;

@end

