//
//  RTKLEProfile.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/4/10.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

#import "RTKLEPeripheral.h"


NS_ASSUME_NONNULL_BEGIN

@class RTKLEProfile;


/**
 * The RTKLEProfileDelegate protocol defines methods that a delegate of a RTKLEProfile object must adopt.
 */
@protocol RTKLEProfileDelegate <NSObject>
@required
/**
 * Invoked when the underlying central manager’s state is updated.
 * @discussion Commands should only be issued when the underlying central manager state is <code>CBCentralManagerStatePoweredOn</code>
 */
- (void)profileManagerDidUpdateState:(RTKLEProfile *)profile;


@optional

/**
 * Invoked when the Profile discovers a peripheral while scanning.
 *
 * @discussion Depend on the concrete Profile class, only interested peripheral is discovered. The discovered peripheral is typically a subclass of RTKLEPeripheral, which may provide more methods to operate with peripheral.
 */
- (void)profile:(RTKLEProfile *)profile didDiscoverPeripheral:(RTKLEPeripheral *)peripheral;


/**
 * Invoked when a connection is successfully created with a peripheral.
 *
 * @discussion You typically implement this method to perform specific operation.
 */
- (void)profile:(RTKLEProfile *)profile didConnectPeripheral:(RTKLEPeripheral *)peripheral;

/**
 * Invoked when the central manager fails to create a connection with a peripheral.
 *
 * @discussion Not like the CBCentralManager, this connect methods of RTKLEProfile will time out. When connection time out, the error parameter has a RTKErrorTimeout code.
 */
- (void)profile:(RTKLEProfile *)profile didFailToConnectPeripheral:(RTKLEPeripheral *)peripheral error:(nullable NSError *)error;

/**
 * Invoked when an existing connection with a peripheral is torn down.
 */
- (void)profile:(RTKLEProfile *)profile didDisconnectPeripheral:(RTKLEPeripheral *)peripheral error:(nullable NSError *)error;

@end



/**
 * RTKLEProfile objects are used to manage scanning, connecting to peripherals.
 *
 * @discussion Before you call any methods, the underlying CBCentralManager should be in CBManagerStatePoweredOn state.
 */
@interface RTKLEProfile : NSObject <CBCentralManagerDelegate> {
    @protected
    CBCentralManager *_centralManager;
}

// Protected accessors
@property (readonly) CBCentralManager *centralManager;


/**
 * The delegate that will receive scaning or connection events.
 */
@property (weak) id <RTKLEProfileDelegate> delegate;


@property (nullable, readonly) NSMutableArray <RTKLEPeripheral*> *managedPeripherals;

/**
 * The interested advertising services.
 * When in scaning, only peripheral which is advertising specified services is returned. This is template method, which means you should override it in subclass.
 */
+ (nullable NSArray<CBUUID *> *)advertiseServiceUUIDs;

/**
 * The class used to create peripheral instance.
 * This class should be a subclass of RTKLEPeripheral.
 */
+ (Class)concretePeripheralClass;


// Scan expected peripheral nearby.
@property (readonly) BOOL isScaning;

- (void)scanForPeripherals;

- (void)scanForPeripheralsWithDuplicateReport;

- (void)stopScan;


/* Deprecated */
/*
- (void)addPeripheral:(RTKLEPeripheral *)peripheral;
- (void)removePeripheral:(RTKLEPeripheral *)peripheral;
- (void)removeAllPeripherals;

- (void)touch:(RTKLEPeripheral *)peripheral;
*/


- (NSArray <RTKLEPeripheral*> *)peripheralsUsingCBPeripheral:(CBPeripheral *)peripheral;

- (nullable RTKLEPeripheral *)instantiatePeripheralWithCBPeripheral:(CBPeripheral *)peripheral;

@end


#define RTKDistantInterval 31536000.

@interface RTKLEProfile (Connection)

// Connect to peripheral with default timeout interval. (10s)
// If connection succeed, -didConnectPeripheral will be invoked. otherwise -didFailToConnectPeripheral will be invoked.
- (void)connectTo:(RTKLEPeripheral *)peripheral;

- (void)connectTo:(RTKLEPeripheral *)peripheral withTimeout:(NSTimeInterval)timeout;

- (void)cancelConnectionWith:(RTKLEPeripheral *)peripheral;

- (void)cancelAllPeripheralConnections;


/* Protected */
- (void)_connectTo:(RTKLEPeripheral *)peripheral withTimeout:(NSTimeInterval)timeout completionHandler:(nullable RTKLECompletionBlock)handler;

- (void)validatePeripheralAndOpen:(RTKLEPeripheral *)peripheral withCompletion:(RTKLECompletionBlock)handler;

@end

NS_ASSUME_NONNULL_END
