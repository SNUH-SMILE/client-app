//
//  PPHttpBaseProvider.h
//  Library
//
//  Created by  on 11. 11. 22..
//  Copyright (c) 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPHttpProviderDelegate.h"

typedef enum {
	PPHttpBasePostProvide, // Default
	PPHttpBaseFormDataProvide,
    PPHttpBaseGetProvide,
    PPHttpBasePutProvide,
    PPHttpBaseDeleteProvide,
    PPHttpBasePatchProvide,
} PPHttpBaseProvideType;

typedef enum {
    ERROR_CANCEL = 9995,
    ERROR_CONNECTION    = 9996,
    ERROR_TRANSFERING_NETWORK  = 9997,
    ERROR_INTERNAL_NETWORK   = 9997,
    ERROR_WAITING_TIMEOUT  = 9998,
    ERROR_CANT_FIND_NETWORK  = 404,
    ERROR_RETUREND_SERVER_ERROR    = 9999,
    ERROR_URL    = 9994
} PPHttpErrorType;

//@protocol PPHttpBaseProviderDelegate;

@interface PPHttpBaseProvider : NSObject<NSURLConnectionDelegate,NSURLSessionDelegate>
{
    id<PPHttpProviderDelegate> _delegate;
    NSString*             _url;
    PPHttpBaseProvideType _type;
    NSArray*              _userData;
    NSTimeInterval        _timeout;
    
    // inner valiable
    NSURLConnection*      _connection;
    NSURLSession   *      _currentSession;
    NSMutableURLRequest*  _request;
    NSHTTPURLResponse*    _response;
    NSMutableData*        _receivedData;
    // timer
    NSTimer*              _timer;
    NSTimeInterval        _connectionCount;
    Class                _exNetworkIndicatorClass;
}

@property (nonatomic, retain) id<PPHttpProviderDelegate> delegate;
@property (nonatomic, copy)   NSString*             url;
@property (nonatomic, assign) PPHttpBaseProvideType type;
@property (nonatomic, retain) NSArray*              userData;
@property (nonatomic, assign) NSTimeInterval        timeout;
@property (nonatomic, retain) Class                exNetworkIndicatorClass;
@property (nonatomic) BOOL useUntrustedCert;

#pragma mark -
#pragma mark init method

- (id)initWithUrl:(NSString*)url type:(PPHttpBaseProvideType)type;
- (id)initWithUrl:(NSString*)url methodTypeString:(NSString *)typeString;

#pragma mark -
#pragma mark common data setter method

- (void) setRequestHeaders:(NSDictionary*)headers;
- (void) addRequestHeader:(NSString*)header value:(NSString*)value;

#pragma mark -
#pragma mark post data setter method

- (void) appendPostData:(NSData*)data;

#pragma mark -
#pragma mark process method

- (void) startAsynchronous;
- (void) cancel;

#pragma mark -
#pragma mark indicator setup method

- (void) setIndicatorWithViewCtrl:(UIViewController *)ctrl msg:(NSString *)message cancelButton:(BOOL)buttonYN;

- (void) startAsynchronousWithURLSession;
- (void) startAsynchronousWithURLConnection;

@end



