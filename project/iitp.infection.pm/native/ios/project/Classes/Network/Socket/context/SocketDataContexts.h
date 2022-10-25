//
//  SocketDataContexts.h
//  MorpheusProject
//
//  Created by Uracle Lab on 12. 7. 4..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SocketDataContext.h"

@interface SocketDataContexts : NSObject 

@property (nonatomic, retain) NSMutableDictionary* contexts;

+ (SocketDataContexts*)getInstance;

- (void)removeContextForKey:(NSNumber *)aKey;

- (void)removeContextForUIntKey:(unsigned int)aKey;

- (void)removeAllContext;

- (void)setContext:(SocketDataContext *)context forKey:(NSNumber *)aKey;

- (SocketDataContext *)contextForKey:(NSNumber *)aKey;

- (SocketDataContext *)contextForUIntKey:(unsigned int)aKey;

- (NSUInteger)count;

- (NSEnumerator *)keyEnumerator;

- (SocketDataContext *)lastObject;

- (SocketDataContext *)firstObject;

- (NSNumber *)uniqueKey;

@end
