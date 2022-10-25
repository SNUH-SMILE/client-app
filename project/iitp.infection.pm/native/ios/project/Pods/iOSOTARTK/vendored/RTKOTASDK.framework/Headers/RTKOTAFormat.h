
//
//  RTKOTAFormat.h
//  RTKLEFoundation
//
//  Created by jerome_gu on 2019/1/28.
//  Copyright © 2019 Realtek. All rights reserved.
//

#ifndef RTKOTAFileFormat_h
#define RTKOTAFileFormat_h


typedef NS_ENUM(NSUInteger, RTKOTAImageType) {
    RTKOTAImageType_Unknown = 0,
    
    // Bee
    RTKOTAImageType_Bee_Patch                       = 0x01<<0,
    RTKOTAImageType_Bee_AppBank0                    = 0x01<<1,
    RTKOTAImageType_Bee_AppBank1                    = 0x01<<2,
    RTKOTAImageType_Bee_Data                        = 0x01<<3,
    RTKOTAImageType_Bee_PatchExt                    = 0x01<<4,
    RTKOTAImageType_Bee_Config                      = 0x01<<6,
    
    // Bee 2
    RTKOTAImageType_Bee2_SOCV_CFG                   = 0x01<<0,
    RTKOTAImageType_Bee2_SystemConfig               = 0x01<<1,
    RTKOTAImageType_Bee2_OTAHeader                  = 0x01<<2,
    RTKOTAImageType_Bee2_Secure_Boot_Loader         = 0x01<<3,
    RTKOTAImageType_Bee2_ROM_PATCH                  = 0x01<<4,
    RTKOTAImageType_Bee2_APP_IMG                    = 0x01<<5,
    RTKOTAImageType_Bee2_APP_DATA1                  = 0x01<<6,
    RTKOTAImageType_Bee2_APP_DATA2                  = 0x01<<7,
    RTKOTAImageType_Bee2_APP_DATA3                  = 0x01<<8,
    RTKOTAImageType_Bee2_APP_DATA4                  = 0x01<<9,
    RTKOTAImageType_Bee2_APP_DATA5                  = 0x01<<10,
    RTKOTAImageType_Bee2_APP_DATA6                  = 0x01<<11,
    RTKOTAImageType_Bee2_APP_DATA7                  = 0x01<<12,
    RTKOTAImageType_Bee2_APP_DATA8                  = 0x01<<13,
    RTKOTAImageType_Bee2_APP_DATA9                  = 0x01<<14,
    RTKOTAImageType_Bee2_APP_DATA10                 = 0x01<<15,
    
    // SBee 2
    RTKOTAImageType_SBee2_SOCV_CFG                   = 0x01<<0,
    RTKOTAImageType_SBee2_SystemConfig               = 0x01<<1,
    RTKOTAImageType_SBee2_OTAHeader                  = 0x01<<2,
    RTKOTAImageType_SBee2_Secure_Boot_Loader         = 0x01<<3,
    RTKOTAImageType_SBee2_ROM_PATCH                  = 0x01<<4,
    RTKOTAImageType_SBee2_APP_IMG                    = 0x01<<5,
    RTKOTAImageType_SBee2_APP_DATA1                  = 0x01<<6,
    RTKOTAImageType_SBee2_APP_DATA2                  = 0x01<<7,
    RTKOTAImageType_SBee2_APP_DATA3                  = 0x01<<8,
    RTKOTAImageType_SBee2_APP_DATA4                  = 0x01<<9,
    RTKOTAImageType_SBee2_APP_DATA5                  = 0x01<<10,
    RTKOTAImageType_SBee2_APP_DATA6                  = 0x01<<11,
    RTKOTAImageType_SBee2_UPPERSTACK                 = 0x01<<12,
    RTKOTAImageType_SBee2_APP_DATA8                  = 0x01<<13,
    RTKOTAImageType_SBee2_APP_DATA9                  = 0x01<<14,
    RTKOTAImageType_SBee2_APP_DATA10                 = 0x01<<15,
    
    // BBpro (BBLite, BBpro 2 including)
    RTKOTAImageType_BBpro_SOCV_CFG                  = 0x01<<0,
    RTKOTAImageType_BBpro_SystemConfig              = 0x01<<1,
    RTKOTAImageType_BBpro_OTAHeader                 = 0x01<<2,
    RTKOTAImageType_BBpro_Secure_Boot_Loader        = 0x01<<3,
    RTKOTAImageType_BBpro_ROM_PATCH                 = 0x01<<4,
    RTKOTAImageType_BBpro_APP_IMG                   = 0x01<<5,
    RTKOTAImageType_BBpro_DSP_System                = 0x01<<6,
    RTKOTAImageType_BBpro_DSP_APP                   = 0x01<<7,
    RTKOTAImageType_BBpro_DSP_UI_PARAMETER          = 0x01<<8,
    RTKOTAImageType_BBpro_APP_UI_PARAMETER          = 0x01<<9,
    RTKOTAImageType_BBpro_EXT_IMAGE0                = 0x01<<10,
    RTKOTAImageType_BBpro_EXT_IMAGE1                = 0x01<<11,
    RTKOTAImageType_BBpro_EXT_IMAGE2                = 0x01<<12,
    RTKOTAImageType_BBpro_EXT_IMAGE3                = 0x01<<13,
    RTKOTAImageType_BBpro_FACTORY_IMAGE             = 0x01<<14,
    RTKOTAImageType_BBpro_BACKUP_DATA               = 0x01<<15,
};

