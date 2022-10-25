//
//  KMViewController.h
//  Library
//
//  Created by 박호영 on 11. 1. 26..
//  Copyright 2011. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "PPViewControllerEnum.h"
#import "PPNavigationController.h"
#import "PPParameters.h"

@interface PPViewController : UIViewController {
    PPParameters*           _parameters;
    PPSupportOrientation    _supportOrientation;
    PPNavigationController* _ppNaviController;
    NSString*               _navigationKey;
    NSString*               _prevNavigationKey;
    double                  _createTime;
}
@property (nonatomic, retain) PPParameters*           parameters;
@property (nonatomic, readwrite) PPSupportOrientation    supportOrientation;
@property (nonatomic, assign) PPNavigationController* ppNaviController;
@property (nonatomic, assign) double                  createTime;
@property (nonatomic, copy)   NSString*               navigationKey;
@property (nonatomic, copy)   NSString*               prevNavigationKey;
@property (nonatomic, readonly) UIColor *statusBarBackgroundColor;
@property (nonatomic, readonly) BOOL useStatusBarView;
@property (nonatomic, readwrite) PPAnimationType animationType;
@property (nonatomic, readwrite) PPActionType actionType;
@property (nonatomic, readonly) PPAnimationType reverseAnimationType;

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation;

/*!
     @brief Move WebView Controller 함수  
     @remarks
     PPWebViewController를 상속받은 화면으로 이동한다.
     - usage:
     @code
     PPParameters* param = [[[PPParameters alloc] init] autorelease];
     [param setObject:@"key1_value" forKey:@"key1"];
     [param setObject:@"key2_value&++++" forKey:@"key2" encoding:NSUTF8StringEncoding];
     [self moveToWebOnNewAct:@"index.html" :[param paramString] :@"NEW_SCR" :@"MODAL_UP" :@"PORT"];
     @endcode
     @param url 이동할 HTML 파일 경로
     @param aParameters 이동할 화면에 보낼 파라메터 String
     ex> aaa=bbb&ccc=ddd
     @param pActionType actionType 화면 이동시 Activity의 히스토리 스택 저장 처리 정의
          - NEW_SCR : 새로운 Activity(ViewController)를 생성한다. 
                      호출한 Activity는 히스토리 스택에 저장된다. 
          - NO_HISTORY : 새로운 Activity를 히스토리 스택에 남기지 않는다. 
                         호출하는 Activity는 히스토리 스택에 저장되고 호출되는 Activity는 히스토리 스택에 저장되지 않는다.
         - CLEAR_TOP : 기존의 히스토리 스택에 새로 생성할 Activity가 있다면 그 위 스택의 Activity들을 전부 제거하고 호출한다.
                        ex) Activity3에서 Activity1을 호출 하는 경우 히스토리 스택은 0->1->2->3 에서 0->1로 변경
     @param pAnimationType 애니메이션 효과
         - DEFAULT
         - NONE
         - SLIDE_LEFT
         - SLIDE_RIGHT
         - SLIDE_TOP
         - SLIDE_BOTTOM
         - ZOOM_IN 
         - ZOOM_OUT 
         - FADE 
         - MODAL_UP 
         - MODAL_DOWN 
         - MODAL_LEFT
         - MODAL_RIGHT
     @param pOrientation; 화면 가로, 세로 전환 가능 옵션
         - DEFALUT : 기본
         - PORT : 세로
         - LAND : 가로
         - ALL : 가로, 세로 가능
     @author eungwan@urcle.co.kr
     @date 2011.12.22 17:45
 */

- (void) moveToWebOnNewAct:(NSString*)url
                          :(NSString*)aParameters
                          :(NSString*)pActionType
                          :(NSString*)pAnimationType
                          :(NSString*)pOrientation;

/*!
    @brief Move WebView Controller 함수  
    @remarks
    PPWebViewController를 상속받은 화면으로 이동한다.
 
    @param url html name(ex> @"intro.html")
 
    @param aParameters 이동할 화면에 보낼 파라메터 Object
 
    @param pActionType actionType 화면 이동시 Activity의 히스토리 스택 저장 처리 정의
         - PPActionNewScreen : 새로운 화면 생성, 히스토리 저장
         - PPActionNoHistory : 새로운 화면 생성, 히스토리 미저장
         - PPActionClearTop  : 히스토리에 있는 특정 화면으로 이동.히스토리에 없을시 히스토리 클리어 및 새로 생성 이동. 
 
    @param pAnimationType 애니메이션 효과
        -  PPAnimationDefault
        -  PPAnimationSlideLeft
        -  PPAnimationSlideRight
        -  PPAnimationSlideTop
        -  PPAnimationSlideBottom
        -  PPAnimationNone
        -  PPAnimationZoomIn
        -  PPAnimationZoomOut
        -  PPAnimationFade
        -  PPAnimationFlipLeft
        -  PPAnimationFlipRight
        -  PPAnimationCurlUp
        -  PPAnimationCurlDown
        -  PPAnimationModalUp
        -  PPAnimationModalDown
        -  PPAnimationModalLeft,
        -  PPAnimationModalRight
 
     @param pOrientation; 화면 가로, 세로 전환 가능 옵션
        - PPSupportOrientationDefault    : 어플리케이션에서 설정된 Support
        - PPSupportOrientationPortrait   : 세로 화면 고정 (PORTRAIT)
        - PPSupportOrientationLandscape  : 가로 화면 고정 (LANDSCAPE_LEFT)
        - PPSupportOrientationReversiblePortrait : 세로화면만 지원
        - PPSupportOrientationReversibleLandscape : 가로화면만 지원
        - PPSupportOrientationAll        : 전 방향 지원
 
    @author eungwan@urcle.co.kr
    @date 2012.01.12 15:22
*/
- (void) moveToWebOnNewActWithUrl:(NSString*)url
                         paramObj:(PPParameters *)aParameters
                           action:(PPActionType)pActionType
                           orient:(PPSupportOrientation)pOrientation
                        animation:(PPAnimationType)pAnimationType;

