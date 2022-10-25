//
//  PPHybridViewController.h
//

#import <Foundation/Foundation.h>
#import <UTESmartBandApi/UTESmartBandApi.h>
#import "PPIndicatorUtil.h"

@interface PPHybridViewController : PPWebViewController

// 스캔 결과 함수
- (void) scanResult :(NSString *) callback :(NSString *) schema :(NSString *) code :(NSString *) message :(NSArray *) devices;
// 디바이스 연결 결과 함수
- (void) connectResult :(NSString *) callback :(NSString *) code :(NSString *) message;
// 동기화 콜백
- (void) syncResult :(NSString *) callback :(NSDictionary *) result;
// 수신 콜백
- (void) receiveDataResult :(NSString *) callback :(NSDictionary *) result;
// 수신
//- (void) hrmResult :(NSString *) callback :(NSString *) min :(NSString *) max :(NSString *) avg;
// 수신 콜백
- (void) tempResult :(NSString *) callback :(NSString *) result;
// 수신 콜백
- (void) hrm24Result :(NSString *) callback :(NSString *) result;
// 수신 콜백
- (void) stepResult :(NSString *) callback :(NSString *) step :(NSString *) distance;
// 인디케이터
- (void) showIndicator;
- (void) hiddenIndicator;
@end
