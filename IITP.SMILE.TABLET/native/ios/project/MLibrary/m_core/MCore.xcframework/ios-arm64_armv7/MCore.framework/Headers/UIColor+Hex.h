//
//  UIColor+Hex.h
//  MDebug
//
//  Created by ProgDesigner on 2015. 11. 12..
//
//

#import <UIKit/UIKit.h>

@interface UIColor (Hex)

+ (UIColor *)colorWithHex:(NSString *)hexString;
+ (UIColor *)colorWithHex:(NSString *)hexString alpha:(CGFloat)alpha;

@end
