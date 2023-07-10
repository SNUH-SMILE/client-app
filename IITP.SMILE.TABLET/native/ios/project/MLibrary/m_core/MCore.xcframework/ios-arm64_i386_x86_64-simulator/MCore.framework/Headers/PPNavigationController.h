//
//  CustomNavigationController.h
//  WOD
//
//  Created by Casey Marshall on 2/3/11.
//  Copyright 2011 Modal Domains. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "PPViewControllerEnum.h"

@interface UIDevice (CustomDevice)

- (void)setDeviceOrientation:(UIDeviceOrientation)orientation;

@end

#if !__IPHONE_6_0 // FOR iOS 6
enum __MP_AUTO_ROTATION_VALUE__ 
{
    UIInterfaceOrientationMaskPortrait           = (1 << UIInterfaceOrientationPortrait),
    UIInterfaceOrientationMaskLandscapeLeft      = (1 << UIInterfaceOrientationLandscapeLeft),
    UIInterfaceOrientationMaskLandscapeRight     = (1 << UIInterfaceOrientationLandscapeRight),
    UIInterfaceOrientationMaskPortraitUpsideDown = (1 << UIInterfaceOrientationPortraitUpsideDown),
    UIInterfaceOrientationMaskLandscape          = (UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight),
    UIInterfaceOrientationMaskAll                = (UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight | UIInterfaceOrientationMaskPortraitUpsideDown),
    UIInterfaceOrientationMaskAllButUpsideDown   = (UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight)
};
#endif

@interface UIViewController (MPPage_TAB)
- (BOOL)               exIsWnTab;
- (UIViewController *) exWnTabContainer;
- (BOOL)               exIsPPWebViewCtrl;
//- (void)               sharePrameterInAllTabWithDictionary:(NSDictionary*)dic;
@end

@interface UIViewController (MPView_PPViewCtrl)
- (BOOL) exIsPPViewCtrl;
- (void) setPrameterWithDictionary:(NSDictionary*)dic;
@end

@interface PPNavigationController : UIViewController
{
	NSMutableArray   *viewControllers;
    UIViewController *currentViewCtrl;
    UIViewController *buffer;
}

@property (nonatomic, retain) UIViewController  *currentViewCtrl;
@property (nonatomic, retain) NSMutableArray    *viewControllers;
@property (nonatomic, readonly) UIViewController  *currentViewController;
@property (nonatomic, readonly) UIViewController *visibleViewController;
@property (nonatomic, readonly) UIViewController  *animatingViewController;
@property (nonatomic, readonly, getter=isAnimating) BOOL animating;

@property (nonatomic, readonly) BOOL isRunning; // is Deprecated 2.2 to animating
@property (nonatomic, readonly) UIViewController *buffer; // is Deprecated 2.2 to animatingViewController

- (id) initWithRootViewController: (UIViewController *) viewController;

- (id) initWithRootViewController:(UIViewController *)viewController 
                       actionType:(PPActionType)actionType;

- (void) pushViewController: (UIViewController *) viewController
				   animated: (BOOL) animated;

- (void) pushViewController: (UIViewController *) viewController
			  withAnimation: (PPAnimationType) animation;

- (void) pushViewController:(UIViewController *)viewController 
              withAnimation:(PPAnimationType)animation 
                 actionType:(PPActionType)actionType;

- (void) popViewControllerWithAnimation:(PPAnimationType)animation;

- (void) popViewControllerAnimated:(BOOL)animated;

- (void) popToViewController:(UIViewController*)viewController animated:(BOOL)animated;

- (void) popToViewController:(UIViewController*)viewController withAnimationType:(PPAnimationType)animation;

- (void) popViewControllerAnimationWithCurrentViewCtrl:(UIViewController*)current 
                                    newCurrentViewCtrl:(UIViewController*)newCurrent 
                                         animationType:(PPAnimationType)animation;

//- (void) rotate:(UIViewController*)toViewController;

- (void)resizeViewController:(UIViewController *)viewController toFrame:(CGRect)frame;

- (BOOL) existNavigationKey:(NSString*)navigationKey;

- (BOOL) existViewController:(UIViewController *)ctrl;

- (NSString *) navigationKey:(UIViewController *)ctrl;

- (NSInteger)navigationWithKey:(NSString *)keyStr from:(NSInteger)fromIdx;

- (NSInteger)navigationWithKey:(NSString *)keyStr;

- (BOOL)topIsNoHistory;

- (NSString*) stackInfo;

#if 1 // tab
- (void) popTabViewControllerWithAnimation:(PPAnimationType)animation actionType:(PPActionType)actionType;
- (void) removeAllTabChildWithTabParent:(UIViewController *) papaCtrl;
- (UIViewController *)findTabChildInStackWithKey:(NSString *)tabItemKeyString from:(NSInteger)fromIdx;
- (UIViewController *)findTabChildInStackWithKey:(NSString *)tabItemKeyString;
#endif
/*
 willRemovedNoHistoryViewCtrlByMoveToOhterApp 가 있을 경우
 이 ctrl을 삭제하도록 함.
 */
- (BOOL)actionDestoryOrRestorePageOnEnterBackground;
- (BOOL)actionDestoryOrRestorePageOnEnterForeground;
- (BOOL)actionPushTopViewController:(UIViewController *)viewCtrl;

+ (PPNavigationController*) ppNavigationController;

@end