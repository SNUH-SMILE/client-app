//
//  RTKAccessoryOTACoordinator.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2020/3/10.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKOTACoordinator.h"

NS_ASSUME_NONNULL_BEGIN

@class RTKAccessoryOTACoordinator;
@protocol RTKAccessoryOTACoordinatorDelegate <RTKOTACoordinatorDelegate>
@optional
/**
 * Return a time interval used when wait for connection with accessory. If not be implemeted, the defaut 30 seconds is used.
 */
- (NSTimeInterval)timeoutIntervalForConnectionOfOTACoordinator:(RTKAccessoryOTACoordinator *)coordinator;

/**
 * Request delegate object to reconnect the accessory.
 */
- (void)OTACoordinator:(RTKAccessoryOTACoordinator *)coordinator requestToReconnectTo:(RTKAccessory *)accessory;

/**
 * Request delegate object to connect the companion accessory.
 *
 * @discussion When the companion accessory connected, you should call -onConnectedToCompanionAccessory:ofAccessory: to specify the companion accessory.
 */
- (void)OTACoordinator:(RTKAccessoryOTACoordinator *)coordinator requestToConnectToCompanionOf:(RTKAccessory *)accessory;

@end


/**
 * A concrete RTKOTACoordinator class which is dedicated to iAP accessory OTA upgrade.
 */
@interface RTKAccessoryOTACoordinator : RTKOTACoordinator

@property (nonatomic, weak) id<RTKAccessoryOTACoordinatorDelegate> delegate;

/**
 * The accessory current in upgrading.
 */
@property (nonatomic, readonly, nullable) RTKAccessory *upgradingAccessory;

/**
 * Before start a upgrade, you call -prepareForAccessory: or -prepareForAccessory:ofAccessory: to specify the upgrading target device.
 *
 * @discussion This method will communicate with accessory exclusively. Any exist communication will become invalid.
 */
- (void)prepareForAccessory:(RTKAccessory *)accessory;

/**
 * Specify a upgrading accessory with already created underlying message communication channel. This is usally used when a message communication is created for another interaction.
 */
- (void)prepareForAccessory:(RTKAccessory *)accessory withExistMessageCommunication:(RTKPackageCommunication *)messageCommunication;

/**
 * Call this method to specify the companion accessory and start upgrade of the companion accessory. the companion accessory must be connected.
 */
- (void)onConnectedToCompanionAccessory:(RTKAccessory *)companionAccessory ofAccessory:(RTKAccessory *)accessory;

@end

NS_ASSUME_NONNULL_END
