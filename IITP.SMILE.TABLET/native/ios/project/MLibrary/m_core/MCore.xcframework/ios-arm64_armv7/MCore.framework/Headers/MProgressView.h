//
//  MProgressView.h
//

#import <UIKit/UIKit.h>

@interface MProgressView : UIView

@property (nonatomic, readwrite) float progress;
@property (nonatomic, strong) UIColor* progressTintColor;
@property (nonatomic, strong) UIColor* trackTintColor;
@property (nonatomic, strong) UIColor* textColor;
@property (nonatomic, strong) UIColor* spinnerTintColor;
@property (nonatomic, strong) UIColor* indicatorTintColor NS_AVAILABLE_IOS(7_0) UI_APPEARANCE_SELECTOR;

+ (MProgressView *)showInView:(UIView *)view;
+ (void)hideInView:(UIView *)view;

@end
