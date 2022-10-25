//
//  ExtendWNInterface+Base.m
//  iitp.infection.pm
//
//  Created by 유라클 on 2021/11/29.
//

#import "ExtendWNInterface.h"

@interface ExtendWNInterface (UTE)

@end

@implementation ExtendWNInterface (UTE)

- (void) exBandScan: (NSString *) options {
    if (options == nil) { options = @""; }
    
    NSData *jsonData = [options dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:&err];

    if (err != nil) {
        return;
    }
    
    NSString *cbk = dic[@"callback"]; // callback 함수 이름
    NSString *sch = dic[@"schBluetooth"]; // 해당 내용은 사용되지 않음, 안드로이드에서 이름으로 필터함.
    
    self.sbm.scanCbk = cbk;
    self.sbm.scanSch = sch;
    
    [self.sbm startScanDevices];
}

- (void) exBandConnect: (NSString *) options {
    if (options == nil) { options = @""; }
    
    NSData *jsonData = [options dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:&err];

    if (err != nil) {
        return;
    }
    
    NSString *cbk = dic[@"callback"];                   // callback 함수 이름
    NSString *sch = dic[@"schBluetooth"];               // 해당 내용은 사용되지 않음, 안드로이드에서 이름으로 필터함.
    NSString *add = dic[@"bandAddr"];                   // 연결할 핸드 ID
    NSString *typ = dic[@"resetType"];                  // 연결할 핸드 ID
    
//    NSString *bpcbk = dic[@"bpCallback"];               //
//    NSString *spo2Cbk = dic[@"spo2Callback"];           //
//    NSString *hrmCbk = dic[@"hrmCallback"];             //
//    NSString *hrm24Cbk = dic[@"hrm24Callback"];         //
//    NSString *btCbk = dic[@"btCallback"];               //
//    NSString *stepCbk = dic[@"stepCallback"];           //
    //NSString *stepHourCbk = dic[@"stepHourCallback"];   //
    
    self.sbm.connectCbk = cbk;
    self.sbm.connectSch = sch;
    self.sbm.connectTyp = typ;


//    self.sbm.bpCbk = bpcbk;
//    self.sbm.spo2Cbk = spo2Cbk;
//    self.sbm.hrmCbk = hrmCbk;
//    self.sbm.hrm24Cbk = hrm24Cbk;
//    self.sbm.btCbk = btCbk;
//    self.sbm.stepCbk = stepCbk;
    //self.sbm.stepHourCbk = stepHourCbk;
    
    [self.sbm connectDevice:add];
}

- (void) exMainAllData: (NSString *) callback {
    self.sbm.syncAllCbk = callback;
    [self.sbm syncAll];
}

- (void) exBodyDetailData: (NSString *) options {
    NSData *jsonData = [options dataUsingEncoding:NSUTF8StringEncoding];
    NSError *err;
    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:jsonData options:kNilOptions error:&err];

    if (err != nil) {
        return;
    }
    
    NSString *dt = dic[@"schDate"]; // callback 함수 이름
    NSString *type = dic[@"queryDataType"]; // 해당 내용은 사용되지 않음, 안드로이드에서 이름으로 필터함.
    NSString *cbk = dic[@"callback"]; // 연결할 핸드 ID
    
    self.sbm.syncCbk = cbk;
    
    NSDateFormatter *f = [[NSDateFormatter alloc] init];
    f.dateFormat = @"yyyyMMdd";
    
    NSDate *date = [f dateFromString:dt];
    
    int typeInt = 0;
    if ([type isEqualToString:@"STEP"]) typeInt = 1;
    if ([type isEqualToString:@"SLEEP"]) typeInt = 2;
    if ([type isEqualToString:@"RATE"]) typeInt = 3;
    if ([type isEqualToString:@"BLOOD"]) typeInt = 4;
    if ([type isEqualToString:@"TEMP"]) typeInt = 5;
    if ([type isEqualToString:@"OXYGEN"]) typeInt = 6;
    
    if (typeInt > 0)
        [self.sbm sync:date :typeInt];
}

- (NSString *) exIsBandConnect {
    return [self.sbm isDeviceConnected] ? @"T" : @"F";
}

- (void) exBloodPresureTestStart {
    [self.sbm onClickUTEOption :UTEOptionBloodDetectingStart];
}

- (void) exBloodPresureTestStop {
    self.sbm.isBloodPresureTest = NO;
    [self.sbm onClickUTEOption :UTEOptionBloodDetectingStop];
}

- (void) exSpo2TestStart {
    [self.sbm onClickUTEOption :UTEOptionBloodOxygenDetectingStart];
}

- (void) exSpo2TestStop {
    self.sbm.isSp02Test = NO;
    [self.sbm onClickUTEOption :UTEOptionBloodOxygenDetectingStop];
}

- (void) exHRMTestStart {
    [self.sbm onClickUTEOption:UTEOptionHeartDetectingStart];
}

- (void) exHRMTestStop {
    [self.sbm onClickUTEOption:UTEOptionHeartDetectingStop];
}

- (void) exBodyTemperatureTestStart {
    [self.sbm readBodyTemperatureCurrent];
}

// - (void) exBodyTemperatureTestStop {
//
// }

- (void) exBandDisconnect {
    [self.sbm disconnectDevice];
}

- (void) exBandScanStop {
    [self.sbm stopScanDevices];
}

- (void) exLastDeviceId: (NSString *) callback {
    [self.sbm lastDeviceId:callback];
}

- (void) exBandAllDataSync : (NSString *) str {
    
    if ([str isEqualToString:@"true"]) {
        _setGlobalValue(@"NATIVE_SHOW_PROGRESS", @"Y");
    } else {
        _setGlobalValue(@"NATIVE_SHOW_PROGRESS", @"N");
    }
    
    [self.sbm sync:[NSDate now] :-2];
}

- (void) exServerSyncData :(NSString *) callback {
    [self.sbm serverSyncData:callback];
}

- (void) exServerSyncDataFinish {
    [self.sbm serverSyncDataFinish];
}

- (void) exTest {
    [self.sbm test];
}
@end
