//
//  RTKCommunicationDataReceiver.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2020/1/21.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKPackageCommunication.h"

NS_ASSUME_NONNULL_BEGIN

@interface RTKCommunicationDataReceiver : NSObject {
    @protected
    BOOL _inProgress;
}

@property (nonatomic, readonly) RTKPackageCommunication *communication;
- (instancetype)initWithCommunication:(RTKPackageCommunication *)communication;


@property (nonatomic, readonly) BOOL inProgress;
- (void)startReceiveWithCompletionHandler:(void(^)(BOOL success, NSError *err, NSData *_Nullable receivedData))handler;

- (void)didReceiveDataSlice:(NSData *)dataSlice;

//- (void)cancelInProgressReceiving;


/* Protected */
@property (readonly) NSMutableData *receivingData;
@property (readonly) void(^completionHandler)(BOOL success, NSError *_Nullable err, NSData *_Nullable data);

@end

NS_ASSUME_NONNULL_END
