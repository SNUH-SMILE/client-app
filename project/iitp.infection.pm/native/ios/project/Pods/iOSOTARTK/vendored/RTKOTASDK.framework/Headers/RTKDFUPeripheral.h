//
//  RTKDFUPeripheral.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2019/4/16.
//  Copyright © 2019 Realtek. All rights reserved.
//

#if RTK_SDK_IS_STATIC_LIBRARY
#import "RTKLEFoundationUmbrella.h"
#else
#import <RTKLEFoundation/RTKLEFoundation.h>
#endif

#import "RTKOTAPeripheral.h"
#import "RTKOTAUpgradeBin.h"


typedef enum : NSUInteger {
    RTKDFUPhaseNone,
    RTKDFUPhaseSending,
    RTKDFUPhaseActivating,
    RTKDFUPhaseResetting,
    RTKDFUPhaseCanceling,
    RTKDFUPhaseReconnecting,
    RTKDFUPhaseEncounterError,
} RTKDFUPhase;


NS_ASSUME_NONNULL_BEGIN


@class RTKDFUPeripheral;

@protocol RTKDFUPeripheralDelegate <RTKLEPeripheralDelegate>
@required
- (void)DFUPeripheral:(RTKDFUPeripheral *)peripheral didFinishWithError:(nullable NSError *)err;

@optional
- (void)DFUPeripheral:(RTKDFUPeripheral *)peripheral didSend:(NSUInteger)length totalToSend:(NSUInteger)totalLength;

- (BOOL)DFUPeripheral:(RTKDFUPeripheral *)peripheral shouldWaitForDisconnectionOnCompleteSend:(RTKOTAUpgradeBin *)image;

@end



@class RTKOTAProfile;
@interface RTKDFUPeripheral : RTKLEPeripheral {
    @protected
    RTKDFUPhase _phase;
    RTKOTAUpgradeBin *_upgradingImage;
}

@property (nonatomic, weak) id <RTKDFUPeripheralDelegate> delegate;

@property (nonatomic, readonly) RTKOTAPeripheral *OTAPeripheral;

@property (nonatomic, readonly) RTKDFUPhase phase;

@property (readonly, nullable) RTKOTAUpgradeBin *upgradingImage;

/**
 * The AES key, used to encrypte image data when peripheral support.
 * @discussion If no encryptKey set, the default key is used.
 */
- (void)setEncryptKey:(NSData * _Nonnull)encryptKey;


- (instancetype)initWithCBPeripheral:(CBPeripheral *)peripheral OTAPeripheral:(nullable RTKOTAPeripheral *)OTAPeri profile:(RTKOTAProfile *)profile;


- (void)upgradeImage:(RTKOTAUpgradeBin *)image;

- (void)cancelUpgrade;


/* Protected */
@property (readonly) RTKPackageCommunication *controlPoint;

- (void)beginWaitForLEDisconnection;
- (void)cancelWaitForLEDisconnection;

- (void)handleActiveMessageSendCompletion:(BOOL)success withError:(nullable NSError *)err;

/**
 * 模板方法，不要在外部调用
 */
- (void)sendReceiveFWImageMessage;
- (void)sendValidateImageMessage;
- (void)sendActiveResetToNormalMessage;
- (void)sendActiveResetToOTAMessage;


- (void)getImageVersionsOf:(BOOL)activeBank withCompletionHandler:(void(^)(BOOL success, NSError *error, NSArray<RTKOTAInstalledBin*> *bins))handler;

typedef NS_OPTIONS(uint32_t, RTKDFUTestModeFlag) {
    RTKDFUTestModeFlag_AES = 1 << 0,
    RTKDFUTestModeFlag_Stress = 1 << 1,
    RTKDFUTestModeFlag_CopyFail = 1 << 2,
    RTKDFUTestModeFlag_SkipFail = 1 << 3,
    RTKDFUTestModeFlag_BufferCheckDisable = 1 << 4,
};
@property (nonatomic) RTKDFUTestModeFlag testFlag;

- (void)handleImageSendCompletion;

- (void)reportDFUCommunicationFailWithError:(NSError *)err;
- (BOOL)upgradeCanceledInspect;

/**
* Connection Parameter Update 参数单位：ms
*/
-(void)setConnectionParametersWithMinInterval:(uint16_t)intervalMin maxInterval:(uint16_t)intervalMax latency:(uint16_t)latency supervisionTimeout:(uint16_t)timeout;


@end

NS_ASSUME_NONNULL_END
