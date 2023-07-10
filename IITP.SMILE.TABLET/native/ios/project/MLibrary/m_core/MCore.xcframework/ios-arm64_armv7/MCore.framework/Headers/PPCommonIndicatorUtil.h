//
//  PPNaviIndicatorUtil.h
//  Library
//
//  Created by Uracle Lab on 11. 7. 1..
//  Copyright 2011. All rights reserved.
//

#import <Foundation/Foundation.h>

#define INDICATOR_TAG 999999

@interface PPCommonIndicatorUtil : NSObject {
    
}

+ (void) simpleActivityIndicatorStart:(UIView*)aView message:(NSString*)aMessage;

+ (void) simpleActivityIndicatorStop:(UIView*)aView;

@end
