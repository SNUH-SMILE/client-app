//
//  PPGCDSocketProvider.h
//  Library
//
//  Created by Uracle Lab on 12. 7. 11..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPAbstractSocketNetworkManager.h"

@class GCDAsyncSocket;

@protocol PPGCDSocketProviderDelegate;

@interface PPGCDSocketProvider : NSObject {

@private
    // Delegate
    id<PPGCDSocketProviderDelegate,PPAbstractSocketNetworkManager> _delegate;
    
    // Socket 
    GCDAsyncSocket*     _socket;
    
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

@property (nonatomic, retain) id<PPGCDSocketProviderDelegate,PPAbstractSocketNetworkManager> delegate;

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

@protocol PPGCDSocketProviderDelegate <NSObject>

@required

- (void) provider:(PPGCDSocketProvider *)provider didReadData:(NSData *)data;

- (void) providerDidDisconnect:(PPGCDSocketProvider *)provider withError:(NSError *)err;

@optional

- (PPSocketHandShakeSatus) provider:(PPGCDSocketProvider *)provider didReadHandshakeData:(NSData *)data;

- (NSData *) encryptionData:(PPGCDSocketProvider *)provider withPlainData:(NSData *)data;

- (void) uploadingHttpPostProvider:(PPGCDSocketProvider*)provider 
                         totalsize:(NSNumber*)totalsize 
                           cursize:(NSNumber*)cursize 
                          userdata:(NSArray*)userdata;

- (void) downloadingHttpPostProvider:(PPGCDSocketProvider*)provider 
                           totalsize:(NSNumber*)totalsize 
                             cursize:(NSNumber*)cursize 
                            userdata:(NSArray*)userdata;

@end