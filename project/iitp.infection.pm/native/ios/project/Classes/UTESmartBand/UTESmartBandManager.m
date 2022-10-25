//
//  UTESmartBandManager.m
//  iitp.infection.pm
//
//  Created by 유라클 on 2021/11/29.
//

#import "UTESmartBandManager.h"
#import <UTESmartBandApi/UTESmartBandApi.h>
#import "PPHybridViewController.h"
#import "UTESmartBandDbManager.h"

@interface UTESmartBandManager () <UTEManagerDelegate>

@property (nonatomic, retain) UTESmartBandClient *smartBandMgr;
@property (nonatomic, retain) NSMutableArray *arrayDevices;
@property (nonatomic, retain) NSMutableArray *arrayConnectedDevices;
@property (nonatomic, assign) UTEBluetoothState bluetoothState;
@property (nonatomic, assign) BOOL isInSync;
@property (nonatomic, assign) BOOL isInSyncAll;
@property (nonatomic, assign) int indexSyncAll;
@property (nonatomic, retain) NSDate *dateSyncFrom;
@property (nonatomic, retain) NSDate *dateSyncLast;
@property (nonatomic, retain) NSDate *dateSelected;
@property (nonatomic, assign) BOOL autoConnectWhenDisconnected;
@property (nonatomic, assign) BOOL resetDeviceInConnect;
// @property (nonatomic, assign) UTEModelDevices *connectDevice;
@property (nonatomic, retain) UTESmartBandDbManager *db;
@end

@implementation UTESmartBandManager

SHARED_m(UTESmartBandManager)
SHARED_init

// 싱클톤 init
- (instancetype)initPrivate {
    self = [super init];
    if (self) {
        
        // bluetooth 상태 초기화 , unknown
        self.bluetoothState = UTEBluetoothStateUnknown;
        
        // 객체 생성
        self.smartBandMgr = [UTESmartBandClient sharedInstance];
    
        // delegate 설정
        self.smartBandMgr.delegate = self;
        
        // 초기화
        [self.smartBandMgr initUTESmartBandClient];
    
        // 로그 출력 여부
        self.smartBandMgr.debugUTELog = YES;
        
        // 중북 스캔 하여야, 디비이스 신호 세기를 실시간으로 받아올수 있음
        self.smartBandMgr.isScanRepeat = YES;
        
        // 신호 세기 필터
        self.smartBandMgr.filerRSSI = -99;
        
        // 서비스 필터
        /// [self.smartBandMgr setFilerServers:@[@"5533"]];
        /// [self.smartBandMgr setFilerServers:@[@"5533"]];
        [self.smartBandMgr setFilerServers:@[@"5533",@"2222",@"FEE7"]];
        
        // sdk version 로그
        NSLog(@"sdk vsersion : %@",self.smartBandMgr.sdkVersion);
        
        // 디비이스 array 초기화
        self.arrayDevices = [NSMutableArray array];
        
        // 연결된 디바이스 array 초기화
        self.arrayConnectedDevices = [NSMutableArray array];
        
        // 동기화 중인 상태
        self.isInSync = NO;
        
        // 전체 동기화 중인 상태
        self.isInSyncAll = NO;
        
        // 전체 동기화 순번
        self.indexSyncAll = 0;
        
        // 실시간 콜백 함수명 확정
        self.hrm24Cbk = @"onChangeRate";
        self.btCbk = @"onChangeTemp";
        self.stepCbk = @"onChangeStep";
        
        self.autoConnectWhenDisconnected = YES;
        self.resetDeviceInConnect = NO;
        
        self.syncType = 1000;
        
        self.db = [UTESmartBandDbManager shared];
       
    }
    
    return self;
}

- (void) startScanDevices {
    if (self.bluetoothState == UTEBluetoothStateOpen) {
        // 디비이스 스캔 시작
        [self.arrayDevices removeAllObjects];
        [self.smartBandMgr startScanDevices];
    } else {
        
        //if (self.resetDeviceInConnect == NO) {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview scanResult :self.scanCbk :self.scanSch :@"0101" :@"BLUETOOTH STATE ERROR" :nil];
            });
        //}
    }
}

- (void) connectDevice :(NSString *) identifier {
    
    if (self.bluetoothState == UTEBluetoothStateOpen) {
        
        if ([self isDeviceConnected]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.connectCbk :@"0302" :@"HAS CONNECTTED DEVICE"];
            });
        } else {
            UTEModelDevices *selected = nil;
            
            for (UTEModelDevices *model in self.arrayDevices) {
                if ([model.identifier isEqualToString:identifier]) {
                    selected = model;
                    break;
                }
            }
            
            if (selected != nil) {
                
                // 자동연결 설정
                self.autoConnectWhenDisconnected = YES;
                // 스캔시작
                [self.smartBandMgr startScanDevices];
                // 디바이스 연결
                [self.smartBandMgr connectUTEModelDevices:selected];
                
                
                // 인디케이터
                dispatch_async(dispatch_get_main_queue(), ^{
                    PPHybridViewController *webview = WEBVIEW;
                    [webview showIndicator];
                });
                
            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    PPHybridViewController *webview = WEBVIEW;
                    [webview connectResult :self.connectCbk :@"0301" :@"DEVICE NOT EXISTS"];
                });
            }
        }
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview connectResult :self.connectCbk :@"0101" :@"BLUETOOTH STATE ERROR"];
        });
    }
}

- (void) disconnectDevice {
    
    // 다비이스 연결 끊기
    // BlueTooth 가 사용가능하지 않은 상태면, 연결 끊지 못함
    if (self.bluetoothState == UTEBluetoothStateOpen) {
        if ([self isDeviceConnected]) {
            self.autoConnectWhenDisconnected = NO;
            
            [_db disconnectSbDevice];
            [self.smartBandMgr disConnectUTEModelDevices:self.smartBandMgr.connectedDevicesModel];
            
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.connectCbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
            });
        }
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview connectResult :self.connectCbk :@"0101" :@"BLUETOOTH STATE ERROR"];
        });
    }
}

- (void) stopScanDevices {
    if (self.bluetoothState == UTEBluetoothStateOpen) {
        [self.smartBandMgr stopScanDevices];
        // [self.arrayDevices removeAllObjects];
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview connectResult :self.connectCbk :@"0101" :@"BLUETOOTH STATE ERROR"];
        });
    }
}

- (void) readBodyTemperatureCurrent {
    if (self.bluetoothState == UTEBluetoothStateOpen) {
        if ([self isDeviceConnected]) {
            [self.smartBandMgr readBodyTemperatureCurrent];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.btCbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
            });
        }
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview connectResult :self.btCbk :@"0101" :@"BLUETOOTH STATE ERROR"];
        });
    }
}

- (void) lastDeviceId: (NSString *) callback {
    NSString *last = [_db lastConnectedIdentifier];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        PPHybridViewController *webview = WEBVIEW;
        [webview callCbfunction:callback withObjects:last, nil];
    });
}

//- (void) resetDevice {
//    
//    if (self.bluetoothState == UTEBluetoothStateOpen) {
//        if ([self isDeviceConnected]) {
//            [self onClickUTEOption:UTEOptionDeleteDevicesAllData];
//        } else {
//            dispatch_async(dispatch_get_main_queue(), ^{
//                PPHybridViewController *webview = WEBVIEW;
//                [webview connectResult :self.connectCbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
//            });
//        }
//    } else {
//        dispatch_async(dispatch_get_main_queue(), ^{
//            PPHybridViewController *webview = WEBVIEW;
//            [webview connectResult :self.connectCbk :@"0101" :@"BLUETOOTH STATE ERROR"];
//        });
//    }
//}

- (void) serverSyncData :(NSString *) callback {
    
    NSArray *arr1 = [_db queryServerSync:1];
    NSArray *arr2 = [_db queryServerSync:2];
    NSArray *arr3 = [_db queryServerSync:3];
    NSArray *arr4 = [_db queryServerSync:4];
    NSArray *arr5 = [_db queryServerSync:5];
    NSArray *arr6 = [_db queryServerSync:6];
    
    NSMutableDictionary *res = [NSMutableDictionary dictionary];
    res[@"code"] = @"0000";
    res[@"message"] = @"SUCCESS";
    
    {
        NSMutableArray *todayStepCountList = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr1) {
            [todayStepCountList addObject:[self dtdWithId1: d1]];
        }
        
        res[@"todayStepCountList"] = todayStepCountList;
    
    }
   
    {
        NSMutableArray *todaySleepTimeList = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr2) {
            [todaySleepTimeList addObject:[self dtdWithId2: d1]];
        }
        
        res[@"todaySleepTimeList"] = todaySleepTimeList;
    }
    
    {
        NSMutableArray *todayHrList = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr3) {
            [todayHrList addObject:[self dtdWithId3: d1]];
        }
        
        res[@"todayHrList"] = todayHrList;
    
    }
    
    {
        NSMutableArray *todayBpList = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr4) {
            [todayBpList addObject:[self dtdWithId4: d1]];
        }
        
        res[@"todayBpList"] = todayBpList;
    
    }
    
    {
        NSMutableArray *todayBtList = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr5) {
            [todayBtList addObject:[self dtdWithId5:d1]];
        }
        
        res[@"todayBtList"] = todayBtList;
    
    }
    
    {
        NSMutableArray *todaySpO2List = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr6) {
            [todaySpO2List addObject:[self dtdWithId6:d1]];
        }
        
        res[@"todaySpO2List"] = todaySpO2List;
    
    }
    
    
    dispatch_async(dispatch_get_main_queue(), ^{
        PPHybridViewController *webview = WEBVIEW;
        [webview syncResult :callback :res];
    });
}

- (void) serverSyncDataFinish {
    [_db saveServerSyncFinish:1];
    [_db saveServerSyncFinish:2];
    [_db saveServerSyncFinish:3];
    [_db saveServerSyncFinish:4];
    [_db saveServerSyncFinish:5];
    [_db saveServerSyncFinish:6];
}

- (void) test {
    NSString *identify = @"98AC8C9E-1A3E-4460-F243-4C4AF5A5998E";
    
    UTEModelDevices *d = [[UTEModelDevices alloc] init];
    d.identifier = identify;
    
    // 자동연결 설정
    self.autoConnectWhenDisconnected = YES;
    
    self.connectTyp = @"2";
    
    [self.smartBandMgr connectUTEModelDevices:d];
}

#pragma mark - UTEManagerDelegate
- (void)uteManagerDiscoverDevices:(UTEModelDevices *)modelDevices {
    
    NSLog(@"**** - (void)uteManagerDiscoverDevices:(UTEModelDevices *)modelDevices");
    
    BOOL sameDevices = NO;
    for (UTEModelDevices *model in self.arrayDevices) {
        if ([model.identifier isEqualToString:modelDevices.identifier]) {
            model.rssi = modelDevices.rssi;
            model.name = modelDevices.name;
            sameDevices = YES;
            break;
        }
    }
    
    if (!sameDevices) {
        NSLog(@"**** scanned new device name=%@ id=%@",modelDevices.name,modelDevices.identifier);
        [self.arrayDevices addObject:modelDevices];
    }
    
    //if (self.resetDeviceInConnect == NO) {
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview scanResult :self.scanCbk :self.scanSch :@"0000" :@"SUCCESS" :self.arrayDevices];
        });
    //}
}

