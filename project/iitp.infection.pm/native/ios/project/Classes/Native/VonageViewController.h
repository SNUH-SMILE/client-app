//
//  VonageViewController.h
//
//  Created by 정종현 on 2022. 10. 26..
//
//

#import <UIKit/UIKit.h>

@interface VonageViewController : PPNativeViewController

@property (weak, nonatomic) IBOutlet UIView *pubContainer;
@property (weak, nonatomic) IBOutlet UIView *subContainer;

-(IBAction)backPage:(id)sender;

@end
