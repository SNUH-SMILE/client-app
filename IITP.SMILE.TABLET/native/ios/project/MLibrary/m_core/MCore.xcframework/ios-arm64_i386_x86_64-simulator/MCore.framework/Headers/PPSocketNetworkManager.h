//
//  PPSocketNetworkManager.h
//  Library
//
//  Created by  on 11. 10. 12..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPNetworkManager.h"

@protocol PPSocketNetworkManager <PPNetworkManager>

- (UInt16) bodySize:(NSData*)head;

- (void) releaseTheLock;

@end