- (void)uteManagerDevicesSate:(UTEDevicesSate)devicesState error:(NSError *)error userInfo:(NSDictionary *)info {
    NSLog(@"**** - (void)uteManagerDevicesSate:(UTEDevicesSate)devicesState error:(NSError *)error userInfo:(NSDictionary *)info");
    NSLog(@"device state : %d", (int) devicesState);
    NSLog(@"error : %@", error.description);
    NSLog(@"info : %@", info);
    
    switch (devicesState) {
        case UTEDevicesSateConnected: {
            //CN:每次连上应该设置一下配置，保证App和设备的信息统一
            //EN:You should set up the configuration every time you connect to ensure that the App and device information is unified
            [self setupConfiguration];
            break;
        }
        case UTEDevicesSateDisconnected: {
            
            //if (error) {
            //    NSLog(@"***Device disconnected abnormally=%@",error);
            //}else {
            //    NSLog(@"***Device disconnected normally connectedDevicesModel=%@",self.smartBandMgr.connectedDevicesModel);
            //}
            
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.connectCbk :@"0104" :@"DEVICE DISCONNECTED"];
            });
            
            if (self.autoConnectWhenDisconnected) {
                // 스캔시작
                // [self.smartBandMgr startScanDevices];
                // 디바이스 연결
                
                UTEModelDevices *d = [[UTEModelDevices alloc] init];
                d.identifier = [_db lastConnectedIdentifier];
                
                [self.smartBandMgr connectUTEModelDevices:d];
            }
            
            // 처음 로그인시 디바이스 리셋 되는 경우가 아니면
            if (self.resetDeviceInConnect != YES) {
                
                dispatch_async(dispatch_get_main_queue(), ^{
                    PPHybridViewController *webview = WEBVIEW;
                    [webview.view makeToast:@"디바이스 연결이 해제되었습니다."];
                });
            }
            
            break;
        }
        case UTEDevicesSateSyncBegin: {
            NSLog(@"***Device synchronization starts");
            break;
        }
        case UTEDevicesSateSyncSuccess: {
            [self syncSucess:info];
            break;
        }
        case UTEDevicesSateSyncError: {
            
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                
                NSString *cbk = nil;
                if (self.syncType == -1) cbk = self.connectCbk;
                else if (self.syncType == 0) cbk = self.syncAllCbk;
                else if (self.syncType > 0) cbk = self.syncCbk;
                
                [webview connectResult :cbk :@"0401" :@"SYNC FAIL"];
            });
            
            break;
        }
        case UTEDevicesSateCheckFirmwareError: {
            break;
        }
        case UTEDevicesSateUpdateHaveNewVersion: {
//            if (self.connectVc.isMustUpdate) {
//                [self.smartBandMgr beginUpdateFirmware];
//            }
            break;
        }
        case UTEDevicesSateUpdateNoNewVersion: {
            break;
        }
        case UTEDevicesSateUpdateBegin: {
            break;
        }
        case UTEDevicesSateUpdateSuccess: {
            break;
        }
        case UTEDevicesSateUpdateError: {
            break;
        }
        case UTEDevicesSateHeartDetectingProcess:{
//            UTEModelHRMData *model = info[kUTEQueryHRMData];
//            if (model.heartType == UTEHRMTypeSuccess ||
//                model.heartType == UTEHRMTypeFail ||
//                model.heartType == UTEHRMTypeTimeout) {
//                NSLog(@"***Heart rate test completed");
//                if (model.heartType == UTEHRMTypeSuccess) {
//                    NSLog(@"***The final test heart rate result is the next log");
//                }
//            }
//            [self heartDetectingData:model];
            break;
        }
        case UTEDevicesSateBloodDetectingProcess:{
//            UTEModelBloodData *model = info[kUTEQueryBloodData];
//            if (model.bloodType == UTEBloodTypeNormal ||
//                model.bloodType == UTEBloodTypeTimeout ||
//                model.bloodType == UTEBloodTypeFail) {
//                NSLog(@"***Blood pressure test completed");
//                if (model.bloodType == UTEBloodTypeSuccess) {
//                    NSLog(@"***The final blood pressure test result is the next log");
//                }
//            }
//            [self bloodDetectingData:model];
            
            if (self.isBloodPresureTest == YES)
            {
                UTEModelBloodData *model = info[kUTEQueryBloodData]; // 4 kUTEQueryBloodData
                NSString *time1 = model.bloodTime;
                NSString *time2 = @"";
                NSString *v1 = model.bloodSystolic;
                NSString *v2 = model.bloodDiastolic;
                NSString *v3 = [NSString stringWithFormat:@"%d", (int) model.bloodType];
                NSString *v4 = @"";
                NSString *v5 = @"";
                NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
                
                time1 = [time1 replaceAll:@"-" replace:@""];
                if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                NSString *date1 = [time1 substringToIndex:8];
                time1 = [time1 substringFromIndex:8];
                
                NSString *date2 = @"";
                if (time2.length > 0) {
                    time2 = [time2 replaceAll:@"-" replace:@""];
                    if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                    date2 = [time2 substringToIndex:8];
                    time2 = [time2 substringFromIndex:8];
                }
                
                // 혈압추가
                [_db saveSynchronized:4 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
                
                NSDateFormatter *f = [[NSDateFormatter alloc] init];
                f.dateFormat = @"yyyyMMdd";
                NSString *dateString = [f stringFromDate:[NSDate now]];
                
                NSMutableDictionary *res = [NSMutableDictionary dictionary];
                res[@"code"] = @"0000";
                res[@"message"] = @"SUCCESS";
                
                // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
                NSString *identifier = [self.db lastConnectedIdentifier];
                
                NSMutableArray *arr4 = [_db querySynchronized:4 :identifier :dateString];
                NSMutableArray *todayBpList = [NSMutableArray array];
                
                for (NSDictionary *d1 in arr4) {
                    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                    
                    d2[@"resultDate"] = d1[@"sDate1"];
                    d2[@"resultTime"] = d1[@"sTime1"];
                    
                    d2[@"dbp"] = d1[@"sV2"];
                    d2[@"sbp"] = d1[@"sV1"];
                    
                    [todayBpList addObject:d2];
                }
                
                res[@"bpList"] = todayBpList;
                
                //dispatch_async(dispatch_get_main_queue(), ^{
                //    PPHybridViewController *webview = WEBVIEW;
                //    [webview receiveDataResult :self.bpCbk :res];
                //});
            } else {
                //dispatch_async(dispatch_get_main_queue(), ^{
                //    PPHybridViewController *webview = WEBVIEW;
                //    [webview receiveDataResult :self.bpCbk :@{@"code":@"0062", @"message":@"BLOOD PRESURE STOP"}];
                //});
            }
            
            break;
        }
        case UTEDevicesSateHeartDetectingStart: {
            NSLog(@"***UTEOptionHeartDetectingStart -> Heart rate test started");
            break;
        }
        case UTEDevicesSateHeartDetectingStop: {
            NSLog(@"***UTEOptionHeartDetectingStop -> Heart rate test stopped");
            break;
        }
        case UTEDevicesSateHeartDetectingError: {
            NSLog(@"***The device disconnected during the heart rate test");
            //dispatch_async(dispatch_get_main_queue(), ^{
            //    PPHybridViewController *webview = WEBVIEW;
            //    [webview receiveDataResult :self.bpCbk :@{@"code":@"0601", @"message":@"BLOOD PRESURE ERROR"}];
            //});
            
            break;
        }
        case UTEDevicesSateBloodDetectingStart: {
            NSLog(@"***Blood pressure test started");
            
            //dispatch_async(dispatch_get_main_queue(), ^{
            //    PPHybridViewController *webview = WEBVIEW;
            //    [webview receiveDataResult :self.bpCbk :@{@"code":@"0061", @"message":@"BLOOD PRESURE START"}];
            //});
            
            self.isBloodPresureTest = YES;
            
            break;
        }
        case UTEDevicesSateBloodDetectingStop: {
            NSLog(@"***Blood pressure test stopped");
            break;
        }
        case UTEDevicesSateBloodDetectingError: {
            NSLog(@"***The device was disconnected during the blood pressure test");
            break;
        }
        case UTEDevicesSateStep: {
            NSLog(@"***Step status");
            break;
        }
        case UTEDevicesSateSleep: {
            NSLog(@"***Sleep state");
            break;
        }
        case UTEDevicesSatePasswordState:
        {
//            NSString *value = info[kUTEPasswordState];
//            switch (value.integerValue) {
//                case UTEPasswordStateError:
//                {
//                    if (_passwordType == UTEPasswordTypeConnect) {
//                        //Wrong password for connection
//                        [self showPassAlertView:@"连接的密码错误，请重新输入"];
//                    }else if (_passwordType == UTEPasswordTypeConfirm){
//                        //The verified password is wrong
//                        [self showPassAlertView:@"验证的密码错误，请重新输入"];
//                    }
//
//                    break;
//                }
//                case UTEPasswordStateCorrect:
//                {
//                    if (_passwordType == UTEPasswordTypeConfirm) {
//                        _passwordType = UTEPasswordTypeReset;
//                        //Password verification is successful, please enter a new password
//                        [self showPassAlertView:@"密码验证成功，请输入新的密码"];
//                    }else if (_passwordType == UTEPasswordTypeReset){
//                        NSLog(@"***The password is reset successfully, please remember the password");
//                    }else{
//                        NSLog(@"***The password is entered correctly and the bracelet starts to connect");
//                    }
//
//                    break;
//                }
//
//                case UTEPasswordStateNeed:
//                {
//                    _passwordType = UTEPasswordTypeConnect;
//                    //To connect the bracelet, please enter the password
//                    [self showPassAlertView:@"要连接手环，请输入密码"];
//                    break;
//                }
//                case UTEPasswordStateNew:
//                {
//                    _passwordType = UTEPasswordTypeConnect;
//                    //New bracelet, please enter a new password
//                    [self showPassAlertView:@"新的手环，请输入新的密码"];
//                    break;
//                }
//
//            }
        }
  
        case UTEDevicesSateBloodOxygenDetectingStart: {
            
            //dispatch_async(dispatch_get_main_queue(), ^{
            //    PPHybridViewController *webview = WEBVIEW;
            //    [webview receiveDataResult :self.spo2Cbk :@{@"code":@"0063", @"message":@"OXYGEN START"}];
            //});
            
            self.isSp02Test = YES;
            
            break;
        }
        case UTEDevicesSateBloodOxygenDetectingProcess: {
            
            UTEModelBloodOxygenData *model = ((NSArray *) info[kUTEQueryBloodOxygenData]).count > 0 ? [((NSArray *) info[kUTEQueryBloodOxygenData]) firstObject] : nil;
            
            if (model != nil) {
                NSString *time1 = model.time;
                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                NSString *date1 = [time1 substringToIndex:10];
                date1 = [date1 replaceAll:@"-" replace:@""];
                
                time1 = [time1 substringFromIndex:10];
                time1 = [time1 replaceAll:@"-" replace:@""];
                time1 = [time1 rightPadding:@"0" length:6];
                
                d2[@"resultDate"] = date1;
                d2[@"resultTime"] = time1;
                d2[@"spO2"] = [NSString stringWithFormat:@"%d", (int) model.value];
                
                
                //dispatch_async(dispatch_get_main_queue(), ^{
                //    PPHybridViewController *webview = WEBVIEW;
                //    [webview receiveDataResult :self.spo2Cbk :@{@"code":@"0065", @"message":@"OXYGEN PROCESS", @"spO2":d2}];
                //});
            
            }
            break;
        }
        case UTEDevicesSateBloodOxygenDetectingStop: {
            
            if (self.isSp02Test == YES) {
                UTEModelBloodOxygenData *model = ((NSArray *) info[kUTEQueryBloodOxygenData]).count > 0 ? [((NSArray *) info[kUTEQueryBloodOxygenData]) firstObject] : nil; // 4 kUTEQueryBloodData
                
                if (model != nil) {
                    NSString *time1 = model.time;
                    NSString *time2 = @"";
                    NSString *v1 = [NSString stringWithFormat:@"%d", (int) model.value];
                    NSString *v2 = @"";
                    NSString *v3 = @"";
                    NSString *v4 = @"";
                    NSString *v5 = @"";
                    NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
                    
                    time1 = [time1 replaceAll:@"-" replace:@""];
                    if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                    NSString *date1 = [time1 substringToIndex:8];
                    time1 = [time1 substringFromIndex:8];
                    
                    NSString *date2 = @"";
                    if (time2.length > 0) {
                        time2 = [time2 replaceAll:@"-" replace:@""];
                        if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                        date2 = [time2 substringToIndex:8];
                        time2 = [time2 substringFromIndex:8];
                    }
                    
                    // 혈중산소농도
                    [_db saveSynchronized:6 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
                    
                    NSDateFormatter *f = [[NSDateFormatter alloc] init];
                    f.dateFormat = @"yyyyMMdd";
                    NSString *dateString = [f stringFromDate:[NSDate now]];
                    
                    NSMutableDictionary *res = [NSMutableDictionary dictionary];
                    res[@"code"] = @"0000";
                    res[@"message"] = @"SUCCESS";
                    
                    // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
                    NSString *identifier = [self.db lastConnectedIdentifier];
                    
                    NSMutableArray *arr6 = [_db querySynchronized:6 :identifier :dateString];
                    NSMutableArray *todaySpO2List = [NSMutableArray array];
                    
                    for (NSDictionary *d1 in arr6) {
                        NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                        
                        d2[@"resultDate"] = d1[@"sDate1"];
                        d2[@"resultTime"] = d1[@"sTime1"];
                        
                        d2[@"spO2"] = d1[@"sV1"];
                        
                        [todaySpO2List addObject:d2];
                    }
                    
                    res[@"spO2List"] = todaySpO2List;

                    //dispatch_async(dispatch_get_main_queue(), ^{
                    //    PPHybridViewController *webview = WEBVIEW;
                    //    [webview receiveDataResult :self.spo2Cbk :res];
                    //});
                }
            } else {
                //dispatch_async(dispatch_get_main_queue(), ^{
                //    PPHybridViewController *webview = WEBVIEW;
                //    [webview receiveDataResult :self.spo2Cbk :@{@"code":@"0064", @"message":@"OXYGEN STOP"}];
                //});
            }
            break;
        }
        case UTEDevicesSateBloodOxygenDetectingError: {
            
            //dispatch_async(dispatch_get_main_queue(), ^{
            //    PPHybridViewController *webview = WEBVIEW;
            //    [webview receiveDataResult :self.spo2Cbk :@{@"code":@"0602", @"message":@"OXYGEN ERROR"}];
            //});
            
            break;
        }
        
        case UTEDevicesSateBodyTempCurrent:
        case UTEDevicesSateBodyTempNormal: {
            
            NSArray *array = info[kUTEQueryBodyTemperature];
            
            if (array.count > 0) {
                NSObject *obj = [array objectAtIndex:0];
                if ([obj isKindOfClass:[UTEModelBodyTemperature class]]) {
                    
                    UTEModelBodyTemperature *model = (UTEModelBodyTemperature *) obj;
                    
                    NSString *time1 = model.time;
                    NSString *time2 = @"";
                    NSString *v1 = model.bodyTemperature;
                    NSString *v2 = model.shellTemperature;
                    NSString *v3 = model.ambientTemperature;
                    NSString *v4 = @"";
                    NSString *v5 = @"";
                    NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
                    
                    time1 = [time1 replaceAll:@"-" replace:@""];
                    if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                    NSString *date1 = [time1 substringToIndex:8];
                    time1 = [time1 substringFromIndex:8];
                    
                    NSString *date2 = @"";
                    if (time2.length > 0) {
                        time2 = [time2 replaceAll:@"-" replace:@""];
                        if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                        date2 = [time2 substringToIndex:8];
                        time2 = [time2 substringFromIndex:8];
                    }
                    
                    // 체온저장
                    [_db saveSynchronized:5 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
                    
                    /*
                    NSDateFormatter *f = [[NSDateFormatter alloc] init];
                    f.dateFormat = @"yyyyMMdd";
                    NSString *dateString = [f stringFromDate:[NSDate now]];
                    
                    NSMutableDictionary *res = [NSMutableDictionary dictionary];
                    res[@"code"] = @"0000";
                    res[@"message"] = @"SUCCESS";
                    
                    // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
                    NSString *identifier = [self.db lastConnectedIdentifier];
                    
                    NSMutableArray *arr5 = [_db querySynchronized:5 :identifier :dateString];
                    NSMutableArray *todayBtList = [NSMutableArray array];
                    
                    for (NSDictionary *d1 in arr5) {
                        NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                        
                        d2[@"resultDate"] = d1[@"sTime1"];
                        d2[@"resultTime"] = d1[@"sDate1"];
                        
                        d2[@"bt"] = d1[@"sV1"];
                        
                        [todayBtList addObject:d2];
                    }
                    
                    res[@"btList"] = todayBtList;
                    */
                    
                    NSString *res = [NSString stringWithFormat:@"%@", model.bodyTemperature];
                    
                    dispatch_async(dispatch_get_main_queue(), ^{
                        PPHybridViewController *webview = WEBVIEW;
                        [webview tempResult :self.btCbk :res];
                    });
                }
            }
            
            break;
        }
        default: {
            break;
        }
    }
}

- (void)uteManagerBluetoothState:(UTEBluetoothState)bluetoothState {
    NSLog(@"**** uteManagerBluetoothState:(UTEBluetoothState)bluetoothState");
    NSLog(@"bluetooth state : %d", (int) bluetoothState);
    
    // 현재 블루투스 상태 저장
    self.bluetoothState = bluetoothState;
    
    // 자동으로 연결
    if (self.bluetoothState == UTEBluetoothStateOpen) {
        
        NSString *identify = [self.db lastConnectedIdentifier];
        
        if (identify != nil && ![identify isEqualToString:@""]) {
            UTEModelDevices *d = [[UTEModelDevices alloc] init];
            d.identifier = identify;
            
            // 자동연결 설정
            self.autoConnectWhenDisconnected = YES;
            // 디바이스 연결 타입 (동기화만 진행)
            self.connectTyp = @"2";
            // 
            [self.smartBandMgr connectUTEModelDevices:d];
        }
    }
    
    // 불루투스 상태가 닫기면
    if (self.bluetoothState == UTEBluetoothStateClose) {
        
    }
}

- (void)uteManagerExtraIsAble:(BOOL)isAble {
    NSLog(@"**** - (void)uteManagerExtraIsAble:(BOOL)isAble");
    NSLog(@"is able : %d", (int) isAble);
}

- (void)uteManagerReceiveTodaySteps:(UTEModelRunData *)runData {
    NSLog(@"**** - (void)uteManagerReceiveTodaySteps:(UTEModelRunData *)runData");
    NSLog(@"run date : %@", runData);
}

- (void)uteManagerReceiveTodaySport:(NSDictionary *)dict {
    NSLog(@"**** - (void)uteManagerReceiveTodaySport:(NSDictionary *)dict");
    NSLog(@"dict : %@", dict);
    
    UTEModelSportWalkRun *model = dict[kUTEQuerySportWalkRunData];
    
    NSLog(@"time = %@", model.time);
    NSLog(@"steps = %d", (int) model.stepsTotal);
    NSLog(@"distances = %f", model.walkDistances + model.runDistances);
    NSLog(@"calories = %f", model.walkCalories + model.runCalories);
    
    // 디비에 저장하고, 콜백하기
    
    NSString *time1 = model.time;
    NSString *time2 = @"";
    NSString *v1 = [NSString stringWithFormat:@"%d", (int) model.stepsTotal];
    NSString *v2 = [NSString stringWithFormat:@"%f", model.walkDistances + model.runDistances];
    NSString *v3 = [NSString stringWithFormat:@"%f", model.walkCalories + model.runCalories];
    NSString *v4 = @"";
    NSString *v5 = @"";
    NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];

    time1 = [time1 replaceAll:@"-" replace:@""];
    if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
    NSString *date1 = [time1 substringToIndex:8];
    time1 = [time1 substringFromIndex:8];
    
    NSString *date2 = @"";
    if (time2.length > 0) {
        time2 = [time2 replaceAll:@"-" replace:@""];
        if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        date2 = [time2 substringToIndex:8];
        time2 = [time2 substringFromIndex:8];
    }
    
    // 스탭 관련
    [_db saveSynchronized:1 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
    
    /*
    NSDateFormatter *f = [[NSDateFormatter alloc] init];
    f.dateFormat = @"yyyyMMdd";
    NSString *dateString = [f stringFromDate:[NSDate now]];
    
    NSMutableDictionary *res = [NSMutableDictionary dictionary];
    res[@"code"] = @"0000";
    res[@"message"] = @"SUCCESS";
    
    // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
    NSString *identifier = [self.db lastConnectedIdentifier];
    
    NSMutableArray *arr1 = [_db querySynchronized:1 :identifier :dateString];
    NSMutableArray *todayStepCountList = [NSMutableArray array];
    
    for (NSDictionary *d1 in arr1) {
        NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
        
        d2[@"resultDate"] = d1[@"sTime1"];
        d2[@"resultTime"] = d1[@"sDate1"];
        
        d2[@"stepCount"] = d1[@"sV1"];
        d2[@"distance"] = d1[@"sV2"];
        
        [todayStepCountList addObject:d2];
    }
    
    res[@"stepCountList"] = todayStepCountList;
    */
    
    NSString *step = [NSString stringWithFormat:@"%d", (int) model.stepsTotal];
    NSString *distances = [NSString stringWithFormat:@"%f", model.walkDistances + model.runDistances];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        PPHybridViewController *webview = WEBVIEW;
        [webview stepResult :self.stepCbk :step :distances];
    });
}

