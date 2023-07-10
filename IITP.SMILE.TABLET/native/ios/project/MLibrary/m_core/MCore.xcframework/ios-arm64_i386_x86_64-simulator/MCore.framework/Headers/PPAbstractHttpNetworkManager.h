//
//  PPAbstractNetworkManager.h
//  Library
//
//  Created by  on 11. 10. 24..
//  Copyright (c) 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

#import "PPNetworkOption.h"
#import "PPNetworkManager.h"

@interface PPAbstractHttpNetworkManager : NSObject<PPNetworkManager> {
    NSString*        _url;
    NSTimeInterval   _timeout;
    NSString*        _strEncoding;
    NSStringEncoding _encoding;
    NSString        *_resourceUpdateURI;
}
@property (nonatomic, copy)   NSString*        url;
@property (nonatomic, assign) NSTimeInterval   timeout;
@property (nonatomic, copy)   NSString*        strEncoding;
@property (nonatomic, assign) NSStringEncoding encoding;
@property (nonatomic, copy)   NSString*        resourceUpdateURI;

@property (nonatomic, assign) unsigned int userClickCancelButton; // for KVO

//+ (id<PPNetworkManager>) getInstance;

- (BOOL) checkManager:(PPNetworkOption*)networkoption;

- (void) cancelObserverAdd:(id)_provider;
- (void) cancelObserverRemove:(id)_provider;
- (void) cancelClicked;

@end
