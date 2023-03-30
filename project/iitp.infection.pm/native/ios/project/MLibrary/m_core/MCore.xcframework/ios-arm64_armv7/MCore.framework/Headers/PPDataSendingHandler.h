//
//  PPDataSendingHandler.h
//  Library
//
//  Created by  on 11. 11. 14..
//  Copyright (c) 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DataHandle.h"

typedef enum DataSendingHandlerType {
    DataSendingHandlerString = 0,
    DataSendingHandlerInt    = 1,
    DataSendingHandlerShort  = 2,
    DataSendingHandlerByte   = 3,
    DataSendingHandlerChar   = 4
} DataSendingHandlerType;

@interface PPDataSendingHandler : NSObject

- (void) bindWithString:(NSString *)string handle:(DataHandle *)handle;

@end
