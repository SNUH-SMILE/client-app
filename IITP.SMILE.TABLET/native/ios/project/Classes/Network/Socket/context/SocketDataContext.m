//
//  SocketDataContext.m
//  MorpheusProject
//
//  Created by Uracle Lab on 12. 7. 4..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import "SocketDataContext.h"

@interface SocketDataContext () {
    UIViewController* _ctrl;
    NSString*         _trcode;
    NSObject*         _data;
    PPNetworkOption*  _networkOption;
    NSObject<PPNetworkManagerDelegate>* _delegate;
    NSArray*          _userInfo;
    NSTimer*       _timer;
    NSTimeInterval _connectionCount;
    
    BOOL    _sended;
    BOOL    _recivded;
    
    NSDate* _timestamp;
}

@end

@implementation SocketDataContext

@synthesize ctrl          = _ctrl;
@synthesize trcode        = _trcode;
@synthesize data          = _data;
@synthesize networkOption = _networkOption;
@synthesize delegate      = _delegate;
@synthesize userInfo      = _userInfo;

@synthesize sended;
@synthesize recivded;
@synthesize timestamp;

@synthesize contextDelegate = _contextDelegate;

#pragma mark -
#pragma mark init and delloc method

- (id)init {
    self = [super init];
    if (self) {
        _connectionCount = -1;
    }
    return self;
}

+ (id)context {
    return [[self alloc] init];
}

- (void)dealloc {
    [self stopTimer];
}

#pragma mark -
#pragma mark context methods

- (void)startTimer:(NSTimeInterval)timeout {
    _connectionCount = timeout;
    _timer = [NSTimer scheduledTimerWithTimeInterval:(1.0f) 
                                              target:self 
                                            selector:@selector(checkNetworkDisconnect) 
                                            userInfo:nil 
                                             repeats:YES];
}

- (void)stopTimer  {
    if ([_timer isValid])  {
        [_timer invalidate];
        _timer = nil;
    }
    else  {
        _timer = nil;
    }
}

- (void)checkNetworkDisconnect {
	if (_connectionCount > 0) {
		_connectionCount--;
        
		if (_connectionCount == 0) {
			_connectionCount = -1;
            
            [_timer invalidate];
            _timer = nil;
            
            if ([_contextDelegate respondsToSelector:@selector(didTimeoutContext:)])  {
                [_contextDelegate didTimeoutContext:self];
            }
		}
	}
}

@end
