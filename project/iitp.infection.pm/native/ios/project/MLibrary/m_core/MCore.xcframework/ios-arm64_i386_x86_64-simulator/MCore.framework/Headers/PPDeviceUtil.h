//
//  PPDeviceUtil.h
//
//  Created by Uracle Lab on 11. 5. 6..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <SystemConfiguration/SCNetworkReachability.h>
#import <CoreLocation/CoreLocation.h>

typedef enum {
	TypeiPhone,
	TypeiPad,
	TypeiPod,
	TypeSimulator,
	TypeUnknown
}
PPDeviceSimpleType;

typedef enum {
	FlashState_OFF, // see : AVCaptureTorchMode
	FlashState_ON,
	FlashState_AUTO,
	FlashState_NONE,
	FlashState_NS // not supported
}
PPDeviceFlashState;

/*!
    @class PPDeviceUtil
    @brief Device Info Util
    @remarks
    Device 정보에 관한 유틸리티
    @author eungwan@asgkorea.co.kr
    @date 2011.05.11 17:17
 */
@interface PPDeviceUtil : NSObject {
}

/*!
    @brief hardware platform 명을 반환한다.
    @remarks
    hardware platform 명을 리턴한다.
    - usage:
    @code
    NSString* device =  [PPDeviceUtil platform];
    @endcode
    @result hardware platform name
    @author eungwan@asgkorea.co.kr
    @date 2011.05.06 13:27
 */
+ (NSString *) platform;

/*!
    @brief hardware platform 을 type으로 구분하여 반환한다.
    @remarks
    hardware platform 을 type으로 구분하여 반환한다.\n
    type : TypeiPhone / TypeiPad / TypeiPod / TypeSimulator / TypeUnknown
    @todo iPhone / iPad / iPod 이외의 Device가 새로 출시 되면 추가 해주어야 함.
    - usage:
    @code
    PPDeviceSimpleType deviceType = [PPDevieceUtil platformType];
    @endcode
    @result DeviceType
    @author eungwan@asgkorea.co.kr
    @date 2011.05.06 13:29
 */
+ (PPDeviceSimpleType) platformType;

/*!
   @brief device가 해킹(루팅)되었는지 유무를 확인한다.
   @remarks
   device가 탈혹(루팅)된 device 일 경우 : YES,
   else : NO 를 리턴함.
   jail-break 확인을 위한 list는 아래와 같은 형태로 들어가 있음.
   /Applications/Cydia.app
   /private/var/stash
   ....

   device에 위 list에 있는 file or app이 있을 경우 jail-broken device(해킹[루팅]된 장치)가 됨.
   - usage:
   @code
   BOOL jailBrokenState = [PPDevieceUtil isJailbrokenDevice];
   @endcode
   @result : YES/NO
   @author :
   @date   :
 */
+ (BOOL) isJailbrokenDevice;

+ (NSDictionary *)memoryInfo;

+ (BOOL)checkConnection: (SCNetworkReachabilityFlags *) flags;

+ (BOOL)connectedToNetwork;

+ (BOOL)connectedToWiFi;

//+ (NSString *)UDID;

+ (NSString *)MACAddress;

+ (NSString *)name;

+ (NSString *)model;

+ (NSString *)systemVersion;

+ (NSString *)systemName;

+ (NSString *)appVersion;

+ (NSString *)bundleIdentifier;

/*
 * iPhone Simulator == i386
 * iPhone == iPhone1,1
 * 3G iPhone == iPhone1,2
 * 3GS iPhone == iPhone2,1
 * 4 iPhone == iPhone3,1
 * 1st Gen iPod == iPod1,1
 * 2nd Gen iPod == iPod2,1
 * 3rd Gen iPod == iPod3,1
 */
+ (NSString *)machine;

+ (BOOL)cameraSupported;

+ (BOOL)compassSupported;

+ (BOOL)telephoneSupported;

+ (BOOL)cameraFrontSupported;

+ (BOOL)cameraBackSupported;

/*
    파라미터 : state : ON/OFF
    리턴값 : SUCCESS/ERROR or Error의 원인
 */
+ (PPDeviceFlashState) deviceControlFlash: (PPDeviceFlashState) state;
/*
    파라미터 : 없음
   리턴값 : /AUTO/ON/OFF/NONE/NS
      -> ON : flash On 상태
      -> OFF : flash Off 상태
      -> NONE : flash 상태 알수 없음.
      -> NS : 장치에서 지원 않함.
 */
+ (PPDeviceFlashState) deviceGetFlashState;


/*
 망제공자의 MCC/MNC 코드를 스트링으로 리턴하는 함수.
 파라미터 : 없음
 리턴값 : "mccmnc" or ""
 */
+ (NSString *)networkCarrierCode;

+ (NSString *) langJSFilePath;


+ (BOOL)isNetworkReachable;
+ (BOOL)isCellNetwork;

@end