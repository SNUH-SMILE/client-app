//
//  ExPPNetworkIndicator.m
//

#import <QuartzCore/QuartzCore.h>
#import "ExPPDefaultNetworkIndicator.h"

@implementation ExPPDefaultNetworkIndicator

// Indicator 생성
+ (void) pushNetIndicatorToView:(UIView *)targetView message:(NSString*)msg tagAndCancelTarget:(id)viewTagAndCancelTarget selector:(SEL)cancelSelector {
    
    if (!targetView || !viewTagAndCancelTarget) {
        NSLog(@"ExPPNetworkIndicator ERROR set pageCtrl or tagAndCancelTarget");
        return;
    }
    
    UIView *container = [targetView viewWithTag:NET_INDICATOR_TAG];
    
    if (!container) {
        container = [[UIView alloc] initWithFrame:targetView.frame];
        container.tag = NET_INDICATOR_TAG;
        container.bounds = targetView.bounds;
        container.center = targetView.center;
        container.autoresizesSubviews = YES;
        container.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
        container.backgroundColor = [UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:0.25f];
        
        [targetView addSubview:container];
     
    #if ! __has_feature(objc_arc)
        [container release];
    #endif
    }
    
    [self addNetIndicator:container message:msg tagAndCancelTarget:viewTagAndCancelTarget selector:cancelSelector];
}

// Indicator 제거
+ (void)popNetIndicatorFromView:(UIView *)ctrlMainView tagAndCancelTarget:(id)viewTagAndCancelTarget {
    UIView *container = [ctrlMainView viewWithTag:NET_INDICATOR_TAG];
    
    if (container) {
        UIView *indicator = [container viewWithTag:(NSUInteger)viewTagAndCancelTarget];
        if (indicator) {
            [indicator removeFromSuperview];
        }
        
        if (container.subviews.count == 0) {
            [container removeFromSuperview];
        }
    }
}

// Indicator 을 Container 에 추가
+ (void)addNetIndicator:(UIView*)container message:(NSString*)aMessage tagAndCancelTarget:(id)viewTagAndCancelTarget selector:(SEL)cancelSelector {
    
    BOOL hasMessage = (!aMessage || [aMessage isEqualToString:@""]) ? YES : NO;
    
    if (!hasMessage || cancelSelector) {
        
        UIToolbar *indicator = [[UIToolbar alloc] initWithFrame:CGRectZero];
        indicator.tag = (NSUInteger)viewTagAndCancelTarget;
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
        CGFloat imagey = (label.text == nil) ? indicatorHeight/2 : 42;
        image.center = spinner.center = CGPointMake(imagex, imagey);
        
        if (cancelSelector) {
            UIButton* cancelButton = [UIButton buttonWithType: UIButtonTypeCustom];
            [cancelButton setTitle:MPLocalizedString(@"mp_cancel", @"") forState: UIControlStateNormal];
            [cancelButton setAutoresizingMask:UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleTopMargin];
            
            cancelButton.frame = CGRectMake(labelRect.origin.x, labelRect.origin.y + labelRect.size.height + 8, labelRect.size.width, 44);
            
            [indicator addSubview:cancelButton];
            
        #if ! __has_feature(objc_arc)
            [cancelButton release];
        #endif
        
            indicatorHeight += 44;
        }
        
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
        indicator.tag = (NSUInteger)viewTagAndCancelTarget;
        indicator.frame = CGRectMake(0, 0, 80, 80);
        indicator.center = container.center;
        
        [container addSubview:indicator];
        
        [indicator startAnimating];
        
    #if ! __has_feature(objc_arc)
        [indicator release];
    #endif
    
    }
}

@end
