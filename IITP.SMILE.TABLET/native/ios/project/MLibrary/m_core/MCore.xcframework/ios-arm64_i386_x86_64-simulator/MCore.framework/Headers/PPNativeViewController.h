//
//  PPNativeViewController.h
//

#import "PPViewController.h"
#import "PPNetworkOption.h"

@protocol PPNativeViewControllerDelegate

- (void) onAppWillEnterForeground;
- (void) onAppDidEnterBackground;

@end

@protocol PPNativeUpdateResourceFilesDelegate <NSObject>

- (void) cbUpdateResourceFiles:(NSString *)result withAppInfoString:(NSString *)appInfo;

@optional

//- (void) cbUpdateResourceFilesOnErrorCode:(NSString *)errorCode errorMessage:(NSString *)errorMessage;
- (void) cbUpdateResourceFilesOnProgress:(long)totalSize readSize:(long)readSize remainingSize:(long)remainingSize percentage:(int)percentage totalFileCount:(int)totalFileCount currentFilePos:(int)currentFilePos;

@end

@interface PPNativeViewController : PPViewController

/*!
 @brief 통신 함수
 @remarks
 네트워크 매니저를 사용하여 통신하는 함수.
 
 @param target   AppManifest.xml에 정의된 network name
 @param trcode   전문 코드
 @param request  request data
 @param option   {PPNetworkOption} 네트워크 옵션
 @param userdata extends datas
 */
- (void) netSearchWithTarget:(NSString *)target
                      trcode:(NSString *)trcode
                     request:(NSString *)request
                      option:(PPNetworkOption *)option
                    userdata:(NSArray*)userdata;

/*!
 @brief 화면단의 WNHttpUpdateResources 함수와 동일한 기능을 하는 메소드.
 
 @param target   AppManifest.xml에 정의된 network name
 @param mode     서버에 배포된 리소스 모드( "REAL" or "DEV" ) nil일 경우 "DEV"
 @param delegate 화면단의 CBUpdateResourceFiles 자바스크립트 함수와 동일한 기능을 하는 함수를 구현한 객체.
 */
- (void) httpUpdateResources:(NSString *)target
        downloadResourceMode:(NSString *)mode
                withDelegate:(id <PPNativeUpdateResourceFilesDelegate>)delegate;

@end