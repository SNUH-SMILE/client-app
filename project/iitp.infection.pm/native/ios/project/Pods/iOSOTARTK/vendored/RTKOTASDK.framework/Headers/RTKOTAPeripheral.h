//
//  RTKOTAPeripheral.h
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

#import "RTKOTAFormat.h"
#import "RTKOTAInstalledBin.h"

NS_ASSUME_NONNULL_BEGIN


typedef enum : NSUInteger {
    RTKOTAProtocolTypeGATTSPP  =  0x0000,
    RTKOTAProtocolTypeGATT  =   0x0010,
    RTKOTAProtocolTypeSPP =   0x0011,
} RTKOTAProtocolType;


typedef enum : NSUInteger {
    RTKOTAEarbudUnkown,
    RTKOTAEarbudPrimary,
    RTKOTAEarbudSecondary,
    RTKOTAEarbudSingle,
} RTKOTAEarbud;


typedef enum : NSInteger {
    RTKOTABankTypeInvalid   =   -1,
    RTKOTABankTypeSingle    = 0x00,
    RTKOTABankTypeBank0,
    RTKOTABankTypeBank1,
} RTKOTABankType;


@class RTKOTAPeripheral;

@protocol RTKOTAPeripheralDelegate <RTKLEPeripheralDelegate>

/**
 * Invoked when RTKOTAClient has determined information about OTA.
 */
- (void)OTAPeripheral:(RTKOTAPeripheral *)peripheral didDetermineInfoWithError:(nullable NSError*)error;

@end



@interface RTKOTAPeripheral : RTKLEPeripheral

@property (readonly) BOOL infoSettled;

@property (nonatomic, weak) id <RTKOTAPeripheralDelegate> delegate;

@property (readonly) NSUInteger batteryLevel;
/**
 * OTA process version
 */
@property (readonly) NSUInteger OTAVersion;

@property (readonly) NSUInteger securityVersion;

@property (readonly) BDAddressType bdAddress;
@property (readonly) BDAddressType companionBDAddress;

@property (readonly) uint16_t appVersion;
@property (readonly) uint16_t patchVersion;

@property (readonly) NSString *linkKey;
@property (readonly) NSUInteger tempBufferSize;

@property (readonly) RTKOTABankType activeBank;
@property (readonly) NSUInteger appFreeBank;
@property (readonly) NSUInteger patchFreeBank;

@property (readonly) BOOL bufferCheckEnable;
@property (readonly) BOOL AESEnable;
@property (readonly) NSUInteger encryptionMode;
@property (readonly) BOOL copyImage;
@property (readonly) BOOL updateMultiImages;

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

@property (readonly) uint32_t imageIndicator;

@property (readonly) RTKOTAProtocolType protocolType;

/**
 * The executable bins installed in Realtek peripheral.
 */
@property (readonly) NSArray <RTKOTAInstalledBin*> *bins;




/**
 * Indicate whether related peripheral can translate to OTA mode, and wether -enterOTAMode method can be invoked.
 */
@property (readonly) BOOL canEnterOTAMode;

/**
 * Indicate whether related peripheral can DFU upgrade immediately.
 */
@property (readonly) BOOL canUpgradeSliently;


/**
 * Request peripheral translate to OTA mode.
 * @discussion In translating to OTA mode, the Peripheral first get disconnected, and reboot as a different peripheral (while advertising same address). When the OTA mode peripheral be scanned, RTKOTAClientDelegate -OTAClient:didEnterOTAModeWithPeripheral: get invoked with the peripheral.
 */
- (void)enterOTAMode;

@end


// only used for BBpro 2 dual bank situation.
@interface RTKOTAPeripheral (DualBank)

@property (readonly, nullable) NSArray <RTKOTAInstalledBin*> *inactiveBins;


@end


NS_ASSUME_NONNULL_END
