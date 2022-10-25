//
//  SocketDataContexts.m
//  MorpheusProject
//
//  Created by Uracle Lab on 12. 7. 4..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import "SocketDataContexts.h"
#import "PPIndicatorUtil.h"

@interface SocketDataContext () {
    NSMutableDictionary* _contexts;
}

@end

@implementation SocketDataContexts

@synthesize contexts = _contexts;

#pragma mark -
#pragma mark init and delloc method

+ (SocketDataContexts*) getInstance {
    static SocketDataContexts* sharedInstance;
	@synchronized(self) {
		if(!sharedInstance) {
			sharedInstance = [[[self class] alloc] init];
			return sharedInstance;
		}
	}
	return sharedInstance;
}

- (id)init {
    self = [super init];
    if (self) {
        _contexts = [[NSMutableDictionary alloc] init];
    }
    return self;
}

- (void)dealloc {
    
}

#pragma mark -
#pragma mark contexts methods

- (void)removeContextForKey:(NSNumber *)aKey {
    if (![aKey isKindOfClass:[NSNumber class]]) {
        return;
    }
    
    SocketDataContext* context = [self contextForKey:aKey];
    PPDebug(@"removeContextForKey : %@", aKey);
    [context stopTimer];
    
    if ([[context ctrl] isKindOfClass:[UIViewController class]] && [[context networkOption] indicator]) {
        [PPIndicatorUtil simpleActivityIndicatorStop:context.ctrl.view];
    }

    [_contexts removeObjectForKey:aKey];
}

- (void)removeContextForUIntKey:(unsigned int)aKey {
    NSNumber* key = [NSNumber numberWithUnsignedInt:aKey];
    
    [self removeContextForKey:key];
}

- (void)removeAllContext {
    for (NSNumber* key in _contexts) {
        [self removeContextForKey:key];
    }
}

- (void)setContext:(SocketDataContext *)context forKey:(NSNumber *)aKey  {
    if (![context isKindOfClass:[SocketDataContext class]] || ![aKey isKindOfClass:[NSNumber class]]) {
        return;
    }

    [_contexts setObject:context forKey:aKey];
}

- (NSUInteger)count {
    return [_contexts count];
}

- (SocketDataContext *)contextForKey:(NSNumber *)aKey {
    if (![aKey isKindOfClass:[NSNumber class]]) {
        return nil;
    }
    
    SocketDataContext* context = [_contexts objectForKey:aKey];
    
    if (![context isKindOfClass:[SocketDataContext class]]) {
        return nil;
    }
    return context;
}

- (SocketDataContext *)contextForUIntKey:(unsigned int)aKey {
    NSNumber* key = [NSNumber numberWithUnsignedInt:aKey];
    
    return [self contextForKey:key];
}

- (NSEnumerator *) keyEnumerator {
    return [_contexts keyEnumerator];
}

- (SocketDataContext *)lastObject {
    SocketDataContext* _buffer = nil;
    
    for (NSNumber* aKey in _contexts) {
        SocketDataContext* context = [self contextForKey:aKey];
        
        if(!_buffer) {
            _buffer = context;
            continue;
        }

        // context가 _buffer 보다 나중(새로운) 날짜인경우 교체
        if([[context timestamp] compare:[_buffer timestamp]] == NSOrderedAscending) {
            _buffer = context;
        }
    }

    return _buffer;
}

- (SocketDataContext *)firstObject {
    SocketDataContext* _buffer = nil;
    
    for (NSNumber* aKey in _contexts) {
        SocketDataContext* context = [self contextForKey:aKey];

        if (!_buffer)  {
            _buffer = context;
            continue;
        }

        // context가 _buffer 보다 이전(오래된) 날짜인경우 교체
        if ([[context timestamp] compare:[_buffer timestamp]] == NSOrderedDescending) {
            _buffer = context;
        }
    }

    return _buffer;
}

- (NSNumber *)uniqueKey {
    NSNumber* number = nil;

    while (true) {
        number = [NSNumber numberWithUnsignedInt:(rand() % 65536)];

        if (![_contexts objectForKey:number]) {
            break;
        }

        number = nil;
    }

    return number;
}

@end
