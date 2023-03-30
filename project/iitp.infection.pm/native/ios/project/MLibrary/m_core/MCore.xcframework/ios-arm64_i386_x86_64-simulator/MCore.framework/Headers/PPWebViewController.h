//
//  webViewPageController.h
//  iPadSample
//
//  Created by UnSubHan on 11. 1. 16..
//  Copyright 2011 . All rights reserved.
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <MessageUI/MFMailComposeViewController.h>
#import "PPViewController.h"
#import "WNInterface.h"
#import "PPWebView.h"

#define IX_CLOSE_BTN_TAG (0x5F5F1976)

@class BaseWNInterface;

@interface WKWebView (AddEvalFunction)

- (void)stringByEvaluatingJavaScriptFromString:(NSString *)script;

//- (NSString *) sync_eval_javascirpt:(NSString *)script;

- (void)async_eval_javascirpt:(NSString *)script completionHandler:(void (^)(id resultID, NSError *error))handler;

- (void)async_eval_javascirpt:(NSString *)script;

@end

// [iOS]Category 를 이용한 UIViewController 에 오버레이되는 View 만들기
// http://metalkin.tistory.com/47

@interface UIViewController (OverlayView)

-(void)showLayer:(NSString *)message tag:(NSInteger)tagID;
//-(void)showLayer:(NSString *)message tag:(NSInteger)tagID;
//-(void)hideLayerWithTag: (NSInteger)tagID;

@end

@protocol PPWebViewDelegate;

@interface PPWebViewController : PPViewController<WKUIDelegate, WKNavigationDelegate, MFMailComposeViewControllerDelegate> {
    
	PPWebView*       _poperaWebview;
	NSString*        _initUrl;
    BOOL             _isLoaded;
    BaseWNInterface* _wnInterface;
    NSObject<WNInterface>*  _extendWnInterface;

    BOOL             _bShownOnScreen;

#if 1 // tab
    /* 논리적인 탭 역활을 하는 컨테이너 변수 초기화 */
	NSMutableArray   *_tabChildViewControllers;
    id               _tabParentController;
    BOOL             _tabFlagOnlyOneDeleteMe;
    NSString*        _tabNaviKeyString;  /* 탭 아이템들에 대한 구분 값 */
//    NSString*        _tabBaseParameters; /* 루트만 가지고 있는 파라미터로 READ ONLY */
#endif
    
    NSInteger        _loadCount;
    
    NSInteger        _OpenCount;
    NSInteger        _KoCount;

    NSMutableArray*  _addonObjs;
    NSMutableArray*  _pluginObjs;
    
    WKWebViewConfiguration *webConfiguration;
}
@property (nonatomic, retain)  PPWebView*       poperaWebview;
@property (nonatomic, retain)  UIView*          backgroundView;
@property (nonatomic, copy)    NSString*        openInitUrl;
@property (nonatomic, assign)  BOOL             isLoaded;
@property (nonatomic, assign)  BOOL             bShownOnScreen;
@property (nonatomic, retain)  BaseWNInterface* wnInterface;

#if 1 // tab ´
@property (nonatomic, assign)  id               tabParentController;
@property (nonatomic, assign)  BOOL             tabFlagOnlyOneDeleteMe;

@property (nonatomic, retain)  NSMutableArray*  tabChildViewControllers;
@property (nonatomic, copy)    NSString*        tabNaviKeyString;
//@property (nonatomic, copy)    NSString*        tabBaseParameters;
#endif

@property (nonatomic, retain)  NSObject<WNInterface>*  extendWnInterface;

@property (nonatomic, retain)  NSMutableArray*  addonObjs;
@property (nonatomic, retain)  NSMutableArray*  pluginObjs;

#pragma mark -
#pragma mark initialize method

- (id)initWithUrl:(NSString*)pUrl;

- (void)loadURLString:(NSString *)url;

#pragma mark -
#pragma mark webView management method
- (void) changeHtmlUrl:(NSString *)urlAddress target:(WKWebView*)target;

- (void) setParametersToWebView:(WKWebView*)webView parameters:(NSMutableDictionary*)aParameters;

- (NSString*) jsCall:(NSString *)commandString;

- (void)showErrorPage;

#pragma mark -
#pragma mark popera webview life cycle

- (void) poperaWebViewInitPage;

- (void) poperaWebViewHidePage; 

- (void) poperaWebViewRestorePage;

- (void) poperaWebViewDestoryPage;

- (void) poperaWebViewReadyUpdating:(NSString *)appVersionInfo needUpdate:(NSString *)yesNo;

- (void) callWithJavaScriptFunction:(NSString *)funcName params:(NSObject *)fristObject, ... NS_REQUIRES_NIL_TERMINATION;

- (void) callCbfunction:(NSString *)func withObjects:(NSObject*)fristObject, ... NS_REQUIRES_NIL_TERMINATION;

- (NSString *) createCbFunctionString:(NSString *)func withObjects:(NSObject *)fristObject, ...NS_REQUIRES_NIL_TERMINATION;

- (void) callJavaScriptFunction:(NSString *)funcName withObjects:(NSObject*)fristObject, ... NS_REQUIRES_NIL_TERMINATION;

- (void) callJavaScriptFunctionNotEncoding:(NSString *)funcName withObjects:(NSObject*)fristObject, ... NS_REQUIRES_NIL_TERMINATION;

- (void) callJavaScriptDirect:(NSString *)funcName withObjects:(NSObject *)fristObject, ...NS_REQUIRES_NIL_TERMINATION;

- (void) callJavaScriptFromString:(NSString *)script;

- (BOOL) canUseWNInterface;

- (WKWebViewConfiguration *)exWebViewConfiguration:(WKWebViewConfiguration *)configuration;

- (void) exWebView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;

- (void) callCbfunction:(NSString *)func count:(int)count withObjects:(va_list)args;

- (NSInteger)             tabIndexOfViewController:(PPWebViewController *) query;
- (NSInteger)             tabIndexOfHtmlUrl:(NSString *) url;
- (PPWebViewController *) remvoeChildTabAtIndex:(NSInteger) idx;
- (PPWebViewController *) childTabViewControllerAtIndex:(NSInteger) idx;
- (void)                  addChildTab:(PPWebViewController *) child;
- (NSInteger)             childTabCount;
- (PPWebViewController *) childTabAtTop;
- (BOOL)                  changeTabManagerTo:(PPWebViewController *) newManager;
- (PPWebViewController *) firstChildTab;

- (PPWebViewController *) tabParent;
- (NSString *)            printTabChildInfo;
- (NSString *) tabChildInfo;
- (NSString *) htmlPath;

#pragma mark -
#pragma mark abstract method exception

- (id) abstractMethodException:(SEL)exceptionSelector;

@end
