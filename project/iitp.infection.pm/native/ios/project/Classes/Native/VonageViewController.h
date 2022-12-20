//
//  VonageViewController.h
//
//  Created by 정종현 on 2022. 10. 26..
//
//

#import <UIKit/UIKit.h>

@interface VonageViewController : PPNativeViewController

@property (weak, nonatomic) IBOutlet UIView *sContainer;
@property (weak, nonatomic) IBOutlet UIView *pubContainer;
@property (weak, nonatomic) IBOutlet UIView *subContainer;

-(IBAction)backPage:(id)sender;
-(IBAction)on1Click:(id)sender;
-(IBAction)on2Click:(id)sender;
-(IBAction)on3Click:(id)sender;

@end
