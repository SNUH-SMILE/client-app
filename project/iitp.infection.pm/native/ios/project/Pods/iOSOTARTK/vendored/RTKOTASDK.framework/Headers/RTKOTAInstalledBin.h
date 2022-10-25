//
//  RTKOTAInstalledBin.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2020/5/25.
//  Copyright © 2020 jerome_gu. All rights reserved.
//

#import "RTKOTABin.h"

typedef NS_ENUM(NSUInteger, RTKOTABinBankInfo) {
    RTKOTABinBankInfo_Unknown,
    RTKOTABinBankInfo_Bank0,
    RTKOTABinBankInfo_Bank1,
    RTKOTABinBankInfo_Standalone,
};

NS_ASSUME_NONNULL_BEGIN

@interface RTKOTAInstalledBin : RTKOTABin

/**
 * Which bank this image installed in, or should be upgraded in.
 */
@property (readonly) RTKOTABinBankInfo bankState;

/**
 * The maximum length of thie image section in SOC.
 * @discussion When 0 is returned, section size is undefined.
 */
@property (readonly) NSUInteger sectionSize;

@end

NS_ASSUME_NONNULL_END
