//
//  RTKLEOTACoordinator.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2020/3/19.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import "RTKOTACoordinator.h"
#import <CoreBluetooth/CoreBluetooth.h>

NS_ASSUME_NONNULL_BEGIN

@class RTKLEOTACoordinator;
@protocol RTKLEOTACoordinatorDelegate <RTKOTACoordinatorDelegate>
@optional
- (BOOL)OTACoordinator:(RTKLEOTACoordinator *)coordinator shouldUpgradeSilentlyOf:(CBPeripheral *)peripheral;

- (void)OTACoordinator:(RTKLEOTACoordinator *)coordinator willConnectToOTAModelPeripheralOf:(CBPeripheral *)peripheral;
- (void)OTACoordinator:(RTKLEOTACoordinator *)coordinator didConnectOTAModePeripheral:(CBPeripheral *)peripheral originalPeripheral:(CBPeripheral *)peripheral;
- (void)OTACoordinator:(RTKLEOTACoordinator *)coordinator willConnectToCompanionPeripheralOf:(CBPeripheral *)peripheral;

@end


@interface RTKLEOTACoordinator : RTKOTACoordinator

- (instancetype)initWithExistCentralManager:(nullable CBCentralManager *)central;

@property (readonly) CBCentralManager *centralManager;

@property (nonatomic, weak) id<RTKLEOTACoordinatorDelegate> delegate;

- (void)prepareForPeripheral:(CBPeripheral *)peripheral;

@property (nonatomic, readonly, nullable) CBPeripheral *upgradingPeripheral;

@end

NS_ASSUME_NONNULL_END
