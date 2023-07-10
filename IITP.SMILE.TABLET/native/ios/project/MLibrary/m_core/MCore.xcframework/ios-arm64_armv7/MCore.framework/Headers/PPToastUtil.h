//
//  PPToastUtil.h
//  Library
//
//  Created by Uracle Lab on 11. 8. 8..
//  Copyright 2011. All rights reserved.
//

#import <Foundation/Foundation.h>

//문서상의 시간으로 변경 8000->3500 / 4000->2000
typedef enum PPToastDuration {
    PPToastDurationLong = 3500,
    PPToastDurationShort = 2000
} PPToastDuration;

@interface PPToastUtil : NSObject {
    
}

+ (void) createSimpleToast:(NSString*)aMessage duration:(PPToastDuration)duration;

@end
