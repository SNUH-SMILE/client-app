//
//  MIndicatorView.h
//

#import <UIKit/UIKit.h>

@interface MIndicatorView : UIView

@property (strong, nonatomic) NSString *message;
@property (nonatomic, strong) UIColor* textColor;
@property (nonatomic, strong) UIColor* spinnerTintColor;
@property (nonatomic, strong) UIColor* indicatorTintColor NS_AVAILABLE_IOS(7_0) UI_APPEARANCE_SELECTOR;

+ (MIndicatorView *)showInView:(UIView *)view;
+ (MIndicatorView *)showInView:(UIView *)view withMessage:(NSString *)message;

+ (void)hideInView:(UIView *)view;

@end
