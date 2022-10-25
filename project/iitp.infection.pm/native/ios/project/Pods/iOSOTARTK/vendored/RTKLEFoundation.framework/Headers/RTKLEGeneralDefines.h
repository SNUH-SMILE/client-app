//
//  RTKLEGeneralDefines.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/4/10.
//  Copyright © 2019 Realtek. All rights reserved.
//

#ifndef RTKLEGeneralDefines_h
#define RTKLEGeneralDefines_h

#import <Foundation/Foundation.h>

typedef void(^RTKLECompletionBlock)(BOOL success, NSError *_Nullable error);


#pragma pack(push, 1)
/**
 * BDAddress Type
 */
typedef union {
    struct {
        uint8_t part0;
        uint8_t part1;
        uint8_t part2;
        uint8_t part3;
        uint8_t part4;
        uint8_t part5;
    } components;
    struct {
        uint64_t intValue : 48;
    } value;
    struct {
        uint16_t NAP;
        uint8_t UAP;
        uint32_t LAP : 24;
    } parts;
} BDAddressType;

#pragma pack(pop)


#define BDAddressIsValid(addr) ((addr).parts.NAP>0 && (addr).parts.UAP>0)
#define BDAddressIsEqual(addr1, addr2) ((addr1).value.intValue == (addr2).value.intValue)
#define BDAddressString(addr) [NSString stringWithFormat:@"%.2x:%.2x:%.2x:%.2x:%.2x:%.2x", (addr).components.part0, (addr).components.part1, (addr).components.part2, (addr).components.part3, (addr).components.part4, (addr).components.part5]

#endif /* RTKLEGeneralDefines_h */
