//
//  RTKAttemptAction.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/10.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKLEPackage.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * A generic action object which encapsulate action and completion block.
 */
@interface RTKAttemptAction : NSObject

/**
 * Identifier to identify this action.
 */
@property (nonatomic, readonly) NSInteger ID;
@property (nonatomic, readonly) NSInteger subID;

@property (nonatomic) NSUInteger retryCount;
@property (nonatomic) NSTimeInterval retryInterval;

@property (readonly) BOOL isInProgress;


- (instancetype)initWithID:(NSInteger)ID subID:(NSInteger)subID action:(BOOL(^)(NSError *_Nullable* err))action completion:(void(^)(BOOL success, NSError*_Nullable err, id _Nullable obj))handler;

- (instancetype)initWithID:(NSInteger)ID action:(BOOL(^)(NSError *_Nullable* err))action completion:(void(^)(BOOL success, NSError*_Nullable err, id _Nullable obj))handler;

- (void)resume;

- (void)endEarlyWithSuccess:(BOOL)success error:(nullable NSError *)error userInfo:(nullable id)info;

@end

NS_ASSUME_NONNULL_END
