//
//  RTKOTACoordinator.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2020/3/19.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <RTKLEFoundation/RTKLEFoundation.h>
#import "RTKOTAUpgradeBin.h"
#import "RTKOTADeviceInfo.h"
#import "RTKOTAUpgrade.h"


NS_ASSUME_NONNULL_BEGIN

@class RTKOTACoordinator;

/**
 * The RTKOTACoordinatorDelegate protocol defines methods that you use to receive events from an RTKOTACoordinator object.
 */
@protocol RTKOTACoordinatorDelegate <NSObject>
@optional
/**
 * Tells the delegate that the remote device information is determined.
 */
- (void)OTACoordinatorDidBeReadyForUpgrade:(RTKOTACoordinator *)coordinator withDeviceInfo:(RTKOTADeviceInfo *)info;

/**
 * Tells the delegate that coordinator could not get ready for upgrade.
 */

- (void)OTACoordinator:(RTKOTACoordinator *)coordinator couldNotUpgradeWithError:(NSError *)error;

/**
 * Tells the delegate that a image will be send to remote device.
 */
- (void)OTACoordinator:(RTKOTACoordinator *)coordinator willUpgradeImage:(RTKOTAUpgradeBin *)image;

/**
 * Tells the delegate that a image did be send to remote device.
 */
- (void)OTACoordinator:(RTKOTACoordinator *)coordinator didUpgradeImage:(RTKOTAUpgradeBin *)image;

/**
 * Tells the delegate that images did take effect in remote device.
 */
- (void)OTACoordinator:(RTKOTACoordinator *)coordinator didActiveImages:(NSArray<RTKOTAUpgradeBin*>*)images;

/**
 * Tells the delegate that upgrade task did finish. If upgrade succees, the error parameter is nil, otherwise a error object is passed in.
 */
- (void)OTACoordinator:(RTKOTACoordinator *)coordinator didCompleteUpgradeWithError:(nullable NSError *)error;

@end



/**
 * The RTKOTACoordinator object is responsible for coordinate OTA upgrades of multiple images on one remote device or both RWS buds.
 * It is an abstract class encapsulating the common API to RTKAccessoryOTACoordinator and RTKLEOTACoordinator. You should use the concrete OTACoordinator instance.
 */
@interface RTKOTACoordinator : NSObject <NSProgressReporting, RTKOTAUpgradeDelegate>

/**
 * The delegate object specified to receive OTA upgrade events.
 */
@property (nonatomic, weak) id<RTKOTACoordinatorDelegate> delegate;

/**
 * The actual upgrade object current in effect.
 */
@property (nonatomic, readonly) RTKOTAUpgrade *upgrade;

/**
 * Indicate whether there is upgrading task now.
 */
@property (nonatomic, readonly) BOOL isUpgrading;

/**
 * The upgrade image current upgrading.
 */
@property (nonatomic, readonly, nullable) RTKOTAUpgradeBin *imageInUpgrading;


/**
 * Start a upgrade with one image.
 *
 * @discussion If upgrade more than one images, use -upgradeWithImages: instead.
 */
- (void)upgradeWithImage:(RTKOTAUpgradeBin *)image;

/**
 * The upgrade images current upgrading.
 */
@property (readonly, nullable) NSArray <RTKOTAUpgradeBin*> *upgradeImages;

/**
 * Start upgrade with multiple images.
 *
 * @discussion According to peripheral capability and state, reboot may occur between one or several image upgrade.
 */
- (void)upgradeWithImages:(NSArray <RTKOTAUpgradeBin*> *)images;

/**
 * Start upgrade with each images to RWS buds.
 *
 * @discussion When upgrading RWS pair, each bud will be upgraded using -upgradeWithImages: with corresponding images. When upgrade the other bud, the bud object is assigned automatically(eg LE) or manually (eg iAP).
 */
- (void)upgradeRWSWithPrimaryBudImages:(NSArray <RTKOTAUpgradeBin*> *)primaryImages secondaryBudImages:(NSArray <RTKOTAUpgradeBin*> *)secondaryImages;

/**
 * Cancel ongoing upgrade task.
 */
- (void)cancelUpgrade;

@end

NS_ASSUME_NONNULL_END