- (void)uteManagerReceiveSportMode:(UTEDeviceSportModeInfo *)info {
    NSLog(@"**** - (void)uteManagerReceiveSportMode:(UTEDeviceSportModeInfo *)info");
    NSLog(@"info : %@", info);
}

- (void)uteManagerReceiveSportHRM:(NSDictionary *)dict {
    NSLog(@"**** - (void)uteManagerReceiveSportHRM:(NSDictionary *)dict");
    NSLog(@"dict : %@", dict);
}

- (void)uteManagerReceiveHRMMaxValue:(NSInteger)max minValue:(NSInteger)min averageValue:(NSInteger)average {
    NSLog(@"**** - (void)uteManagerReceiveHRMMaxValue:(NSInteger)max minValue:(NSInteger)min averageValue:(NSInteger)average");
    NSLog(@"max : %d", (int) max);
    NSLog(@"min : %d", (int) min);
    NSLog(@"average : %d", (int) average);
    

    dispatch_async(dispatch_get_main_queue(), ^{
        PPHybridViewController *webview = WEBVIEW;
        [webview hrm24Result:self.hrm24Cbk :[NSString stringWithFormat:@"%d", (int)average]];
    });
    
}

- (void)uteManagerSyncProcess:(NSInteger)process {
    NSLog(@"**** - (void)uteManagerSyncProcess:(NSInteger)process");
    NSLog(@"process : %d", (int) process);
}

