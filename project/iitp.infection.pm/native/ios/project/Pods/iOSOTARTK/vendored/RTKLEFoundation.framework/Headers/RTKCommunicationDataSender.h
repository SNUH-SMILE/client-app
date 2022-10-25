//
//  RTKCommunicationDataSender.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2020/1/21.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKPackageCommunication.h"
#import "RTKLEGeneralDefines.h"


NS_ASSUME_NONNULL_BEGIN

@interface RTKCommunicationDataSender : NSObject

- (instancetype)initWithCommunication:(RTKPackageCommunication *)communication MTU:(NSUInteger)size;

@property (nonatomic, readonly) RTKPackageCommunication *communication;
@property (nonatomic, readonly) NSUInteger mtu;


@property (nonatomic, readonly) BOOL inProgress;
- (void)sendData:(NSData *)data withCompletionHandler:(RTKLECompletionBlock)handler;

@property (nonatomic, readonly) NSData *sendingData;
@property (nonatomic, readonly) RTKLECompletionBlock completionHandler;

- (void)cancelInProgressSending;

@end

NS_ASSUME_NONNULL_END
