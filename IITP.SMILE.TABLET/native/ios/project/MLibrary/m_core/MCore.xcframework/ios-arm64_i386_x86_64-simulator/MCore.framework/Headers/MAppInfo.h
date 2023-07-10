//
//  MAppInfo.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 8. 20..
//
//

#import <Foundation/Foundation.h>

@interface MAppInfo : NSObject

@property (nonatomic, readonly) NSString *applicationName;          // 앱 이름
@property (nonatomic, readonly) NSString *applicationIdentifier;    // 앱 ID (BundleIdentifier)
@property (nonatomic, readonly) NSString *applicationVersion;       // 앱 버전
@property (nonatomic, readonly) NSString *applicationBuildVersion;  // 빌드 버전

@property (nonatomic, readonly) NSString *licenseIdentifier;        // 라이센스 Application ID (리소스 라이센스)

@property (nonatomic, readonly) NSString *deviceName;               // 단말기 이름
@property (nonatomic, readonly) NSString *deviceUUID;               // 단말기 고유ID (Keychain으로 관리, MPush Plugin 과 호환)
@property (nonatomic, readonly) NSString *deviceModel;              // 단말기 모델명

@property (nonatomic, readonly) NSString *systemName;               // 시스템 이름
@property (nonatomic, readonly) NSString *systemTypeName;           // 시스템 타입 이름 (iOS 로 고정)
@property (nonatomic, readonly) NSString *systemVersion;            // iOS Version
@property (nonatomic, readonly) NSInteger systemMajorVersion;       // iOS Major Version

@property (nonatomic, readonly) NSString *carrierName;              // 통신사 이름
@property (nonatomic, readonly) NSString *phoneNumber;              // 핸드폰 번호 (Not Supported)

@property (nonatomic, readonly) NSInteger manifestBuildVersion;     // Manifest DTD 버전
@property (nonatomic, readonly) NSURL *resourceBaseURL;             // Resource Base URL 값
@property (nonatomic, readonly) BOOL useMultiPath;                  // Resource Directory 구조 (Manifest.xml 위치에 따라 변경)
@property (nonatomic, readonly, getter=isTablet) BOOL tablet;       // iPad 여부
@property (nonatomic, readonly, getter=isCameraSupported) BOOL cameraSupported;     // Camera 지원 여부
@property (nonatomic, readonly, getter=isCompassSupported) BOOL compassSupported;   // Compass 지원 여부

@property (nonatomic, readonly) UIDeviceOrientation deviceOrientation;              // Device 방향

+ (MAppInfo *)sharedInfo; // Singleton Instance

@end