- (void)uteManagerUpdateProcess:(NSInteger)process {
    NSLog(@"**** - (void)uteManagerUpdateProcess:(NSInteger)process");
    NSLog(@"process : %d", (int) process);
}

- (void)uteManagerTakePicture {
    NSLog(@"**** - (void)uteManagerTakePicture");
}

- (void)uteManagerDisplaySizeWidth:(NSInteger)width height:(NSInteger)height count:(NSInteger)count {
    NSLog(@"**** - (void)uteManagerDisplaySizeWidth:(NSInteger)width height:(NSInteger)height count:(NSInteger)count");
    NSLog(@"width : %d", (int) width);
    NSLog(@"height : %d", (int) height);
    NSLog(@"count : %d", (int) count);
}

- (void)uteManagerUTEIbeaconOption:(UTEIbeaconOption)option value:(NSString *)value {
    NSLog(@"**** - (void)uteManagerUTEIbeaconOption:(UTEIbeaconOption)option value:(NSString *)value");
    NSLog(@"option : %d", (int) option);
    NSLog(@"value : %@",  value);
}

- (void)uteManageUTEOptionCallBack:(UTECallBack)callback {
    NSLog(@"**** - (void)uteManageUTEOptionCallBack:(UTECallBack)callback");
    NSLog(@"callback : %d",  (int) callback);
}

- (void)uteManageTouchDeviceReceiveData:(NSData *)data {
    NSLog(@"**** - (void)uteManageTouchDeviceReceiveData:(NSData *)data");
    NSLog(@"data : %@",  data);
}

- (void)uteManagerSendCustomDataResult:(BOOL)result {
    NSLog(@"**** - (void)uteManagerSendCustomDataResult:(BOOL)result");
    NSLog(@"result : %d",  (int) result);
}

- (void)uteManagerReceiveCustomData:(NSData *)data result:(BOOL)result {
    NSLog(@"**** - (void)uteManagerReceiveCustomData:(NSData *)data result:(BOOL)result");
    NSLog(@"data : %@",  data);
    NSLog(@"result : %d",  (int) result);
}

- (void)uteManagerHeadsetSport:(UTEDeviceSportMode)mode open:(BOOL)open suppport:(BOOL)support {
    NSLog(@"**** - (void)uteManagerHeadsetSport:(UTEDeviceSportMode)mode open:(BOOL)open suppport:(BOOL)support");
    NSLog(@"mode : %d",  (int) mode);
    NSLog(@"open : %d",  (int) open);
    NSLog(@"support : %d",  (int) support);
}

- (void)uteManagerShortcutBtnSupport:(UTEDeviceShortcutBtnType)type {
    NSLog(@"**** - (void)uteManagerShortcutBtnSupport:(UTEDeviceShortcutBtnType)type");
    NSLog(@"type : %d",  (int) type);
}

- (void)uteManagerShortcutBtnStatus:(UTEDeviceShortcutBtnType)openType closeType:(UTEDeviceShortcutBtnType)closeType {
    NSLog(@"**** - (void)uteManagerShortcutBtnStatus:(UTEDeviceShortcutBtnType)openType closeType:(UTEDeviceShortcutBtnType)closeType");
    NSLog(@"openType : %d",  (int) openType);
    NSLog(@"closeType : %d",  (int) closeType);
}

- (void)uteManagerReceiveTenMinLaterHRM:(NSDictionary *)dict {
    NSLog(@"**** - (void)uteManagerReceiveTenMinLaterHRM:(NSDictionary *)dict");
    NSLog(@"dict : %@",  dict);
    
    UTEModelHRMData *model = dict[@"kUTEQueryHRMData"];
    if (model.heartType == UTEHRMTypeNormal) {
        NSString *time1 = model.heartTime;
        NSString *time2 = @"";
        NSString *v1 = model.heartCount;
        NSString *v2 = [NSString stringWithFormat:@"%d", (int) model.heartType];
        NSString *v3 = @"";
        NSString *v4 = @"";
        NSString *v5 = @"";
        NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
        
        time1 = [time1 replaceAll:@"-" replace:@""];
        if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        NSString *date1 = [time1 substringToIndex:8];
        time1 = [time1 substringFromIndex:8];
        
        NSString *date2 = @"";
        if (time2.length > 0) {
            time2 = [time2 replaceAll:@"-" replace:@""];
            if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            date2 = [time2 substringToIndex:8];
            time2 = [time2 substringFromIndex:8];
        }
        
        // 24시간 심박수
        [_db saveSynchronized:3 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :NO];

        /*
        NSDateFormatter *f = [[NSDateFormatter alloc] init];
        f.dateFormat = @"yyyyMMdd";
        NSString *dateString = [f stringFromDate:[NSDate now]];
        
        NSMutableDictionary *res = [NSMutableDictionary dictionary];
        res[@"code"] = @"0000";
        res[@"message"] = @"SUCCESS";
        
        // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
        NSString *identifier = [self.db lastConnectedIdentifier];
        
        NSMutableArray *arr3 = [_db querySynchronized:3 :identifier :dateString];
        NSMutableArray *todayHrList = [NSMutableArray array];
        
        for (NSDictionary *d1 in arr3) {
            NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
            
            d2[@"resultDate"] = d1[@"sTime1"];
            d2[@"resultTime"] = d1[@"sDate1"];
            
            d2[@"hr"] = d1[@"sV1"];
            
            [todayHrList addObject:d2];
        }
        
        res[@"hrList"] = todayHrList;
        */
        
        NSString *res = [NSString stringWithFormat:@"%@", model.heartCount];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview hrm24Result:self.hrm24Cbk :res];
        });
    }
}

- (void)uteManagerReceiveDebugInfo:(NSDictionary *)dict {
    NSLog(@"**** - (void)uteManagerReceiveDebugInfo:(NSDictionary *)dict");
    NSLog(@"dict : %@",  dict);
}

- (void)uteManagerANCSAuthorization:(BOOL)ancsAuthorized {
    NSLog(@"**** - (void)uteManagerANCSAuthorization:(BOOL)ancsAuthorized");
    NSLog(@"ancsAuthorized : %d",  (int) ancsAuthorized);
}

- (void)uteManagerUserIDStatus:(UTEUserIDStatus)status {
    NSLog(@"**** - (void)uteManagerUserIDStatus:(UTEUserIDStatus)status");
    NSLog(@"status : %d",  (int) status);
}

- (void)uteManagerFactoryTestButtonCallback:(NSInteger)totalButton currentBtnIndex:(NSInteger)index {
    NSLog(@"**** - (void)uteManagerFactoryTestButtonCallback:(NSInteger)totalButton currentBtnIndex:(NSInteger)index");
    NSLog(@"totalButton : %d",  (int) totalButton);
    NSLog(@"index : %d",  (int) index);
}

- (void)uteManagerFactoryTestTpCallback:(NSInteger)position {
    NSLog(@"**** - (void)uteManagerFactoryTestTpCallback:(NSInteger)position");
    NSLog(@"position : %d",  (int) position);
}

- (void)uteManagerFactoryTestRGBCallback:(BOOL)open {
    NSLog(@"**** - (void)uteManagerFactoryTestRGBCallback:(BOOL)open");
    NSLog(@"open : %d",  (int) open);
}

- (void)uteManagerFactoryTestLogData:(NSData *)data strData:(NSString *)strData tag:(NSInteger)tag {
    NSLog(@"**** - (void)uteManagerFactoryTestRGBCallback:(BOOL)open");
    NSLog(@"data : %@", data);
    NSLog(@"strData : %@", strData);
    NSLog(@"tag : %d", (int) tag);
}


#pragma mark -
- (void)setupConfiguration
{
    //CN:关闭扫描
    //EN:Turn off scan
    [self.smartBandMgr stopScanDevices];
    
    if (self.resetDeviceInConnect == NO) {
        if ([self.connectTyp isEqualToString:@"0"] || [self.connectTyp isEqualToString:@"1"]) {
            self.resetDeviceInConnect = YES;
            [self onClickUTEOption:UTEOptionDeleteDevicesAllData];
            return;
        }
    } else {
        if ([self.connectTyp isEqualToString:@"0"]) {
            [_db clearDB];
        }
        
        self.resetDeviceInConnect = NO;
        
        // 디바이스 연결이 끊어진 경우 대비
        self.connectTyp = @"2";
    }
    
    // 인디케이터
   // dispatch_async(dispatch_get_main_queue(), ^{
   //     PPHybridViewController *webview = WEBVIEW;
   //     [webview showIndicator];
   //  });
    
    //CN:设置设备时间
    //EN:Set device time
    [self.smartBandMgr setUTEOption:UTEOptionSyncTime];
    
    //CN:设置设备单位:公尺或者英寸
    //EN:Set device unit: meters or inches
//    [self.smartBandMgr setUTEOption:UTEOptionUnitInch];
    [self.smartBandMgr setUTEOption:UTEOptionUnitMeter];
    
    //CN:设置设备中身高、体重
    //EN:Set the height and weight of the device
    UTEModelDeviceInfo *infoModel = [[UTEModelDeviceInfo alloc] init];
    infoModel.heigh = 170;
    infoModel.weight = 60;
    infoModel.age = 18;
    infoModel.sex = UTEDeviceInfoSexFemale;
    infoModel.lightTime = 6;
    infoModel.sportTarget = 8000;
    infoModel.handlight = 0;

    [self.smartBandMgr setUTEInfoModel:infoModel];
    
    [self.smartBandMgr setUTEOption:UTEOptionHeartSwitchDynamic];
    
    [self.smartBandMgr setUTEOption:UTEOptionReadBaseStatus];
    //CN:设置久坐提醒
    //EN:Set a sedentary reminder
    [self.smartBandMgr setUTESitRemindOpenTime:30];
    
    //CN:设置设备其他特性
    //EN:Set other features of the device
    [self.smartBandMgr sendUTEAllTimeSilence:UTESilenceTypeNone exceptStartTime:@"03:00" endTime:@"04:00" except:NO];
    
    //CN:设置其他配置，防止手环被其他手机连接了，配置与现App不一致
    //EN:Set other configurations to prevent the bracelet from being connected by other phones, and the configuration is inconsistent with the current App
    
    // 연결시 동기화 상태 표시
    // self.isInSyncConnect = YES;
    self.isInSync = NO;
    self.isInSyncAll = NO;
    
    //
    [self.smartBandMgr setUTELanguageSwitchDirectly:UTEDeviceLanguageKorean];
    
    UTEModelDevices *connectDevices = self.smartBandMgr.connectedDevicesModel;
    
    // 연결된후 0.3 초 이후 동기화 시작
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        [_db saveSbDevice:connectDevices.identifier :connectDevices.name :nil :nil];
        
        //if ([self.connectTyp isEqualToString:@"2"]) {
            [self sync :[NSDate now] :-1];
        
        //}
        
        //if ([self.connectTyp isEqualToString:@"0"] || [self.connectTyp isEqualToString:@"1"]) {
        //    self.resetDeviceInConnect = YES;
        //    [self onClickUTEOption:UTEOptionDeleteDevicesAllData];
        //}
    });
    
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//        //CN:延迟一会儿，因为刚连接上，设备还在读取信息中
//        //EN:Delay for a while, because the device is still reading the information just after connecting
//        NSLog(@"***Device version=%@ Power=%ld rssi=%ld，address=%@",connectDevices.version,(long)connectDevices.battery, (long)connectDevices.rssi,connectDevices.address);
//    });

}

