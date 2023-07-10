//
//  PPNetworkManagerPool.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 18..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPNetworkManager.h"

#define GET_NETWORK_MANGER(_t) [[PPNetworkManagerPool getInstance] managerForKey:_t]

@interface PPNetworkManagerPool : NSObject {
	@private
	NSMutableDictionary *_pool;
}

@property (nonatomic, readonly) NSMutableDictionary *pool;

+ (PPNetworkManagerPool *) getInstance;

- (NSObject <PPNetworkManager> *) managerForKey: (NSString *) key;


@end