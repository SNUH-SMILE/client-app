//
//  RTKOTAUpgrade.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2020/3/19.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKOTAUpgradeBin.h"
#import "RTKOTADeviceInfo.h"
#import "RTKOTAPeripheral.h"
#import "RTKDFUPeripheral.h"


NS_ASSUME_NONNULL_BEGIN

@class RTKOTAUpgrade;

@protocol RTKOTAUpgradeDelegate<NSObject>
@optional
- (void)OTAUpgradeDidGetReadyForUpgrade:(RTKOTAUpgrade *)upgradeController;
- (void)OTAUpgrade:(RTKOTAUpgrade *)upgradeController couldNotUpgradeWithError:(NSError *)err;

- (BOOL)OTAUpgradeShouldActiveSendedImage:(RTKOTAUpgrade *)upgradeController;

- (void)OTAUpgrade:(RTKOTAUpgrade *)upgradeController didFinishWithError:(nullable NSError *)err;

@end


/**
 * RTKOTAUpgrade is a abstract class which provide common upgrade API.
 *
 * @discussion Not like RTKOTACoordinator, a RTKOTAUpgrade represents a upgrade task.
 */
@interface RTKOTAUpgrade : NSObject <NSProgressReporting> {
@protected
    RTKDFUPhase _phase;
    RTKOTAUpgradeBin *_upgradingImage;
}
@property (nonatomic, weak) id<RTKOTAUpgradeDelegate> delegate;

/**
 * Start the preparation for upgrad.
 */
- (void)prepareForUpgrade;

/**
 * The OTA related information.
 *
 * @discussion The deviceInfo is determined when -[RTKOTAUpgradeDelegate OTAUpgradeDidGetReadyForUpgrade:] get called.
 */
@property (nonatomic, nullable) RTKOTADeviceInfo *deviceInfo;

/**
 * The image is current upgrading.
 */
@property (readonly, nullable) RTKOTAUpgradeBin *upgradingImage;


@property (nonatomic, readonly) RTKDFUPhase phase;

/**
 * Start upgrade image.
 */
- (void)upgradeImage:(RTKOTAUpgradeBin *)image;

/**
* Cancel ongoing upgrade.
*/
- (void)cancelUpgrade;


@end

NS_ASSUME_NONNULL_END
