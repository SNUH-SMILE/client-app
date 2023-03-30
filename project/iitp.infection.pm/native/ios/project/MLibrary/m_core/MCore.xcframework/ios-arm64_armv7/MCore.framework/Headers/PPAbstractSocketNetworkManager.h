//
//  PPAbstractSocketNetworkManager.h
//  Library
//
//  Created by  on 11. 10. 24..
//  Copyright (c) 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPNetworkManager.h"
#import "PPNetworkOption.h"
#import "PPNavigationController.h"

typedef enum __PPSocketHandShakeSatus {
    PPSocketHandShakeSatusSTART,
    PPSocketHandShakeSatusREPEATKEYINIT,
    PPSocketHandShakeSatusOK,
    PPSocketHandShakeSatusFAIL
} PPSocketHandShakeSatus;

typedef enum __PPSocketConnectSatus {
    PPSocketConnectSatusNONE = 0x00,
    PPSocketConnectSatusCONNECTING,
    PPSocketConnectSatusCONNECTED
} PPSocketConnectSatus;

typedef enum PPSocketReceiveSatus {
    PPSocketReceiveSatusHead,
    PPSocketReceiveSatusBody,
    PPSocketReceiveSatusTail
} PPSocketReceiveSatus;


@protocol PPAbstractSocketNetworkManager <NSObject>

- (UInt16) bodySize:(NSData*)head;

- (void) releaseTheLock;

- (void) initProvider;

- (BOOL) startHandshake;  // init and start
@end

@interface PPAbstractSocketNetworkManager : NSObject<PPNetworkManager> {
    NSString*               _host;
    UInt16                  _port;
    NSTimeInterval          _timeout;
    NSStringEncoding        _encoding;
    PPNavigationController* _naviCtrl;
}

@property (nonatomic, copy)   NSString*               host;
@property (nonatomic, assign) UInt16                  port;
@property (nonatomic, assign) NSTimeInterval          timeout;
@property (nonatomic, assign) NSStringEncoding        encoding;
@property (nonatomic, retain) PPNavigationController* naviCtrl;

- (BOOL) checkManager:(PPNetworkOption*)networkoption;

@end
