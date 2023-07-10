//
//  MPAppMain.h
//  Library
//
//  Created by Uracle Lab on 11. 7. 4..
//  Copyright 2011. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PPNavigationController.h"

@interface MPAppMain : NSObject {
    
}

+ (PPNavigationController*) mcoreInitWithHistory:(BOOL)history
                                      parameters:(NSDictionary*)parameters;

@end
