//
//  RTKLog.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/21.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Log level of this module, not global.
 */
typedef NS_ENUM(NSUInteger, RTKLogLevel) {
    RTKLogLevelOff       = 0,
    RTKLogLevelError,
    RTKLogLevelWarning,
    RTKLogLevelInfo,
    RTKLogLevelDebug,
    RTKLogLevelVerbose,
};


/**
 * Module Log related interface class.
 * @discussion The log system print log messsage to Console and Files simultaneously. 
 */
@interface RTKLog : NSObject

/**
 * Set log level of this module
 * @see RTKLogLevel
 */
+ (void)setLogLevel:(RTKLogLevel)level;


/* Internal used log method */
+ (void)_logWithLevel:(RTKLogLevel)level format:(NSString *)format, ...;

@end

NS_ASSUME_NONNULL_END
