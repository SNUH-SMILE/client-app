//
//  RTKAccessoryOTAUpgrade.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2020/3/10.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <RTKLEFoundation/RTKLEFoundation.h>
#import "RTKOTAUpgrade.h"


NS_ASSUME_NONNULL_BEGIN

/**
 * A concrete RTKOTAUpgrade class which is responsible for upgrade a iAP accessory.
 */
@interface RTKAccessoryOTAUpgrade : RTKOTAUpgrade

/**
 * Initialize using a accessory.
 */
- (instancetype)initWithAccessory:(RTKAccessory *)accessory; // not support current


/**
 * The associated accessory to upgrade.
 */
@property (readonly) RTKAccessory *accessory;

/**
 * Initialize with a exist BBpro message communication.
 */
- (instancetype)initWithBBproMessageCommunication:(RTKPackageCommunication *)communication accessory:(RTKAccessory *)accessory;
@property (readonly) RTKPackageCommunication *communication;

@end

NS_ASSUME_NONNULL_END
