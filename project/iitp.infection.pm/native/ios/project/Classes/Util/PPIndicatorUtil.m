//
//  PPIndicatorUtil.m
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "PPIndicatorUtil.h"

@implementation PPIndicatorUtil

+ (void) simpleActivityIndicatorStart:(UIView*)aView message:(NSString*)aMessage
{
    if ([aView viewWithTag:INDICATOR_TAG]) {
        [self simpleActivityIndicatorStop:aView];
    }
    
    UIView* container = [[UIView alloc] initWithFrame:[aView bounds]];
    [container setAutoresizingMask:(UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight)];
    [container setBackgroundColor:[UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.25f]];
    [container setTag:INDICATOR_TAG];
    
    [aView addSubview:container];
    
    BOOL hasMessage = (!aMessage || [aMessage isEqualToString:@""]) ? YES : NO;
    
    if (!hasMessage) {
        
        UIToolbar *indicator = [[UIToolbar alloc] initWithFrame:CGRectZero];
        indicator.translucent = YES;
        indicator.backgroundColor = [UIColor colorWithWhite:0.0 alpha:0.1];
        indicator.layer.cornerRadius = 10;
        indicator.layer.masksToBounds = YES;
        
        UIActivityIndicatorView *spinner = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
        spinner.color = [UIColor darkGrayColor];
        spinner.hidesWhenStopped = YES;
        [indicator addSubview:spinner];
        
        UIImageView *image = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 28, 28)];
        [indicator addSubview:image];
        
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectZero];
        label.font = [UIFont boldSystemFontOfSize:16];
        label.textColor = [UIColor blackColor];
        label.backgroundColor = [UIColor clearColor];
        label.textAlignment = NSTextAlignmentCenter;
        label.baselineAdjustment = UIBaselineAdjustmentAlignCenters;
        label.numberOfLines = 0;
        label.text = aMessage;
        [indicator addSubview:label];
        
        CGRect labelRect = CGRectZero;
        CGFloat indicatorWidth = 100, indicatorHeight = 100;
        
        if (label.text != nil) {
            if ( [self isOverIOS7] ) {
                NSDictionary *attributes = @{NSFontAttributeName:label.font};
                NSInteger options = NSStringDrawingUsesFontLeading | NSStringDrawingTruncatesLastVisibleLine | NSStringDrawingUsesLineFragmentOrigin;
                labelRect = [label.text boundingRectWithSize:CGSizeMake(200, 300) options:options attributes:attributes context:NULL];
                labelRect.origin.x = 18;
                labelRect.origin.y = 66;
            }
            else {
                CGSize maximumLabelSize = CGSizeMake(200, 300); // this width will be as per your requirement
                CGSize expectedSize = [label sizeThatFits:maximumLabelSize];

                labelRect.size.width = expectedSize.width;
                labelRect.size.height = expectedSize.height;
                labelRect.origin.x = 18;
                labelRect.origin.y = 66;
            }

            indicatorWidth = labelRect.size.width + 36;
            indicatorHeight = labelRect.size.height + 93;

            if (indicatorWidth < 100) {
                indicatorWidth = 100;
                labelRect.origin.x = 0;
                labelRect.size.width = 100;
            }
        }
        
        label.frame = labelRect;
        
        CGFloat imagex = indicatorWidth/2;
        CGFloat imagey = (label.text == nil) ? indicatorHeight/2 : 36;
        image.center = spinner.center = CGPointMake(imagex, imagey);
        
        indicator.bounds = CGRectMake(0, 0, indicatorWidth, indicatorHeight);
        
        indicator.autoresizingMask = (UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleBottomMargin);
        indicator.center = container.center;
        
        [container addSubview:indicator];
        
        [spinner startAnimating];
        
    #if ! __has_feature(objc_arc)
        [spinner release];
        [image release];
        [label release];
        [indicator release];
    #endif
    
    }
    else {
    
        UIActivityIndicatorView *indicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
        indicator.frame = CGRectMake(0, 0, 80, 80);
        indicator.center = container.center;
        
        [container addSubview:indicator];
        
        [indicator startAnimating];
        
    #if ! __has_feature(objc_arc)
        [indicator release];
    #endif
    
    }
    
#if ! __has_feature(objc_arc)
    [container release];
#endif
}

+ (void) simpleActivityIndicatorStart:(UIView*)aView {
    //[self simpleActivityIndicatorStart:aView message:@"잠시만 기다려 주세요."];
    [self simpleActivityIndicatorStart:aView message:nil];
}

+ (void) simpleActivityIndicatorStop:(UIView*)aView {
    BOOL main = [NSThread isMainThread];

    if (!main) {
        dispatch_async(dispatch_get_main_queue(), ^{
            UIView* view = [aView viewWithTag:INDICATOR_TAG];
            if(view) [view removeFromSuperview];
        });
    }
    else {
        UIView* view = [aView viewWithTag:INDICATOR_TAG];
        if(view) [view removeFromSuperview];
    }
}

@end
