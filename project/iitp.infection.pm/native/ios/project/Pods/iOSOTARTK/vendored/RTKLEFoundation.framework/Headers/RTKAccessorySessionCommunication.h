//
//  RTKAccessorySessionCommunication.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2020/3/3.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKLEGeneralDefines.h"
#import "RTKPackageCommunication.h"
#import "RTKAccessory.h"


NS_ASSUME_NONNULL_BEGIN

/**
 * A communication channel with an remote accessory.
 */
@interface RTKAccessorySessionCommunication : RTKPackageCommunication

/**
 * The communication protocol.
 */
@property (nonatomic, readonly) NSString *protocolString;

/**
 * Initialize the communication object with specific accessory and protocol.
 */
- (instancetype)initWithAccessory:(RTKAccessory *)accessory forProtocol:(nonnull NSString *)protocolString;

/**
 * The communication end point.
 */
@property (nonatomic, readonly) RTKAccessory *accessory;

@end

NS_ASSUME_NONNULL_END
