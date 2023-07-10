//
//  PPIndicatorUtil.h
//

@interface PPIndicatorUtil : PPCommonIndicatorUtil

+ (void) simpleActivityIndicatorStart:(UIView*)aView message:(NSString*)aMessage;
+ (void) simpleActivityIndicatorStart:(UIView*)aView;
+ (void) simpleActivityIndicatorStop:(UIView*)aView;

@end