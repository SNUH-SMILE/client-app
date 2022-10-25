//
//  RTKOTAImage.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2019/1/28.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKOTABin.h"


typedef NS_ENUM(NSUInteger, RTKOTAUpgradeBank) {
    RTKOTAUpgradeBank_Unknown,
    RTKOTAUpgradeBank_SingleOrBank0,
    RTKOTAUpgradeBank_Bank1,
};



@class RTKOTAPeripheral;

NS_ASSUME_NONNULL_BEGIN

/**
 * 代表一个OTA升级的bin单元
 */
@interface RTKOTAUpgradeBin : RTKOTABin

@property (readonly) NSUInteger otaVersion;

@property (readonly) NSUInteger secVersion;

@property (readonly) NSUInteger imageId;

@property (readonly) NSData *data;


- (instancetype)initWithPureData:(NSData *)data;

/**
 * Whether this image is able to be installed at bank1. This is available for dual bank SOC.
 */
@property (readonly) RTKOTAUpgradeBank upgradeBank;

// 32-byte
@property (readonly, nullable) NSData *checkValue;

@property (nonatomic, readonly) BOOL ICDetermined;


// Assign the OTA target peripheral IC subjectively.
// @discussion You should call this method only if property ICDetermined is NO. You should make sure the upgrade Bin matches target peripheral, otherwise, the behaviour is not determined.
- (void)assertAvailableForPeripheral:(RTKOTAPeripheral *)peripheral;


+ (nullable NSArray <RTKOTAUpgradeBin*> *)imagesExtractedFromMPPackFilePath:(NSString *)path error:(NSError *__nullable *__nullable)errPtr;

+ (nullable NSArray <RTKOTAUpgradeBin*> *)imagesExtractFromMPPackFilePath:(NSString *)path error:(NSError *__nullable *__nullable)errPtr  DEPRECATED_MSG_ATTRIBUTE("use +imagesExtractedFromMPPackFilePath:error: instead");


+ (nullable NSArray <RTKOTAUpgradeBin*> *)imagesExtractedFromMPPackFileData:(NSData *)data error:(NSError *__nullable *__nullable)errPtr;

+ (nullable NSArray <RTKOTAUpgradeBin*> *)imagesExtractFromMPPackFileData:(NSData *)data error:(NSError *__nullable *__nullable)errPtr DEPRECATED_MSG_ATTRIBUTE("use +imagesExtractedFromMPPackFileData:error: instead");


+ (nullable NSError*)extractCombinePackFileWithFilePath:(NSString *)path toPrimaryBudBins:(NSArray <RTKOTAUpgradeBin*> *_Nullable*_Nullable)primaryBinsRef secondaryBudBins:(NSArray <RTKOTAUpgradeBin*> *_Nullable*_Nullable)secondaryBinsRef;


@end


NS_ASSUME_NONNULL_END
