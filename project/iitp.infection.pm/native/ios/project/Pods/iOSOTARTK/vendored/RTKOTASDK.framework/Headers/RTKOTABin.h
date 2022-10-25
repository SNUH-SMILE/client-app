//
//  RTKOTABin.h
//  RTKOTASDK
//
//  Created by jerome_gu on 2019/4/16.
//  Copyright © 2019 Realtek. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RTKOTAFormat.h"


NS_ASSUME_NONNULL_BEGIN

/**
 * A general OTA bin.
 */
@interface RTKOTABin : NSObject

/* Bin type */
@property (readonly) RTKOTAImageType type;


/**
 * Version in integer.
 */
@property (readonly) uint32_t version;


/**
 * The binary name.
 */
@property (readonly) NSString *name;

/**
 * Human-readable version string.
 */
@property (readonly) NSString *versionString;


- (NSComparisonResult)compareVersionWith:(RTKOTABin *)anotherBin;


@end


NS_ASSUME_NONNULL_END