- (BOOL) isDeviceConnected {
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        return NO;
    }
    
    return YES;
}

// 전체 동기화
- (void) syncAll {
    [self sync :[NSDate now] :0];
}

// 동기화 시작
- (void) sync :(NSDate *) date :(int) type {
    if (self.isInSync) {
        // 연결된후 0.3 초이후에 결과 반환
        
        // 동기화 중이면서, 메인동기화 요청이 들어온 경우 이미 동기화 중이라고 정보를 내려준다.
        if (type == -2) {
            
        } else if (type <= 0) {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                
                NSString *cbk = nil;
                if (type == -1) cbk = self.connectCbk;
                else if (type == 0) cbk = self.syncAllCbk;
                else if (type > 0) cbk = self.syncCbk;
                
                [webview connectResult :cbk :@"0102" :@"IN SYNC"];
            });
        } else {
            [self syncTypeFinish: type];
        }
        
        return;
    }
    
    if (type == -2) {
        if ([_getGlobalValue(@"NATIVE_SHOW_PROGRESS") isEqualToString:@"Y"]) {
            PPHybridViewController *webview = WEBVIEW;
            [webview showIndicator];
        }
    }
    
    // 최종연결된 디바이스가 있고, 현재 디바이스가 연결되지 않은 경우, 디비로 부터 읽어온다.
    
    BOOL canSync = YES;
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        canSync = NO;
    }
    
    // 테이블에 있는 데이터를 비교
    
    NSString *identifier = self.smartBandMgr.connectedDevicesModel.identifier;
    NSMutableDictionary *dic = [_db selectSbDevice :identifier];
    
    int f = [dic[@"dFirstSync"] intValue];
    int l = [dic[@"dLastSync"] intValue];
    
    NSDate *fD = f == 0 ? nil : [NSDate dateWithTimeIntervalSince1970:f];
    NSDate *lD = l == 0 ? nil : [NSDate dateWithTimeIntervalSince1970:l];
    
    BOOL canReadDB = NO;
    
    // first sync date, last sync date
    // 만약 최초 sync 시간이 없으면, date - 1년을 하여 데이터 동기화 한다.
    // 만약 최초, 최후 sync 시간이 있고, date 가 그 사이에 있으면, 디비에서 조회
    // 만약 date 가 최초 sync 시간보다 빠르면, date - 1년을 해서, 동기화 한다.
    // 만약 date 가 최후 sync 시간보다 늦으면, 최후 sync 시간으로 동기화 한다.
    
    if (fD == nil) {
        NSDateComponents *dateComponents = [[NSDateComponents alloc] init];
        [dateComponents setYear :-1];
        NSCalendar *calendar = [NSCalendar currentCalendar];
        fD = [calendar dateByAddingComponents:dateComponents toDate:date options:0];
    } else {
        if ([date timeIntervalSinceDate: fD] >= 0 && [date timeIntervalSinceDate:lD] <= 0) {
            fD = date;
            canReadDB = YES;
        }
        else if ([date timeIntervalSinceDate:lD] > 0)
            fD = lD;
        else if ([date timeIntervalSinceDate: fD] < 0) {
            NSDateComponents *dateComponents = [[NSDateComponents alloc] init];
            [dateComponents setYear :-1];
            NSCalendar *calendar = [NSCalendar currentCalendar];
            fD = [calendar dateByAddingComponents:dateComponents toDate:date options:0];
        }
    }
    
    self.dateSelected = date;
    self.syncType = type;
    
    NSDateFormatter *fo = [[NSDateFormatter alloc] init];
    fo.dateFormat = @"yyyyMMdd";
    NSDate *today = [fo dateFromString:[fo stringFromDate:[NSDate now]]];
    
    if (self.syncType != -2 && (((canReadDB && type <= 0) /* 처음 연길시 혹은 메인 동기화*/ || (canReadDB && type > 0 && ![fD isEqualToDate:today]) /* 개별 조회 그리고, 오늘이 아닌 경우 */) || canSync == NO /* 디바이스가 연결 안된 경우 */)) {
        [self syncTypeAllFinish];
    } else {
        // 동기화 전 데이터를 1회 내려준다, 단 디바이스 연결시 이벤트에서 내려주지 않는다
        if (self.syncType != -2)
            [self syncTypeAllFinish:NO];
        
        // 동기화 관련 설정
        self.dateSyncFrom = fD;
        self.indexSyncAll = 0;
        self.isInSync = YES;
        self.isInSyncAll = YES;
        self.dateSyncLast = nil;
        
        // 동기화
        [self syncTypeAllNext];
    }
}

- (void) syncTypeAllNext {
    
    if (self.syncType <= 0)
    self.indexSyncAll ++;
    
    if (self.indexSyncAll == 1 || self.syncType == 1) {
        [self syncType1 :self.dateSyncFrom];
    } else if (self.indexSyncAll == 2 || self.syncType == 2) {
        [self syncType2 :self.dateSyncFrom];
    } else if (self.indexSyncAll == 3 || self.syncType == 3) {
        [self syncType3 :self.dateSyncFrom];
    } else if (self.indexSyncAll == 4 || self.syncType == 4) {
        [self syncType4 :self.dateSyncFrom];
    } else if (self.indexSyncAll == 5 || self.syncType == 5) {
        [self syncType5 :self.dateSyncFrom];
    } else if (self.indexSyncAll == 6 || self.syncType == 6) {
        [self syncType6 :self.dateSyncFrom];
    } else if (self.indexSyncAll == 7) {
        [self syncTypeAllFinish];
    }
}

// 동기화 완료시
- (void) syncTypeAllFinish {
    [self syncTypeAllFinish:YES];
}

// 디바이스연결 메인조회 정보별조회 콜백
- (void) syncTypeAllFinish :(BOOL) isFinish {
    
    if (isFinish) {
        self.isInSync = NO;
        self.isInSyncAll = NO;
    }
    
    // 연결시 동기화, 메인 동기화 시에만, 디바이스 정보를 업데이트 한다.
    if (self.syncType <= 0)
        [_db saveSbDevice:self.smartBandMgr.connectedDevicesModel.identifier :self.smartBandMgr.connectedDevicesModel.name :self.dateSyncFrom :self.dateSyncLast];
    
    if (self.syncType == -2 && isFinish) {
        dispatch_async(dispatch_get_main_queue(), ^{
            
            self.syncType = 1000;
            
            PPHybridViewController *webview = WEBVIEW;
            [webview hiddenIndicator];
        });
    }
    
    if (self.syncType == -1 && isFinish) {
        // 디바이스 연결시에는 동기화 전에 데이터를 call back 하지 않는다.
        dispatch_async(dispatch_get_main_queue(), ^{
            
            self.syncType = 1000;
            
            PPHybridViewController *webview = WEBVIEW;
            [webview connectResult :self.connectCbk :@"0000" :@"SUCCESS"];
            
            [webview hiddenIndicator];
            
            [webview.view makeToast:@"디바이스가 연결되었습니다."];
        });
    }
    
    if (self.syncType == 0) {
        // 전체 동기화
        NSDateFormatter *f = [[NSDateFormatter alloc] init];
        f.dateFormat = @"yyyyMMdd";
        NSString *dateString = [f stringFromDate: self.dateSelected];
        
        // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
        NSString *identifier = [self.db lastConnectedIdentifier];
        
        NSMutableArray *arr1 = [_db querySynchronized:1 :identifier :dateString];
        NSMutableArray *arr2 = [_db querySynchronized:2 :identifier :dateString];
        NSMutableArray *arr3 = [_db querySynchronized:3 :identifier :dateString];
        NSMutableArray *arr4 = [_db querySynchronized:4 :identifier :dateString];
        NSMutableArray *arr5 = [_db querySynchronized:5 :identifier :dateString];
        NSMutableArray *arr6 = [_db querySynchronized:6 :identifier :dateString];
        
        NSMutableDictionary *res = [NSMutableDictionary dictionary];
        res[@"code"] = @"0000";
        res[@"message"] = @"SUCCESS";
        
        {
            // 1
            
            NSMutableArray *todayStepCountList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr1) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"stepCount"] = d1[@"sV1"];
//                d2[@"distance"] = d1[@"sV2"];
                
                [todayStepCountList addObject:[self dtd1: d1]];
            }
            
            res[@"todayStepCountList"] = todayStepCountList;
        
        }
       
        {
//            // 2
//            int sleepTime = 0;
//
//            NSMutableArray *todaySleepTimeList = [NSMutableArray array];
//
//            for (NSDictionary *d1 in arr2) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                NSDateFormatter *f = [[NSDateFormatter alloc] init];
//                f.dateFormat = @"yyyyMMddHHmm";
//                NSDate *date1 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate1"], d1[@"sTime1"]]];
//                NSDate *date2 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate2"], d1[@"sTime2"]]];
//
//                sleepTime += (int) [date2 timeIntervalSinceDate:date1];
//
////                d2[@"sleepStartTime"] = d1[@"sTime1"];
////                d2[@"sleepEndTime"] = d1[@"sTime2"];
////                d2[@"sleepType"] = d1[@"sV1"];
//
//                [todaySleepTimeList addObject:[self dtd2: d1]];
//            }
//
//            NSMutableString *sleepTimeString = [NSMutableString string];
//
//            if (sleepTime >= 3600 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", sleepTime / 3600]];
//            else if (sleepTime >= 3600 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", sleepTime / 3600]];
//            else [sleepTimeString appendString:@"00"];
//
//            int m = sleepTime % 3600;
//
//            if (m >= 60 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", m / 60]];
//            else if (m >= 60 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", m / 60]];
//            else [sleepTimeString appendString:@"00"];
//
//            int s = m % 60;
//
//            if (s >= 10 ) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", s]];
//            else [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", s]];
//
//            res[@"todaySleepTimeList"] = todaySleepTimeList;
//            res[@"todayTotalSleepTime"] = sleepTimeString;
            
            [res addEntriesFromDictionary:[self dtd2sum: arr2]];
        }
        
        {
            // 3
            
            NSMutableArray *todayHrList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr3) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"hr"] = d1[@"sV1"];
                
                [todayHrList addObject:[self dtd3: d1]];
            }
            
            res[@"todayHrList"] = todayHrList;
        
        }
        
        {
            // 4
            
            NSMutableArray *todayBpList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr4) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"dbp"] = d1[@"sV2"];
