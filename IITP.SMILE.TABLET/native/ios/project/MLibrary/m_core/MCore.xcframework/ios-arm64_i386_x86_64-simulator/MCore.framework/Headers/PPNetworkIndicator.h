//
//  PPNetworkIndicator.h
//
//
#define NET_INDICATOR_TAG 989898

#import <Foundation/Foundation.h>

@interface PPNetworkIndicator : NSObject

/*
 - pageCtrl의 view에 NET_INDICATOR_TAG 값을 가지는 full screen view를 생성 후
 - addNetIndicator 함수를 호출한다.
 */
+ (void) pushNetIndicatorToView:(UIView *)ctrlView message:(NSString*)msg tagAndCancelTarget:(id)viewTagAndCancelTarget selector:(SEL)cancelSelector;

/*
 - pageCtrl의 view[가]에서 NET_INDICATOR_TAG 값을 가지는 view[나]를 검색 후
 - view[나]에서 viewTagAndCancelTarget 값을 가지는 view를 제거한다.
 */
+ (void) popNetIndicatorFromView:(UIView *)ctrlView tagAndCancelTarget:(id)viewTagAndCancelTarget;

/*
 - aMessage와 버튼, 인디게이터를 포함하는 view[A]를 생성 후
 - container에 view[A]를 추가한다.
 */
+ (void) addNetIndicator:(UIView*)container message:(NSString*)aMessage tagAndCancelTarget:(id)viewTagAndCancelTarget selector:(SEL)cancelSelector;

@end
