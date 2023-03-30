//
//  PPAppInfo.h

//
//  Created by Uracle Lab on 11. 1. 26..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PPAppInfo : NSObject {
	NSString* appVersion;
	NSString* systemVersion;
	NSString* systemName;
	NSString* deviceId;
	NSString* deviceMd;
	NSString* phoneNo;
	NSString* telecoms;
    NSString* appName;
	BOOL      iPad;
    BOOL      htmlMultiPath;
    NSInteger       iosMajorVersion;
}

@property (nonatomic, copy) NSString *appVersion;
@property (nonatomic, copy) NSString *systemVersion;
@property (nonatomic, copy) NSString *systemName;
@property (nonatomic, copy) NSString *deviceId;
@property (nonatomic, copy) NSString *deviceMd;
@property (nonatomic, copy) NSString *phoneNo;
@property (nonatomic, copy) NSString *telecoms;
@property (nonatomic, copy) NSString *appName;
@property (nonatomic, assign) BOOL   iOS6StatusBarStyle;
@property (nonatomic, assign) BOOL   htmlMultiPath;
@property (nonatomic, assign) BOOL   manifest2_0;
@property (nonatomic, assign) NSInteger    iosMajorVersion;
@property (nonatomic, assign, getter=isIPad) BOOL iPad;

@property (nonatomic, readonly) BOOL useMultiPath;
@property (nonatomic, copy) NSString *deviceName;
@property (nonatomic, copy) NSString *appBuildVersion;

// 싱글톤 패턴으로 PPAppInfo instance 생성
+ (PPAppInfo*) getInstance;

/*
 현재 orientation state를 반환한다.
 0 : 알수없음(UIDeviceOrientationUnknown)
 1 : 홈버튼이 밑(UIDeviceOrientationPortrait)
 2 : 홈버튼이 위(UIDeviceOrientationPortraitUpsideDown)
 3 : 홈버튼이 오른쪽(UIDeviceOrientationLandscapeLeft)
 4 : 홈버튼이 왼쪽(UIDeviceOrientationLandscapeRight)
 */
- (UIDeviceOrientation) orientationState;


@end






