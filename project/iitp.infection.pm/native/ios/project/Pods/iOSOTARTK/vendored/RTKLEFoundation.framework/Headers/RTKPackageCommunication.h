//
//  RTKPackageCommunication.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/10.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKLEGeneralDefines.h"
#import "RTKAttemptAction.h"


NS_ASSUME_NONNULL_BEGIN

/**
 *
 */
typedef void (^RTKCommunicationSendResult)(BOOL success, NSError *_Nullable error, NSData*_Nullable supply);

/**
 *
 */
typedef void (^RTKCommunicationRequestResult)(BOOL, NSError *_Nullable, NSData*_Nullable);

typedef NS_ENUM(NSUInteger, RTKPackageCommunicationStatus) {
    RTKPackageCommunicationStatusNotOpen,
    RTKPackageCommunicationStatusOpening,
    RTKPackageCommunicationStatusOpen,
    RTKPackageCommunicationStatusClosing,
    RTKPackageCommunicationStatusClosed,
    RTKPackageCommunicationStatusErrorOccurred,   /* can not reopen*/
};


@class RTKPackageCommunication;

/**
 * 一组方法来接收Communication处理的状态变化和接收数据
 */
@protocol RTKPackageCommunicationClient <NSObject>

- (void)communicationDidChangeState:(RTKPackageCommunication *)communication;
- (void)communication:(RTKPackageCommunication *)transmission didReceive:(NSData *)data;

@end


/**
 * 通信的交互处理
 * @discussion 抽象类，实际的通信处理通过创建子类来完成
 */
@interface RTKPackageCommunication : NSObject <RTKPackageCommunicationClient> {
    @protected
    RTKPackageCommunicationStatus _state;
}

@property (readonly, nullable) RTKPackageCommunication *underlyingCommunication;
@property (readonly) RTKPackageCommunicationStatus state;


- (instancetype)initWithUnderlyingCommunication:(RTKPackageCommunication *)communication;

/**
 * 管理Communication对象的上层客户
 */
@property (readonly) NSArray <RTKPackageCommunicationClient> *upperCommunications;
- (void)addUpperCommunication:(id<RTKPackageCommunicationClient>)communication;
- (void)removeUpperCommunication:(id<RTKPackageCommunicationClient>)communication;


/**
 * 打开Communication
 * @discussion 获取系统相关资源
 */
- (void)open;


- (void)openWithCompletion:(RTKLECompletionBlock)handler;


/**
 * 关闭Communication
 * @discussion 释放系统相关资源
 */
- (void)close;


/**
 * 发送数据
 * @param handler 发送完成时的回调Block
 * @discussion 数据发送后，在handler中得到发送结果。成功发送到对端时，handler第一个参数为YES; 无法发送或未能确认超时失败，则handler第一个参数为NO. 发送结果的确定跟具体实现有关，handler不一定被调用。
 */
- (void)send:(NSData *)data completionHandler:(RTKCommunicationSendResult)handler;

@end


/**
 * 表示带ACK确认的通信机制
 */
@interface RTKPackageACKCommunication : RTKPackageCommunication
@property (readonly) NSMutableArray <RTKAttemptAction*> *pendingSends;

- (nullable RTKAttemptAction *)pendingSendOfID:(NSInteger)ID subID:(NSInteger)subID;
- (void)ackPendingSends:(RTKLEACKPackage *)ackPackage;

@end


/**
 * Request形式的通信
 */
@interface RTKRequestCommunication : RTKPackageCommunication

@property (readonly) NSMutableArray <RTKAttemptAction*> *pendingRequests;

- (void)sendRequest:(NSData *)data completionHandler:(RTKCommunicationRequestResult)handler;

- (nullable RTKAttemptAction *)pendingRequestOfID:(NSInteger)ID subID:(NSInteger)subID;

@end

NS_ASSUME_NONNULL_END
