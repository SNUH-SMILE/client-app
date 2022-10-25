//
//  RTKOTAProfile.h
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
#import "RTKMultiDFUPeripheral.h"


NS_ASSUME_NONNULL_BEGIN

@interface RTKOTAProfile : RTKLEProfile

// Instantiate OTAPeripheral from a known CBPeripheral object.
// You typically already have a CBPeripheral to upgrade within your CBCentralManager.

// deprecated. use -instantiatePeripheralWithCBPeripheral: instead.
- (nullable RTKOTAPeripheral*)OTAPeripheralFromCBPeripheral:(CBPeripheral *)peripheral;

// Silent upgrade
- (nullable RTKDFUPeripheral*)DFUPeripheralOfOTAPeripheral:(RTKOTAPeripheral *)peripheral;

- (void)connectToDFUPeripheral:(RTKDFUPeripheral *)peripheral;

// Normal upgrade
- (void)translatePeripheral:(RTKOTAPeripheral*)peripheral toDFUPeripheralWithCompletion:(void(^)(BOOL success, NSError *_Nullable err, RTKDFUPeripheral *_Nullable peripheral))handler;


/** Discover for companion peripheral. Used for RWS upgrade. **/
- (void)scanCompanionPeripheralOf:(RTKOTAPeripheral *)peripheral withCompletionHandler:(void(^)(BOOL success, NSError*_Nullable err, RTKOTAPeripheral *_Nullable targetPeripheral))handler;

@end



@interface RTKOTAProfile (Protect)

/* Protected */
- (void)_scanDFUPerpheralOf:(RTKOTAPeripheral*)peripheral withCompletion:(void(^)(BOOL success, NSError *_Nullable err, RTKDFUPeripheral *_Nullable peripheral))handler;

@end


NS_ASSUME_NONNULL_END
