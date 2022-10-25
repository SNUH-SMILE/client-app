//
//  RTKPeripheralCharacteristicOperation.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/7.
//  Copyright © 2019 Realtek. All rights reserved.
//

#ifndef RTKPeripheralCharacteristicOperation_h
#define RTKPeripheralCharacteristicOperation_h

#import <CoreBluetooth/CoreBluetooth.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RTKPeripheralCharacteristicRead <NSObject>
@property (readonly, nonatomic) CBCharacteristic *readCharacteristic;
- (void)didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic;
- (void)didUpdateNotificationStateForCharacteristic:(CBCharacteristic *)characteristic;
@end


@protocol RTKPeripheralCharacteristicWrite <NSObject>
@property (readonly, nonatomic) CBCharacteristic *writeCharacteristic;
- (void)didWriteValueForCharacteristic:(CBCharacteristic *)characteristic error:(nullable NSError *)error;
@end


NS_ASSUME_NONNULL_END

#endif /* RTKPeripheralCharacteristicOperation_h */
