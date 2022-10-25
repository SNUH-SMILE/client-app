//
//  RTKCharacteristicReadWrite.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/10.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>

#import "RTKLEPeripheral.h"
#import "RTKPackageCommunication.h"
#import "RTKPeripheralCharacteristicOperation.h"

NS_ASSUME_NONNULL_BEGIN

@interface RTKCharacteristicReadWrite : RTKPackageCommunication <RTKPeripheralCharacteristicRead, RTKPeripheralCharacteristicWrite>

- (instancetype)initWithPeripheral:(RTKLEPeripheral*)peripheral read:(nullable CBCharacteristic *)readCharacteristic write:(nullable CBCharacteristic *)writeCharacteristic;

@property (class, readonly) BOOL writeReliably;

@end

@interface RTKCharacteristicReadWriteWithoutResponse : RTKCharacteristicReadWrite

@end

@interface RTKCharacteristicReadWriteArbitrarily : RTKCharacteristicReadWrite

@end


NS_ASSUME_NONNULL_END
