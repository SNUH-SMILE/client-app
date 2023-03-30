//
//  PPSocketProvider.h
//  Library
//
//  Created by  on 11. 10. 11..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPAbstractSocketNetworkManager.h"

@class MPAsyncSocketLibrary;

@protocol PPSocketProviderDelegate;

@interface PPSocketProvider : NSObject {
@private
    
    // Delegate
    id<PPSocketProviderDelegate,PPAbstractSocketNetworkManager> _delegate;
    
    // Socket 
    MPAsyncSocketLibrary*   _socket;
    
    // Timeout
    NSTimeInterval _connectTimeout;
    NSTimeInterval _writeTimeout;
    NSTimeInterval _readTimeout;
    
    // Recevie data buffer
    NSMutableData* _receiveBuffer;
    
//    // Send data buffer
//    // 핸드 쉐이킹이 되기 전까지의 내용을 저장함.
//    NSData* _tempSendData;
    
    // Receive data size
	UInt16         _recvHeadSize;
	UInt16         _recvBodySize;
	UInt16         _recvTailSize;
    
    // Server info
	NSString*      _host;
	UInt16         _port;
 
    PPSocketConnectSatus      _connectSatus;
    
    BOOL                      _handshakeDone;
    BOOL                      _needHandshake;
}

@property (nonatomic, retain) id<PPSocketProviderDelegate,PPAbstractSocketNetworkManager> delegate;

@property (nonatomic, assign) NSTimeInterval connectTimeout;
@property (nonatomic, assign) NSTimeInterval writeTimeout;
@property (nonatomic, assign) NSTimeInterval readTimeout;

@property (nonatomic, assign) UInt16         recvHeadSize;
@property (nonatomic, assign) UInt16         recvBodySize;
@property (nonatomic, assign) UInt16         recvTailSize;

@property (nonatomic, copy)   NSString*      host;
@property (nonatomic, assign) UInt16         port;

@property (nonatomic, assign) PPSocketConnectSatus  connectSatus;
@property (nonatomic, assign) BOOL           needHandshake;
@property (nonatomic, assign) BOOL           handshakeDone;

//@property (nonatomic, retain) NSData  *tempSendData;
- (PPSocketConnectSatus) connect;

- (void) disconnect;

- (BOOL) isConnected;

- (void) writeData:(NSData*)message;

- (void) writeRawData:(NSData*)message;
@end


@protocol PPSocketProviderDelegate <NSObject>

@required

- (void) provider:(PPSocketProvider *)provider willDisconnectWithError:(NSError *)err;

- (void) provider:(PPSocketProvider *)provider didReadData:(NSData *)data;

- (void) providerDidDisconnect:(PPSocketProvider *)provider;

@optional

- (PPSocketHandShakeSatus) provider:(PPSocketProvider *)provider didReadHandshakeData:(NSData *)data;

- (NSData *) encryptionData:(PPSocketProvider *)provider withPlainData:(NSData *)data;

- (void) uploadingHttpPostProvider:(PPSocketProvider*)provider 
                         totalsize:(NSNumber*)totalsize 
                           cursize:(NSNumber*)cursize 
                          userdata:(NSArray*)userdata;

- (void) downloadingHttpPostProvider:(PPSocketProvider*)provider 
                           totalsize:(NSNumber*)totalsize 
                             cursize:(NSNumber*)cursize 
                            userdata:(NSArray*)userdata;

@end