//                d2[@"sbp"] = d1[@"sV1"];
                
                [todayBpList addObject:[self dtd4: d1]];
            }
            
            res[@"todayBpList"] = todayBpList;
        
        }
        
        {
            // 5
            
            NSMutableArray *todayBtList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr5) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"bt"] = d1[@"sV1"];
                
                [todayBtList addObject:[self dtd5:d1]];
            }
            
            res[@"todayBtList"] = todayBtList;
        
        }
        
        {
            // 6
            
            NSMutableArray *todaySpO2List = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr6) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"spO2"] = d1[@"sV1"];
                
                [todaySpO2List addObject:[self dtd6:d1]];
            }
            
            res[@"todaySpO2List"] = todaySpO2List;
        
        }
        
        
        dispatch_async(dispatch_get_main_queue(), ^{
            
            if (isFinish)
                self.syncType = 1000;
            
            PPHybridViewController *webview = WEBVIEW;
            [webview syncResult :self.syncAllCbk :res];
        });
    }
    
    if (self.syncType > 0 && self.syncType != 1000) {
        NSDateFormatter *f = [[NSDateFormatter alloc] init];
        f.dateFormat = @"yyyyMMdd";
        NSString *dateString = [f stringFromDate: self.dateSelected];
        
        // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
        NSString *identifier = [self.db lastConnectedIdentifier];
        
        NSMutableArray *arr1 = [_db querySynchronized:1 :identifier :dateString];
        NSMutableArray *arr2 = [_db querySynchronized:2 :identifier :dateString];
        NSMutableArray *arr3 = [_db querySynchronized:3 :identifier :dateString];
        NSMutableArray *arr4 = [_db querySynchronized:4 :identifier :dateString];
        NSMutableArray *arr5 = [_db querySynchronized:5 :identifier :dateString];
        NSMutableArray *arr6 = [_db querySynchronized:6 :identifier :dateString];
        
        NSMutableDictionary *res = [NSMutableDictionary dictionary];
        res[@"code"] = @"0000";
        res[@"message"] = @"SUCCESS";
        
        if (self.syncType == 1) {
            
            NSMutableArray *todayStepCountList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr1) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"stepCount"] = d1[@"sV1"];
//                d2[@"distance"] = d1[@"sV2"];
                
                [todayStepCountList addObject:[self dtd1:d1]];
            }
            
            res[@"stepCountList"] = todayStepCountList;
        }
       
        if (self.syncType == 2) {
            // 2
//            int sleepTime = 0;
//
//            if (arr2.count > 0) {
//                NSDictionary *df = [arr2 firstObject];
//                NSDictionary *dl = [arr2 lastObject];
//
//                res[@"resultStartDateTime"] = [NSString stringWithFormat:@"%@%@", df[@"sDate1"], df[@"sTime1"]];
//                res[@"resultEndDateTime"] = [NSString stringWithFormat:@"%@%@", dl[@"sDate1"], dl[@"sTime1"]];
//
//                NSMutableArray *todaySleepTimeList = [NSMutableArray array];
//
//                for (NSDictionary *d1 in arr2) {
//                    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                    NSDateFormatter *f = [[NSDateFormatter alloc] init];
//                    f.dateFormat = @"yyyyMMddHHmm";
//                    NSDate *date1 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate1"], d1[@"sTime1"]]];
//                    NSDate *date2 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate2"], d1[@"sTime2"]]];
//
//                    sleepTime += (int) [date2 timeIntervalSinceDate:date1];
//
//                    d2[@"sleepStartTime"] = d1[@"sTime1"];
//                    d2[@"sleepEndTime"] = d1[@"sTime2"];
//                    d2[@"sleepType"] = d1[@"sV1"];
//
//                    [todaySleepTimeList addObject:d2];
//                }
//
//                NSMutableString *sleepTimeString = [NSMutableString string];
//
//                if (sleepTime >= 3600 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", sleepTime / 3600]];
//                else if (sleepTime >= 3600 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", sleepTime / 3600]];
//                else [sleepTimeString appendString:@"00"];
//
//                int m = sleepTime % 3600;
//
//                if (m >= 60 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", m / 60]];
//                else if (m >= 60 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", m / 60]];
//                else [sleepTimeString appendString:@"00"];
//
//                int s = m % 60;
//
//                if (s >= 10 ) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", s]];
//                else [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", s]];
//
//                res[@"sleepTimeList"] = todaySleepTimeList;
//                res[@"todayTotalSleepTime"] = sleepTimeString;
//            }
            [res addEntriesFromDictionary:[self dtd2sum: arr2]];
        }
        
        if (self.syncType == 3) {
            // 3
            
            NSMutableArray *todayHrList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr3) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"hr"] = d1[@"sV1"];
                
                [todayHrList addObject:[self dtd3: d1]];
            }
            
            res[@"hrList"] = todayHrList;
        
        }
        
        if (self.syncType == 4) {
            // 4
            
            NSMutableArray *todayBpList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr4) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"dbp"] = d1[@"sV2"];
//                d2[@"sbp"] = d1[@"sV1"];
                
                [todayBpList addObject:[self dtd4: d1]];
            }
            
            res[@"bpList"] = todayBpList;
        
        }
        
        if (self.syncType == 5)  {
            // 5
            
            NSMutableArray *todayBtList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr5) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"bt"] = d1[@"sV1"];
                
                [todayBtList addObject:[self dtd5: d1]];
            }
            
            res[@"btList"] = todayBtList;
        
        }
        
        if (self.syncType == 6) {

            // 6
            NSMutableArray *todaySpO2List = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr6) {
//                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
//
//                d2[@"resultDate"] = d1[@"sTime1"];
//                d2[@"resultTime"] = d1[@"sDate1"];
//
//                d2[@"spO2"] = d1[@"sV1"];
                
                [todaySpO2List addObject:[self dtd6: d1]];
            }
            
            res[@"spO2List"] = todaySpO2List;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            
            if (isFinish)
                self.syncType = 1000;
            
            PPHybridViewController *webview = WEBVIEW;
            [webview syncResult :self.syncCbk :res];
        });
    }
}

// 이미 동기화 중인 상태에서, 정보별 데이터 요청이 들어오는 경우, 동기화 없이 해당 데이터만 내려준다.
- (void) syncTypeFinish:(int) type {
    
    //self.isInSync = NO;
    //self.isInSyncAll = NO;
    
    if (type > 0) {
        NSDateFormatter *f = [[NSDateFormatter alloc] init];
        f.dateFormat = @"yyyyMMdd";
        NSString *dateString = [f stringFromDate: self.dateSelected];
        
        // 데이터 조회시 최종 연결시 동기화 한 데이터를 조회한다.
        NSString *identifier = [self.db lastConnectedIdentifier];
        
        NSMutableArray *arr1 = [_db querySynchronized:1 :identifier :dateString];
        NSMutableArray *arr2 = [_db querySynchronized:2 :identifier :dateString];
        NSMutableArray *arr3 = [_db querySynchronized:3 :identifier :dateString];
        NSMutableArray *arr4 = [_db querySynchronized:4 :identifier :dateString];
        NSMutableArray *arr5 = [_db querySynchronized:5 :identifier :dateString];
        NSMutableArray *arr6 = [_db querySynchronized:6 :identifier :dateString];
        
        NSMutableDictionary *res = [NSMutableDictionary dictionary];
        res[@"code"] = @"0000";
        res[@"message"] = @"SUCCESS";
        
        if (type == 1) {
            
            NSMutableArray *todayStepCountList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr1) {
                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];

                d2[@"resultDate"] = d1[@"sDate1"];
                d2[@"resultTime"] = d1[@"sTime1"];
                
                d2[@"stepCount"] = d1[@"sV1"];
                d2[@"distance"] = d1[@"sV2"];
                
                [todayStepCountList addObject:d2];
            }
            
            res[@"stepCountList"] = todayStepCountList;
        }
       
        if (type == 2) {
            // 2
            int sleepTime = 0;
            
            if (arr2.count > 0) {
                NSDictionary *df = [arr2 firstObject];
                NSDictionary *dl = [arr2 lastObject];
                
                res[@"resultStartDateTime"] = [NSString stringWithFormat:@"%@%@", df[@"sDate1"], df[@"sTime1"]];
                res[@"resultEndDateTime"] = [NSString stringWithFormat:@"%@%@", dl[@"sDate1"], dl[@"sTime1"]];
                
                NSMutableArray *todaySleepTimeList = [NSMutableArray array];
                
                for (NSDictionary *d1 in arr2) {
                    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                    
                    NSDateFormatter *f = [[NSDateFormatter alloc] init];
                    f.dateFormat = @"yyyyMMddHHmm";
                    NSDate *date1 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate1"], d1[@"sTime1"]]];
                    NSDate *date2 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate2"], d1[@"sTime2"]]];
                    
                    sleepTime += (int) [date2 timeIntervalSinceDate:date1];
                    
                    d2[@"sleepStartDate"] = d1[@"sDate1"];
                    d2[@"sleepEndDate"] = d1[@"sDate2"];
                    d2[@"sleepStartTime"] = d1[@"sTime1"];
                    d2[@"sleepEndTime"] = d1[@"sTime2"];
                    d2[@"sleepType"] = d1[@"sV1"];
                    
                    [todaySleepTimeList addObject:d2];
                }
                
                NSMutableString *sleepTimeString = [NSMutableString string];
                
                if (sleepTime >= 3600 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", sleepTime / 3600]];
                else if (sleepTime >= 3600 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", sleepTime / 3600]];
                else [sleepTimeString appendString:@"00"];
                
                int m = sleepTime % 3600;
                
                if (m >= 60 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", m / 60]];
                else if (m >= 60 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", m / 60]];
                else [sleepTimeString appendString:@"00"];
                
                int s = m % 60;
                
                if (s >= 10 ) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", s]];
                else [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", s]];
                
                res[@"sleepTimeList"] = todaySleepTimeList;
                res[@"totalSleepTime"] = sleepTimeString;
            }
        }
        
        if (type == 3) {
            // 3
            
            NSMutableArray *todayHrList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr3) {
                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                
                d2[@"resultDate"] = d1[@"sDate1"];
                d2[@"resultTime"] = d1[@"sTime1"];
                
                d2[@"hr"] = d1[@"sV1"];
                
                [todayHrList addObject:d2];
            }
            
            res[@"hrList"] = todayHrList;
        
        }
        
        if (type == 4) {
            // 4
            
            NSMutableArray *todayBpList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr4) {
                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                
                d2[@"resultDate"] = d1[@"sDate1"];
                d2[@"resultTime"] = d1[@"sTime1"];
                
                d2[@"dbp"] = d1[@"sV2"];
                d2[@"sbp"] = d1[@"sV1"];
                
                [todayBpList addObject:d2];
            }
            
            res[@"bpList"] = todayBpList;
        
        }
        
        if (type == 5)  {
            // 5
            
            NSMutableArray *todayBtList = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr5) {
                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                
                d2[@"resultDate"] = d1[@"sDate1"];
                d2[@"resultTime"] = d1[@"sTime1"];
                
                d2[@"bt"] = d1[@"sV1"];
                
                [todayBtList addObject:d2];
            }
            
            res[@"btList"] = todayBtList;
        
        }
        
        if (type == 6) {
            // 6
            
            NSMutableArray *todaySpO2List = [NSMutableArray array];
            
            for (NSDictionary *d1 in arr6) {
                NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
                
                d2[@"resultDate"] = d1[@"sDate1"];
                d2[@"resultTime"] = d1[@"sTime1"];
                
                d2[@"spO2"] = d1[@"sV1"];
                
                [todaySpO2List addObject:d2];
            }
            
            res[@"spO2List"] = todaySpO2List;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            [webview syncResult :self.syncCbk :res];
        });
    }
}