typedef NS_ENUM(uint16_t, RTKSubBinHeaderType)
{
    RTKSubBinHeaderType_BinID           = 0x0001,
    RTKSubBinHeaderType_Version         = 0x0002,
    RTKSubBinHeaderType_PartNumber      = 0x0003,
    RTKSubBinHeaderType_Length          = 0x0004,
    RTKSubBinHeaderType_OTAVersion      = 0x0011,
    RTKSubBinHeaderType_ImageID         = 0x0012,
    RTKSubBinHeaderType_FlashAddr       = 0x0013,
    RTKSubBinHeaderType_ImageSize       = 0x0014,
    RTKSubBinHeaderType_SecVersion      = 0x0015,
    RTKSubBinHeaderType_ImageVersion    = 0x0016,
};


#pragma pack(push, 1)

typedef struct {
    RTKSubBinHeaderType    type;
    uint8_t    length;
    void*       dataAt;
} RTKOTAMPSubBinHeader;

typedef struct {
    uint32_t    flashOffset;
    uint32_t    size;
    uint32_t    reserved;
} RTKOTAMPSubFileIndicator;

typedef struct {
    uint16_t    signature;
    uint32_t    size;
    uint8_t     checkSum[32];
    uint16_t    extension;
    uint32_t    indicator;
    RTKOTAMPSubFileIndicator subFileIndicator;
} RTKOTAMPHeader;


typedef struct {
    uint8_t    ic_type;
    uint8_t    ota_flag;
    uint16_t   signature;
    uint16_t   version;
    uint16_t   crc16;
    uint32_t   length;
} RTKOTAImageHeader;


/* Image Version Format */
/*
 * https://wiki.realtek.com/pages/viewpage.action?pageId=109786831
 *
 *
 */

union VersionFormatNormal {
    uint32_t numberValue;
    struct {
        uint32_t major: 8;
        uint32_t minor: 8;
        uint32_t revision: 8;
        uint32_t build: 8;
    } component;
};

union VersionFormatBee2 {
    uint32_t numberValue;
    struct {
        uint32_t major: 4;
        uint32_t minor: 8;
        uint32_t revision: 15;
        uint32_t build: 5;
    } component;
};


union VersionFormatBBpro {
    uint32_t numberValue;
    struct {
        uint32_t build: 8;
        uint32_t revision: 8;
        uint32_t minor: 8;
        uint32_t major: 8;
    } component;
};

union VersionFormatBBproApp {
    uint32_t numberValue;
    struct {
        uint32_t major: 4;
        uint32_t minor: 8;
        uint32_t revision: 9;
        uint32_t build: 11;
    } component;
};

union VersionFormatBBproPatch {
    uint32_t numberValue;
    struct {
        uint32_t major: 4;
        uint32_t minor: 8;
        uint32_t revision: 15;
        uint32_t build: 5;
    } component;
};




union VersionFormatOTA {
    uint32_t numberValue;
    struct {
        uint32_t build: 8;
        uint32_t revision: 8;
        uint32_t minor: 8;
        uint32_t major: 8;
    } component;
};

union VersionFormatDSP {
    uint32_t numberValue;
    struct {
        uint8_t minor: 8;
        uint8_t major: 8;
        uint8_t custom_minor: 8;
        uint8_t custom_major: 8;
    } component;
};

union VersionFormatDSPLegacy {
    uint32_t numberValue;
    struct {
        uint32_t rsv: 16;
        uint8_t minor: 8;
        uint8_t major: 8;
    } component;
};


#pragma pack(pop)

#endif /* RTKOTAFileFormat_h */
