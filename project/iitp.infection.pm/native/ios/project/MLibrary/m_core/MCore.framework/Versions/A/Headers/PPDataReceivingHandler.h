//
//  PPDataReceivingHandler.h
//  Library
//
//  Created by  on 11. 11. 10..
//  Copyright (c) 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DataHandle.h"

typedef enum DataReceivingHandlerType {
    DataReceivingHandlerString = 0,
    DataReceivingHandlerInt    = 1,
    DataReceivingHandlerShort  = 2,
    DataReceivingHandlerByte   = 3,
    DataReceivingHandlerCount  = 4,
    DataReceivingHandlerStart  = 5,
    DataReceivingHandlerEnd    = 6,
    DataReceivingHandlerStringAferAll    = 7
} DataReceivingHandlerType;

@interface PPDataReceivingHandler : NSObject {
@private
    NSMutableDictionary* _buffer;
    NSMutableArray*      _vo;
    NSInteger            _len;
}

- (NSString *) stringWithObject:(DataHandle *)handle template:(NSString *)tmplt;

@end