- (void) syncType1 :(NSDate *) date {
    if (self.isInSync && self.isInSyncAll == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0102" :@"IN SYNC"];
        });
        
        return;
    }
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
        });
        
        return;
    }
    
    BOOL isOK;
    
    // 걸음수 동기화
    if (self.smartBandMgr.connectedDevicesModel.isHasDataStatus) {
        
        NSDateComponents *dateComponents = [[NSDateComponents alloc] init];
        [dateComponents setHour: -2];
        NSCalendar *calendar = [NSCalendar currentCalendar];
        NSDate *newDate = [calendar dateByAddingComponents:dateComponents toDate:self.dateSyncFrom options:0];
        
        isOK = [self onClickSyncDataCustom :UTEDeviceDataTypeSteps :newDate];
    } else {
        isOK = [self onClickUTEOption :UTEOptionSyncAllStepsData];
    }
    
    if (isOK == false) {
        if (self.syncType <= 0) {
            [self syncTypeAllNext];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.syncCbk :@"0105" :@"DEVICE NOT SUPPORT"];
            });
        }
    }
}

- (void) syncType2 :(NSDate *) date {
    if (self.isInSync && self.isInSyncAll == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0102" :@"IN SYNC"];
        });
        
        return;
    }
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
        });
        
        return;
    }
    
    BOOL isOK;
    
    // 수면
    if (self.smartBandMgr.connectedDevicesModel.isHasDataStatus) {
        
        NSDateComponents *dateComponents = [[NSDateComponents alloc] init];
        [dateComponents setHour: -12];
        NSCalendar *calendar = [NSCalendar currentCalendar];
        NSDate *newDate = [calendar dateByAddingComponents:dateComponents toDate:self.dateSyncFrom options:0];
        
        isOK = [self onClickSyncDataCustom :UTEDeviceDataTypeSleep :newDate];
    } else {
        isOK = [self onClickUTEOption :UTEOptionSyncAllSleepData];
    }
    
    if (isOK == false) {
        if (self.syncType <= 0) {
            [self syncTypeAllNext];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.syncCbk :@"0105" :@"DEVICE NOT SUPPORT"];
            });
        }
    }
}

- (void) syncType3 :(NSDate *) date {
    if (self.isInSync && self.isInSyncAll == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0102" :@"IN SYNC"];
        });
        
        return;
    }
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
        });
        
        return;
    }
    
    BOOL isOK;
    
    // 심박수
    if (self.smartBandMgr.connectedDevicesModel.isHasDataStatus) {
        isOK = [self onClickSyncDataCustom :UTEDeviceDataTypeHRM24 :self.dateSyncFrom];
    } else {
        isOK = [self onClickUTEOption :UTEOptionSyncAllHRMData];
    }
    
    if (isOK == false) {
        if (self.syncType <= 0) {
            [self syncTypeAllNext];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.syncCbk :@"0105" :@"DEVICE NOT SUPPORT"];
            });
        }
    }
}

- (void) syncType4 :(NSDate *) date {
    if (self.isInSync && self.isInSyncAll == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0102" :@"IN SYNC"];
        });
        
        return;
    }
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
        });
        
        return;
    }
    
    BOOL isOK;
    
    // 혈압
    if (self.smartBandMgr.connectedDevicesModel.isHasDataStatus) {
        isOK = [self onClickSyncDataCustom :UTEDeviceDataTypeBlood :self.dateSyncFrom];
    } else {
        isOK = [self onClickUTEOption:UTEOptionSyncAllBloodData];
    }
    
    if (isOK == false) {
        if (self.syncType <= 0) {
            [self syncTypeAllNext];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.syncCbk :@"0105" :@"DEVICE NOT SUPPORT"];
            });
        }
    }
}

- (void) syncType5 :(NSDate *) date {
    if (self.isInSync && self.isInSyncAll == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0102" :@"IN SYNC"];
        });
        
        return;
    }
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
        });
        
        return;
    }
    
    BOOL isOK;
    
    // 체온
    isOK = [self onClickSyncBodyTemperature :self.dateSyncFrom];
    
    if (isOK == false) {
        if (self.syncType <= 0) {
            [self syncTypeAllNext];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.syncCbk :@"0105" :@"DEVICE NOT SUPPORT"];
            });
        }
    }
}

- (void) syncType6 :(NSDate *) date {
    if (self.isInSync && self.isInSyncAll == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0102" :@"IN SYNC"];
        });
        
        return;
    }
    
    if (self.smartBandMgr.connectedDevicesModel == nil ||
        self.smartBandMgr.connectedDevicesModel.isConnected == NO) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            PPHybridViewController *webview = WEBVIEW;
            
            NSString *cbk = nil;
            if (self.syncType == -1) cbk = self.connectCbk;
            else if (self.syncType == 0) cbk = self.syncAllCbk;
            else if (self.syncType > 0) cbk = self.syncCbk;
            
            [webview connectResult :cbk :@"0103" :@"DEVICE IS NOT CONNECTED"];
        });
        
        return;
    }
    
    BOOL isOK;
    
    // 산소포화도 , 현재 지원하지 않음
    isOK = [self onClickUTEOption:UTEOptionSyncAllBloodOxygenData];
    
    if (isOK == false) {
        if (self.syncType <= 0) {
            [self syncTypeAllNext];
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                PPHybridViewController *webview = WEBVIEW;
                [webview connectResult :self.syncCbk :@"0105" :@"DEVICE NOT SUPPORT"];
            });
        }
    }
}

- (void) calcDateSyncLast :(NSString *) dateString {
    NSString *formatString = nil;
    
    if (dateString.length == 16) formatString = @"yyyy-MM-dd-HH-mm";
    if (dateString.length == 13) formatString = @"yyyy-MM-dd-HH";
    if (dateString.length == 10) formatString = @"yyyy-MM-dd";
    
    if (formatString != nil) {
        NSDateFormatter *f = [[NSDateFormatter alloc] init];
        f.dateFormat = formatString;
        
        @try {
            NSDate *newDate = [f dateFromString:dateString];
            
            if (self.dateSyncLast == nil) self.dateSyncLast = newDate;
            if ([newDate timeIntervalSinceDate:self.dateSyncLast] > 0) self.dateSyncLast = newDate;
        } @catch (NSException *exception) {
            
        } @finally {
            
        }
    }
}

#pragma mark - kUTESyncMethod
- (BOOL)onClickUTEOption :(NSInteger)option{
    
    NSLog(@"SyncMethod : onClickUTEOption - %d", (int) option);
    
    if ([self.smartBandMgr setUTEOption :option] == NO) {
        if (option == 44 || option == 45) {
            // 혈압측정을 지원하지 않는 경우
            //dispatch_async(dispatch_get_main_queue(), ^{
            //    PPHybridViewController *webview = WEBVIEW;
            //    [webview receiveDataResult :self.bpCbk :@{@"code":@"0105", @"message":@"DEVICE NOT SUPPORT"}];
            //});
        }
        
        if (option == 46 || option == 47) {
            // 산소포화도 지원하지 않는 경우
            //dispatch_async(dispatch_get_main_queue(), ^{
            //    PPHybridViewController *webview = WEBVIEW;
            //    [webview receiveDataResult :self.spo2Cbk :@{@"code":@"0105", @"message":@"DEVICE NOT SUPPORT"}];
            //});
        }
        
        return NO;
    } else {
        return YES;
    }
}

- (BOOL)onClickSyncDataCustom :(NSInteger)option :(NSDate *) date {
    
    NSDateFormatter *f = [[NSDateFormatter alloc] init];
    f.dateFormat = @"yyyy-MM-dd-HH-mm";
    NSString *dateString = [f stringFromDate:date];
    
    NSLog(@"SyncMethod : onClickSyncDataCustom - %d, %@", (int) option, date);
    
    return [self.smartBandMgr syncDataCustomTime :dateString type:option];
}

- (BOOL)onClickSyncUTESportModelCustom :(NSDate *) date{
    
    NSDateFormatter *f = [[NSDateFormatter alloc] init];
    f.dateFormat = @"yyyy-MM-dd-HH-mm";
    NSString *dateString = [f stringFromDate:date];
    
    return [self.smartBandMgr syncUTESportModelCustomTime :dateString];
}

- (BOOL)onClickSyncBodyTemperature :(NSDate *) date{

    NSDateFormatter *f = [[NSDateFormatter alloc] init];
    f.dateFormat = @"yyyy-MM-dd-HH-mm";
    NSString *dateString = [f stringFromDate:date];
    
    NSLog(@"SyncMethod : onClickSyncBodyTemperature - %@", date);
    
    return [self.smartBandMgr syncBodyTemperature :dateString];
}

