//
//  SocketDataContext.h
//  MorpheusProject
//
//  Created by Uracle Lab on 12. 7. 4..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol SocketDataContextDelegate, SocketDataNetworManagerDelgeate, PPNetworkManagerDelegate;

@interface SocketDataContext : NSObject 

@property (nonatomic, retain) UIViewController* ctrl;
@property (nonatomic, copy)   NSString*         trcode;
@property (nonatomic, retain) NSObject*         data;
@property (nonatomic, retain) PPNetworkOption*  networkOption;
@property (nonatomic, retain) NSObject<PPNetworkManagerDelegate>* delegate;
@property (nonatomic, retain) NSArray*          userInfo;
@property (nonatomic, assign) NSObject<SocketDataContextDelegate>* contextDelegate;
@property (nonatomic, assign) BOOL    sended;
@property (nonatomic, assign) BOOL    recivded;
@property (nonatomic, retain) NSDate* timestamp;

+ (id)context;

- (void)startTimer:(NSTimeInterval)timeout;

- (void)stopTimer;

@end

@protocol SocketDataContextDelegate <NSObject>

- (void) didTimeoutContext:(SocketDataContext *)context;

@end