/*!
    @brief Move Native View Controller 함수  
    @remarks
     PPNativeViewController를 상속받은 Native 화면으로 이동한다.
    - usage:
    @code
     PPParameters* param = [[[PPParameters alloc] init] autorelease];
     [param setObject:@"key1_value" forKey:@"key1"];
     [param setObject:@"key2_value" forKey:@"key2" encoding:NSUTF8StringEncoding];
     [self moveToNativeAct:@"TestViewController" :[param paramString] :@"NEW_SCR" :@"MODAL_UP" :@"PORT"];
    @endcode
    @param className 이동할 Native Class Name
    @param aParameters 이동할 화면에 보낼 파라메터 String
                       ex> aaa=bbb&ccc=ddd
    @param pActionType actionType 화면 이동시 Activity의 히스토리 스택 저장 처리 정의
         - NEW_SCR : 새로운 Activity(ViewController)를 생성한다. 
                     호출한 Activity는 히스토리 스택에 저장된다. 
         - NO_HISTORY : 새로운 Activity를 히스토리 스택에 남기지 않는다. 
                        호출하는 Activity는 히스토리 스택에 저장되고 호출되는 Activity는 히스토리 스택에 저장되지 않는다.
         - CLEAR_TOP : 기존의 히스토리 스택에 새로 생성할 Activity가 있다면 그 위 스택의 Activity들을 전부 제거하고 호출한다.
                       ex) Activity3에서 Activity1을 호출 하는 경우 히스토리 스택은 0->1->2->3 에서 0->1로 변경
    @param pAnimationType 애니메이션 효과
           - DEFAULT
           - NONE
           - SLIDE_LEFT
           - SLIDE_RIGHT
           - SLIDE_TOP
           - SLIDE_BOTTOM
           - ZOOM_IN 
           - ZOOM_OUT 
           - FADE 
           - MODAL_UP 
           - MODAL_DOWN 
           - MODAL_LEFT
           - MODAL_RIGHT
    @param pOrientation; 화면 가로, 세로 전환 가능 옵션
           - DEFALUT : 기본
           - PORT : 세로
           - LAND : 가로
           - ALL : 가로, 세로 가능
    @author eungwan@uracle.co.kr
    @date 2011.12.22 17:45
*/
- (void) moveToNativeAct:(NSString*)className
                        :(NSString*)aParameters
                        :(NSString*)pActionType
                        :(NSString*)pAnimationType
                        :(NSString*)pOrientation;

/*!
     @brief Move Native View Controller 함수  
     @remarks
     PPNativeViewController를 상속받은 Native 화면으로 이동한다.
     
     @param cls 이동하려는 viewController class 
     
     @param aParameters 이동할 화면에 보낼 파라메터 Object
     
     @param pActionType actionType 화면 이동시 Activity의 히스토리 스택 저장 처리 정의
     - PPActionNewScreen : 새로운 화면 생성, 히스토리 저장
     - PPActionNoHistory : 새로운 화면 생성, 히스토리 미저장
     - PPActionClearTop  : 히스토리에 있는 특정 화면으로 이동.히스토리에 없을시 히스토리 클리어 및 새로 생성 이동. 
     
     @param pAnimationType 애니메이션 효과
     -  PPAnimationDefault
     -  PPAnimationSlideLeft
     -  PPAnimationSlideRight
     -  PPAnimationSlideTop
     -  PPAnimationSlideBottom
     -  PPAnimationNone
     -  PPAnimationZoomIn
     -  PPAnimationZoomOut
     -  PPAnimationFade
     -  PPAnimationFlipLeft
     -  PPAnimationFlipRight
     -  PPAnimationCurlUp
     -  PPAnimationCurlDown
     -  PPAnimationModalUp
     -  PPAnimationModalDown
     -  PPAnimationModalLeft,
     -  PPAnimationModalRight
     
     @param pOrientation; 화면 가로, 세로 전환 가능 옵션
     - PPSupportOrientationDefault    : 어플리케이션에서 설정된 Support
     - PPSupportOrientationPortrait   : 세로 화면 고정 (PORTRAIT)
     - PPSupportOrientationLandscape  : 가로 화면 고정 (LANDSCAPE_LEFT)
     - PPSupportOrientationReversiblePortrait : 세로화면만 지원
     - PPSupportOrientationReversibleLandscape : 가로화면만 지원
     - PPSupportOrientationAll        : 전 방향 지원
 
     @author eungwan@urcle.co.kr
     @date 2012.01.12 15:22
 */