- (void)syncSucess:(NSDictionary *)info
{
    NSLog(@"Synchronization complete");
    NSArray *arraySportWalkRun = info[kUTEQuerySportWalkRunData]; // 1
//    NSArray *arraySleep = info[kUTEQuerySleepData]; // 2
    NSArray *arraySleepDayByDay = info[kUTEQuerySleepDataDayByDay]; // 2
    NSArray *arrayHRM = info[kUTEQuery24HRMData]; // 3
    NSArray *arrayBlood = info[kUTEQueryBloodData]; // 4
    NSArray *arrayTemp = info[kUTEQueryBodyTemperature];  // 5
    NSArray *arrayOxygen = info[kUTEQueryBloodOxygenData]; // 6
    
    for (UTEModelSportWalkRun *model in arraySportWalkRun) {
        // NSLog(@"sport***time = %@,Total step = %ld , walkDistance = %f ,walkCalorie = %f ,runDistance = %f,runCalorie =%f",model.time, (long)model.stepsTotal,model.walkDistances,model.walkCalories,model.runDistances,model.runCalories);
        
        NSString *time1 = model.time;
        NSString *time2 = @"";
        NSString *v1 = [NSString stringWithFormat:@"%d", (int) model.stepsTotal];
        NSString *v2 = [NSString stringWithFormat:@"%f", model.walkDistances + model.runDistances];
        NSString *v3 = [NSString stringWithFormat:@"%f", model.walkCalories + model.runCalories];
        NSString *v4 = @"";
        NSString *v5 = @"";
        NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
        
        NSString *time0 = time1;
        
        time1 = [time1 replaceAll:@"-" replace:@""];
        if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        NSString *date1 = [time1 substringToIndex:8];
        time1 = [time1 substringFromIndex:8];
        
        NSString *date2 = @"";
        if (time2.length > 0) {
            time2 = [time2 replaceAll:@"-" replace:@""];
            if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            date2 = [time2 substringToIndex:8];
            time2 = [time2 substringFromIndex:8];
        }

        [_db saveSynchronized:1 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
        
        [self calcDateSyncLast:time0];
    }
    
//    NSArray *arrayAllSport     = info[kUTEQuerySportHRMData];
//
//    NSArray *arrayRun       = info[kUTEQueryRunData];
//    for (UTEModelRunData *model in arrayRun) {
//            NSLog(@"normal***time = %@, hourStep = %ld,Total step = %ld , distance = %f ,calorie = %f",model.time, (long)model.hourSteps,(long)model.totalSteps,model.distances,model.calories);
//    }
    
//    for (UTEModelSleepData *model in arraySleep) {
//        NSLog(@"***start=%@,end=%@,type=%ld",model.startTime,model.endTime,(long)model.sleepType);
//    }
    for (NSArray *array in arraySleepDayByDay) {
        
        // NSLog(@"***start=%@,end=%@,type=%ld",model.startTime,model.endTime,(long)model.sleepType);
        
        UTEModelSleepData *modelLast = [array lastObject];
        
        NSString *time1Last = modelLast.startTime;
        NSString *date = [[time1Last substringToIndex:10] replaceAll:@"-" replace:@""];

        for (UTEModelSleepData *model in array) {
            
            NSString *sleepType = @"0";
            if(((int) model.sleepType)==0) sleepType = @"2";
            else if(((int) model.sleepType)==1) sleepType = @"0";
            else sleepType = @"1";
            
            NSString *time1 = model.startTime;
            NSString *time2 = model.endTime;
            NSString *v1 = sleepType;//[NSString stringWithFormat:@"%d", (2 - (int) model.sleepType)];
            NSString *v2 = @"";
            NSString *v3 = @"";
            NSString *v4 = @"";
            NSString *v5 = @"";
            NSLog(@"dayByday=%d***start=%@,end=%@,type=%@",1,model.startTime,model.endTime,v1);
            
            NSString *time0 = time1;
            
            time1 = [time1 replaceAll:@"-" replace:@""];
            if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            NSString *date1 = [time1 substringToIndex:8];
            time1 = [time1 substringFromIndex:8];
            
            NSString *date2 = @"";
            if (time2.length > 0) {
                time2 = [time2 replaceAll:@"-" replace:@""];
                if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
                date2 = [time2 substringToIndex:8];
                time2 = [time2 substringFromIndex:8];
            }
            
            [_db saveSynchronized:2 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
            
            [self calcDateSyncLast:time0];
        }
    }
    for (UTEModelHRMData *model in arrayHRM) {
        // NSLog(@"***heartTime=%@ heartCoun=%@ heartType=%ld",model.heartTime,model.heartCount,(long)model.heartType);
        
        NSString *time1 = model.heartTime;
        NSString *time2 = @"";
        NSString *v1 = model.heartCount;
        NSString *v2 = [NSString stringWithFormat:@"%d", (int) model.heartType];
        NSString *v3 = @"";
        NSString *v4 = @"";
        NSString *v5 = @"";
        NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
        
        NSString *time0 = time1;
        
        time1 = [time1 replaceAll:@"-" replace:@""];
        if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        NSString *date1 = [time1 substringToIndex:8];
        time1 = [time1 substringFromIndex:8];
        
        NSString *date2 = @"";
        if (time2.length > 0) {
            time2 = [time2 replaceAll:@"-" replace:@""];
            if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            date2 = [time2 substringToIndex:8];
            time2 = [time2 substringFromIndex:8];
        }
        
        [_db saveSynchronized:3 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
        
        [self calcDateSyncLast:time0];
    }
    
    for (UTEModelBloodData *model in arrayBlood) {
        // [self bloodDetectingData:model];
        // NSLog(@"***time=%@ bloodSystolic=%@ bloodDiastolic=%@ type=%ld",model.bloodTime,model.bloodSystolic,model.bloodDiastolic,model.bloodType);
        
        NSString *time1 = model.bloodTime;
        NSString *time2 = @"";
        NSString *v1 = model.bloodSystolic;
        NSString *v2 = model.bloodDiastolic;
        NSString *v3 = [NSString stringWithFormat:@"%d", (int) model.bloodType];
        NSString *v4 = @"";
        NSString *v5 = @"";
        NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
        
        NSString *time0 = time1;
        
        time1 = [time1 replaceAll:@"-" replace:@""];
        if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        NSString *date1 = [time1 substringToIndex:8];
        time1 = [time1 substringFromIndex:8];
        
        NSString *date2 = @"";
        if (time2.length > 0) {
            time2 = [time2 replaceAll:@"-" replace:@""];
            if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            date2 = [time2 substringToIndex:8];
            time2 = [time2 substringFromIndex:8];
        }
        
        [_db saveSynchronized:4 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
        
        [self calcDateSyncLast:time0];
    }
    
    for (UTEModelBodyTemperature *model in arrayTemp) {
        // [self bloodDetectingData:model];
        // NSLog(@"***time=%@ bloodSystolic=%@ bloodDiastolic=%@ type=%ld",model.bloodTime,model.bloodSystolic,model.bloodDiastolic,model.bloodType);
        
        NSString *time1 = model.time;
        NSString *time2 = @"";
        NSString *v1 = model.bodyTemperature;
        NSString *v2 = model.shellTemperature;
        NSString *v3 = model.ambientTemperature;
        NSString *v4 = @"";
        NSString *v5 = @"";
        NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
        
        NSString *time0 = time1;
        
        time1 = [time1 replaceAll:@"-" replace:@""];
        if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        NSString *date1 = [time1 substringToIndex:8];
        time1 = [time1 substringFromIndex:8];
        
        NSString *date2 = @"";
        if (time2.length > 0) {
            time2 = [time2 replaceAll:@"-" replace:@""];
            if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            date2 = [time2 substringToIndex:8];
            time2 = [time2 substringFromIndex:8];
        }
        
        [_db saveSynchronized:5 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
        
        [self calcDateSyncLast:time0];
    }
    
    for (UTEModelBloodOxygenData *model in arrayOxygen) {
        NSString *time1 = model.time;
        NSString *time2 = @"";
        NSString *v1 = [NSString stringWithFormat:@"%d", (int) model.value];
        NSString *v2 = @"";
        NSString *v3 = @"";
        NSString *v4 = @"";
        NSString *v5 = @"";
        NSString *date = [[time1 substringToIndex:10] replaceAll:@"-" replace:@""];
        
        NSString *time0 = time1;
        
        time1 = [time1 replaceAll:@"-" replace:@""];
        if (time1.length < 14) time1 = [time1 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
        NSString *date1 = [time1 substringToIndex:8];
        time1 = [time1 substringFromIndex:8];
        
        NSString *date2 = @"";
        if (time2.length > 0) {
            time2 = [time2 replaceAll:@"-" replace:@""];
            if (time2.length < 14) time2 = [time2 stringByPaddingToLength: 14 withString: @"0" startingAtIndex:0];
            date2 = [time2 substringToIndex:8];
            time2 = [time2 substringFromIndex:8];
        }
        
        [_db saveSynchronized:6 :self.smartBandMgr.connectedDevicesModel.identifier :date :date1 :time1 :date2 :time2 :v1 :v2 :v3 :v4 :v5 :YES];
        
        [self calcDateSyncLast:time0];
    }
    
    if (self.syncType <= 0)
        [self syncTypeAllNext]; // 연결후, 전체 인 경우
    else
        [self syncTypeAllFinish]; // 단일인 경우
}



#pragma mark -
- (NSMutableDictionary *) dtd1 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
    
    d2[@"resultDate"] = d1[@"sDate1"];
    d2[@"resultTime"] = d1[@"sTime1"];
    
    d2[@"stepCount"] = d1[@"sV1"];
    d2[@"distance"] = d1[@"sV2"];
    
    return d2;
}

- (NSMutableDictionary *) dtd2 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
    
    d2[@"sleepStartDate"] = d1[@"sDate1"];
    d2[@"sleepEndDate"] = d1[@"sDate2"];
    d2[@"sleepStartTime"] = d1[@"sTime1"];
    d2[@"sleepEndTime"] = d1[@"sTime2"];
    d2[@"sleepType"] = d1[@"sV1"];
    
    return d2;
}

- (NSMutableDictionary *) dtd2sum : (NSArray *) arr2 {
    
    NSMutableDictionary *res = [NSMutableDictionary dictionary];
    
    int sleepTime = 0;
    
    NSMutableArray *todaySleepTimeList = [NSMutableArray array];
    
    for (NSDictionary *d1 in arr2) {
        NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
        
        NSDateFormatter *f = [[NSDateFormatter alloc] init];
        f.dateFormat = @"yyyyMMddHHmm";
        NSDate *date1 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate1"], d1[@"sTime1"]]];
        NSDate *date2 = [f dateFromString:[NSString stringWithFormat:@"%@%@", d1[@"sDate2"], d1[@"sTime2"]]];
        
        sleepTime += (int) [date2 timeIntervalSinceDate:date1];
        
        d2[@"sleepStartDate"] = d1[@"sDate1"];
        d2[@"sleepEndDate"] = d1[@"sDate2"];
        d2[@"sleepStartTime"] = d1[@"sTime1"];
        d2[@"sleepEndTime"] = d1[@"sTime2"];
        d2[@"sleepType"] = d1[@"sV1"];
        
        [todaySleepTimeList addObject:d2];
    }
    
    NSMutableString *sleepTimeString = [NSMutableString string];
    
    if (sleepTime >= 3600 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", sleepTime / 3600]];
    else if (sleepTime >= 3600 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", sleepTime / 3600]];
    else [sleepTimeString appendString:@"00"];
    
    int m = sleepTime % 3600;
    
    if (m >= 60 * 10) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", m / 60]];
    else if (m >= 60 ) [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", m / 60]];
    else [sleepTimeString appendString:@"00"];
    
    int s = m % 60;
    
    if (s >= 10 ) [sleepTimeString appendString:[NSString stringWithFormat:@"%d", s]];
    else [sleepTimeString appendString:[NSString stringWithFormat:@"0%d", s]];
    
    res[@"sleepTimeList"] = todaySleepTimeList;
    res[@"todaySleepTimeList"] = todaySleepTimeList;
    res[@"todayTotalSleepTime"] = sleepTimeString;
    
    return res;
}

- (NSMutableDictionary *) dtd3 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
    
    d2[@"resultDate"] = d1[@"sDate1"];
    d2[@"resultTime"] = d1[@"sTime1"];
    
    d2[@"hr"] = d1[@"sV1"];

    return d2;
}

- (NSMutableDictionary *) dtd4 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
    
    d2[@"resultDate"] = d1[@"sDate1"];
    d2[@"resultTime"] = d1[@"sTime1"];
    
    d2[@"dbp"] = d1[@"sV2"];
    d2[@"sbp"] = d1[@"sV1"];
    
    return d2;
}

- (NSMutableDictionary *) dtd5 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
    
    d2[@"resultDate"] = d1[@"sDate1"];
    d2[@"resultTime"] = d1[@"sTime1"];
    
    d2[@"bt"] = d1[@"sV1"];

    return d2;
}

- (NSMutableDictionary *) dtd6 : (NSDictionary *) d1 {
    
    NSMutableDictionary *d2 = [NSMutableDictionary dictionary];
        
    d2[@"resultDate"] = d1[@"sDate1"];
    d2[@"resultTime"] = d1[@"sTime1"];
        
    d2[@"spO2"] = d1[@"sV1"];

    return d2;
}

- (NSMutableDictionary *) dtdWithId1 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [self dtd1:d1];
    d2[@"deviceId"] = d1[@"sDeviceId"];
    return d2;
}

- (NSMutableDictionary *) dtdWithId2 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [self dtd2:d1];
    d2[@"deviceId"] = d1[@"sDeviceId"];
    d2[@"searchDate"] = d1[@"sDate"];
    return d2;
}

- (NSMutableDictionary *) dtdWithId3 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [self dtd3:d1];
    d2[@"deviceId"] = d1[@"sDeviceId"];
    return d2;
}

- (NSMutableDictionary *) dtdWithId4 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [self dtd4:d1];
    d2[@"deviceId"] = d1[@"sDeviceId"];
    return d2;
}

- (NSMutableDictionary *) dtdWithId5 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [self dtd5:d1];
    d2[@"deviceId"] = d1[@"sDeviceId"];
    return d2;
}

- (NSMutableDictionary *) dtdWithId6 : (NSDictionary *) d1 {
    NSMutableDictionary *d2 = [self dtd6:d1];
    d2[@"deviceId"] = d1[@"sDeviceId"];
    return d2;
}

@end
