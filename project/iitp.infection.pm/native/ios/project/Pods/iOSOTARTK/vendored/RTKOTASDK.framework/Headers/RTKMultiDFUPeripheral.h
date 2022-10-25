//
//  RTKMultiDFUPeripheral.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2019/4/16.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import "RTKDFUPeripheral.h"

NS_ASSUME_NONNULL_BEGIN

@class RTKOTAProfile;
@class RTKMultiDFUPeripheral;

@protocol RTKMultiDFUPeripheralDelegate <RTKDFUPeripheralDelegate>
@optional
- (void)DFUPeripheral:(RTKMultiDFUPeripheral *)peripheral willSendImage:(RTKOTAUpgradeBin *)image;
- (void)DFUPeripheral:(RTKMultiDFUPeripheral *)peripheral didSendImage:(RTKOTAUpgradeBin *)image;
- (void)DFUPeripheral:(RTKMultiDFUPeripheral *)peripheral didActiveImages:(NSArray<RTKOTAUpgradeBin*>*)images;

@end


@interface RTKMultiDFUPeripheral : RTKDFUPeripheral

@property (nonatomic, weak) id <RTKMultiDFUPeripheralDelegate> delegate;

@property (readonly, nullable) NSArray <RTKOTAUpgradeBin*> *upgradeImages;

- (void)upgradeImages:(NSArray <RTKOTAUpgradeBin*> *)images inOTAMode:(BOOL)yesOrNo;

@end

NS_ASSUME_NONNULL_END
