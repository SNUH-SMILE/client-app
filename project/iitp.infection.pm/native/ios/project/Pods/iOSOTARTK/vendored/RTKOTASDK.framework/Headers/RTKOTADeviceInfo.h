//
//  RTKOTADeviceInfo.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2020/3/9.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>

#if RTK_SDK_IS_STATIC_LIBRARY
#import "RTKLEFoundationUmbrella.h"
#else
#import <RTKLEFoundation/RTKLEFoundation.h>
#endif

#import "RTKOTAPeripheral.h"
#import "RTKOTABin.h"


NS_ASSUME_NONNULL_BEGIN

@interface RTKOTADeviceInfo : NSObject

/**
 * OTA process version
 */
@property (readonly) NSUInteger OTAVersion;

@property (readonly) NSUInteger securityVersion;

/**
 * The BDAddress
 */
@property (readonly) BDAddressType bdAddress;

/**
* The companion bud BDAddress.
*/
@property (readonly) BDAddressType companionBDAddress;

@property (readonly) uint16_t appVersion;
@property (readonly) uint16_t patchVersion;

@property (readonly) NSString *linkKey;
@property (readonly) NSUInteger tempBufferSize;

@property (readonly) NSUInteger freeBank;
@property (readonly) NSUInteger appFreeBank;
@property (readonly) NSUInteger patchFreeBank;

@property (readonly) BOOL bufferCheckEnable;
@property (readonly) BOOL AESEnable;
@property (readonly) NSUInteger encryptionMode;
@property (readonly) BOOL copyImage;
@property (readonly) BOOL updateMultiImages;

@property (readonly) NSUInteger maxBufferSize;

/* RWS Upgrade related properties */
/**
 Whether this peripheral is a one of the RWS pair.
 */
@property (readonly) BOOL isRWS;

/**
 Indicate what bud is this perpheral.
 */
@property (readonly) RTKOTAEarbud budType;

/**
Indicate whether RWS bud is in engaged.d
*/
@property (readonly) BOOL notEngaged;


/**
 Indicate whether this peripheral have received images right now, but not active.
 */
@property (readonly) BOOL upgradedCurrently;


@property (readonly) RTKOTAProtocolType protocolType;

/**
 * The executable bins installed in Realtek peripheral.
 */
@property (readonly) NSArray <RTKOTABin*> *bins;




/**
 * Indicate whether related peripheral can translate to OTA mode, and wether -enterOTAMode method can be invoked.
 */
@property (readonly) BOOL canEnterOTAMode;

/**
 * Indicate whether related peripheral can DFU upgrade immediately.
 */
@property (readonly) BOOL canUpgradeSliently;

@end


@interface RTKOTADeviceInfo (Protect)
@property NSUInteger maxBufferSize;
@end


NS_ASSUME_NONNULL_END
