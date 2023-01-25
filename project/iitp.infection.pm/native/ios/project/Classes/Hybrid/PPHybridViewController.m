//
//  PPHybridViewController.m
//

#import "PPHybridViewController.h"

@interface PPHybridViewController(/* Private */)

@property (nonatomic, retain) NSString *isIndicator;
@property (nonatomic, strong) NSURL *requestURL;

@end

@implementation PPHybridViewController

#if ! __has_feature(objc_arc)
- (void)dealloc {
    
    [super dealloc];
}
#endif

- (void) loadView {
	[super loadView];
    
    // NavigationBar 는 사용하지 않으므로 Hidden
    self.navigationController.navigationBarHidden = YES;
        
    if([self.openInitUrl hasHttpScheme] && [self.openInitUrl rangeOfString:@"127.0.0.1"].location == NSNotFound)
    {
        [self.poperaWebview setFrame:CGRectMake(self.poperaWebview.frame.origin.x, 50, self.poperaWebview.frame.size.width, self.poperaWebview.frame.size.height - 50)];
        UIView *tempView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, 50)];
        [tempView setBackgroundColor:[UIColor whiteColor]];
        UIButton *backBtn = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 150, 50)];
        [backBtn addTarget:self action:@selector(backClick) forControlEvents:UIControlEventTouchUpInside];
        [tempView addSubview:backBtn];
        UIImageView *btnImage = [[UIImageView alloc] initWithFrame:CGRectMake(10, 5, 40, 40)];
        [btnImage setImage:[UIImage imageNamed:@"back"]];
        [tempView addSubview:btnImage];
        [self.backgroundView addSubview:tempView];
    }
}

-(void)backClick
{
    [self historyBack:nil];
}

/*
 * @brief StatusBar Style 변경
 */
- (UIStatusBarStyle)preferredStatusBarStyle {
    self.backgroundView.backgroundColor = [UIColor blackColor];
    return UIStatusBarStyleLightContent;
}

/*
 * @brief StatusBar 표시 여부
 */
- (BOOL)prefersStatusBarHidden {
    return NO;
}


/*
 * @brief 현재화면으로 시작되거나 되돌아오고 나면 호출
 */
- (void)viewDidAppear:(BOOL)animated {
	[super viewWillAppear:animated];
    
    
}

/*
 * @brief 현재화면에서 벗어나기 직전에 호출
 */
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
 
    // 화면 이동전 현재화면에 떠있는 Modal 창 닫기
    if ( self.presentedViewController != nil ) {
        [self.presentedViewController dismissViewControllerAnimated:animated completion:^{
            
        }];
    }
}

/*
 * @brief 이동될 페이지경로 저장
 */
-(void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    _requestURL = navigationAction.request.URL;
    [super webView:webView decidePolicyForNavigationAction:navigationAction decisionHandler:decisionHandler];
}

/*
 * @brief 외부 페이지가 열린 상태에서 로딩 오류가 발생했을 경우에 대한 처리.
 */
-(void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error
{
    [super webView:webView didFailNavigation:navigation withError:error];
}

/*
 * @brief 부모 클래스에서 처리되지 않은 기능을 확장영역에서 처리할 수 있도록 추가함.
 */
- (void) exWebView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    if (![_requestURL.scheme hasPrefix:@"http"] && [[UIApplication sharedApplication] canOpenURL:_requestURL]) {
        //  HTTP가 아닌 일반 사용자 정의 scheme의 경우 해당 Skip 처리하도록 추가함.
        
        [[UIApplication sharedApplication] openURL:_requestURL];
        decisionHandler(WKNavigationActionPolicyCancel); // 내부적으로 처리함.
        return;
    }
    else {
        // AppFree 사이트의 경우 http://itunes.apple.com 를 open시도 후 바로 itms-services:// 스키마를 날리고 있음.
        // 예제(http://itunes.apple.com/us/app/aebpeuli-touchen-appfree/id506292960?mt=8)처럼 명시적으로 appStore로 이동하려는 경우
        
        if ([_requestURL.absoluteString hasPrefix:@"http://itunes.apple.com/"]) {
            [[UIApplication sharedApplication] openURL:_requestURL];
            decisionHandler(WKNavigationActionPolicyCancel); // 내부적으로 처리함.
            return;
        }
    }
    
    // 부모에서 처리하도록 함.
    decisionHandler(WKNavigationActionPolicyAllow);
}


@synthesize requestURL = _requestURL;

// safe area 사용하게 만듬
- (BOOL) useSafeArea {
    return YES;
}

- (void) scanResult :(NSString *) callback :(NSString *) schema :(NSString *) code :(NSString *) message :(NSArray *) devices {
    
    NSMutableArray *arr = [NSMutableArray array];
    
    for (UTEModelDevices *dev in devices) {
        
        if ([dev.name rangeOfString: schema].location != NSNotFound) {
            NSMutableDictionary *dic = [NSMutableDictionary dictionary];
            dic[@"deviceNm"] = dev.name;
            dic[@"deviceId"] = dev.identifier;
            
            [arr addObject:dic];
        }
    }
    
    NSMutableDictionary *res = [NSMutableDictionary dictionary];
    res[@"code"] = code;
    res[@"message"] = message;
    res[@"list"] = arr;

    [self callCbfunction:callback withObjects:res, nil];
}

- (void) connectResult :(NSString *) callback :(NSString *) code :(NSString *) message {
    
    NSMutableDictionary *res = [NSMutableDictionary dictionary];
    res[@"code"] = code;
    res[@"message"] = message;
    
    [self callCbfunction:callback withObjects:res, nil];
}

//- (void) sycnAllResult :(NSString *) callback :(NSString *) code :(NSString *) message :(NSDictionary *) result {
//    [self callCbfunction:callback withObjects:result, nil];
//}

- (void) syncResult :(NSString *) callback :(NSDictionary *) result {
    [self callCbfunction:callback withObjects:result, nil];
}

- (void) receiveDataResult :(NSString *) callback :(NSDictionary *) result {
    [self callCbfunction:callback withObjects:result, nil];
}

//- (void) hrmResult :(NSString *) callback :(NSString *) min :(NSString *) max :(NSString *) avg {
//    [self callCbfunction:callback withObjects:min, max, avg, nil];
//}

- (void) tempResult :(NSString *) callback :(NSString *) result {
    [self callCbfunction:callback withObjects:result, nil];
}

- (void) hrm24Result :(NSString *) callback :(NSString *) result {
    [self callCbfunction:callback withObjects:result, nil];
}

- (void) stepResult :(NSString *) callback :(NSString *) step :(NSString *) distance {
    [self callCbfunction:callback withObjects:step, distance, nil];
}

- (void) showIndicator {
    if (self.isIndicator == nil || ![self.isIndicator isEqualToString:@"Y"]) {
        [PPIndicatorUtil simpleActivityIndicatorStart:self.view];
        self.isIndicator = @"Y";
    }
}

- (void) hiddenIndicator {
    [PPIndicatorUtil simpleActivityIndicatorStop:self.view];
    self.isIndicator = @"N";
}
@end