- (void) moveToNativeActWithClass:(Class)cls
                         paramObj:(PPParameters *)param
                           action:(PPActionType)action
                           orient:(PPSupportOrientation)orient
                        animation:(PPAnimationType)animation;

/*!
     @brief 이전 화면으로 이동한다.
     @remarks
     이전 화면으로 이동한다.
     @param aParameters 이동할 화면에 보낼 파라메터 String
         ex> aaa=bbb&ccc=ddd
     @param pAnimationType 애니메이션 효과
     - DEFAULT
     - NONE
     - SLIDE_LEFT
     - SLIDE_RIGHT
     - SLIDE_TOP
     - SLIDE_BOTTOM
     - ZOOM_IN 
     - ZOOM_OUT 
     - FADE 
     - MODAL_UP 
     - MODAL_DOWN 
     - MODAL_LEFT
     - MODAL_RIGHT
     @author eungwan@uracle.co.kr
     @date 2011.12.22 17:45
 */
- (void) historyBack:(NSString*)param
                    :(NSString*)pAnimationType;


/*!
     @brief 이전 화면으로 이동한다.
     @remarks
     이전 화면으로 이동한다.
     @param aParameters 이동할 화면에 보낼 파라메터 Object
     @param pAnimationType 애니메이션 효과
     -  PPAnimationDefault
     -  PPAnimationSlideLeft
     -  PPAnimationSlideRight
     -  PPAnimationSlideTop
     -  PPAnimationSlideBottom
     -  PPAnimationNone
     -  PPAnimationZoomIn
     -  PPAnimationZoomOut
     -  PPAnimationFade
     -  PPAnimationFlipLeft
     -  PPAnimationFlipRight
     -  PPAnimationCurlUp
     -  PPAnimationCurlDown
     -  PPAnimationModalUp
     -  PPAnimationModalDown
     -  PPAnimationModalLeft
     -  PPAnimationModalRight
     @author eungwan@uracle.co.kr
     @date 2011.12.22 17:45
 */
- (void) historyBackWithParamObject:(PPParameters *)param
                        animation:(PPAnimationType)pAnimationType;


- (void) historyBack:(NSString*)param;
- (void) historyBackWithParameter:(PPParameters *)param;

/*!
    @brief clear top 함수.
    @remarks
    clear top 함수.
    @param key        navigation key
     - web 인 경우 html 명.(@"index.html")
     - native 인 경우 class 명.(@"TestViewController")
    @param params    parameter object
    @param animation animation
    @result 성공 여부
    @author eungwan@uracle.co.kr
    @date 2012.01.12 15:37
*/
- (BOOL) moveClearTop:(NSString *)key 
               params:(PPParameters*)params
            animation:(PPAnimationType)animation;


/*!
 @brief open 해야할 html 파일에 해당하는 full url string을 반환한다.
 @remarks
 clear top 함수.
 @param source        html 파일 이름.
 @result              full url string
 */
+ (NSString *) convertFullURLString:(NSString*)source;

#pragma mark -
#pragma mark deprecated methods

/*
 * NOTICE: moveToWebOnNewAct로 대체 됨.
 */
- (void) pushWebViewControllerWithUrl:(NSString *)url 
                                param:(NSDictionary *)param
                               action:(PPActionType)action
                               orient:(PPSupportOrientation)orient
                            animation:(PPAnimationType)animation NS_DEPRECATED_IPHONE(2_0, 5_0);
/*
 * NOTICE: moveToNativeAct로 대체 됨.
 */
- (void) pushNativeViewControllerWithUrl:(NSString *)className 
                                   param:(NSDictionary *)param
                                  action:(PPActionType)action
                                  orient:(PPSupportOrientation)orient
                               animation:(PPAnimationType)animation NS_DEPRECATED_IPHONE(2_0, 5_0);
/*
 * NOTICE: historyBack로 대체 됨.
 */
- (void) historyBackWithParameter:(NSDictionary*)param 
                        animation:(PPAnimationType)animation NS_DEPRECATED_IPHONE(2_0, 5_0);

/*
 * iOS 11 이상부터 iPhone X 대응 안전한 화면 영역을 사용할지를 반환한다.
 * iOS 11 이상부터 동작한다.
 */
- (BOOL) useSafeArea;

- (BOOL) useAllowDisplayingKeyboardWithoutUserAction;

@end
