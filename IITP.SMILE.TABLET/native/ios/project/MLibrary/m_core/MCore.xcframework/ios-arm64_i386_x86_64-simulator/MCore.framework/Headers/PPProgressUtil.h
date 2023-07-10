//
//  PPProgressUtil.h
//  Library
//
//  Created by  on 11. 9. 16..
//  Copyright 2011 . All rights reserved.
//

#import <Foundation/Foundation.h>

@class PPProgress;

@interface PPProgressView : UIView {
@private
    UILabel*    _percent;
    PPProgress* _progress;
}
@property (nonatomic, retain) UILabel*    percent;
@property (nonatomic, retain) PPProgress* progress;

@end

@interface PPProgressUtil : NSObject

+ (PPProgressView*) ppProgressStart:(UIView*)aView;

+ (void) ppProgressStop:(UIView*)aView;

@end

@interface PPProgress : UIView {
@private
    float minValue, maxValue;
	float currentValue;
	UIColor *lineColor, *progressRemainingColor, *progressColor;
}
@property (nonatomic, readwrite) float minValue, maxValue, currentValue;
@property (nonatomic, retain) UIColor *lineColor, *progressRemainingColor, *progressColor;

-(void)setNewRect:(CGRect)newFrame;

@end
