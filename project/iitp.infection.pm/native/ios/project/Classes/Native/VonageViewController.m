//
//  VonageViewController.h
//
//  Created by 정종현 on 2022. 10. 26..
//
//

#import "VonageViewController.h"
#import <OpenTok/OpenTok.h>

@interface VonageViewController ()<OTSessionDelegate, OTSubscriberDelegate, OTPublisherDelegate>
{
    CGRect lframe;
    CGRect sframe;
}
@property (nonatomic) OTSession *session;
@property (nonatomic) OTPublisher *publisher;
@property (nonatomic) OTSubscriber *subscriber;
@end

@implementation VonageViewController
- (void)viewDidLoad {
    NSString *apikey = [[_parameters objectForKey:@"apikey"] stringByRemovingPercentEncoding];
    NSString *sessionid = [[_parameters objectForKey:@"sessionid"] stringByRemovingPercentEncoding];
    NSString *token = [[_parameters objectForKey:@"token"] stringByRemovingPercentEncoding];
    
    [super viewDidLoad];

    
    _session = [[OTSession alloc] initWithApiKey:apikey
                                       sessionId:sessionid
                                        delegate:self];
    
    [self doConnect:token];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    
    lframe = self.pubContainer.frame;
    sframe = self.subContainer.frame;
    
    UIPinchGestureRecognizer *pubPinch = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(pubPinchAction:)];
    [self.pubContainer addGestureRecognizer:pubPinch];
    
    UIPanGestureRecognizer *pubPan = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pubPanAction:)];
    [self.pubContainer addGestureRecognizer:pubPan];

    UIPinchGestureRecognizer *subPinch = [[UIPinchGestureRecognizer alloc] initWithTarget:self action:@selector(subPinchAction:)];
    [self.subContainer addGestureRecognizer:subPinch];
    
    UIPanGestureRecognizer *subPan = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(subPanAction:)];
    [self.subContainer addGestureRecognizer:subPan];
}

- (void)pubPinchAction:(UIPinchGestureRecognizer *)sender
{
    self.pubContainer.transform = CGAffineTransformScale(self.pubContainer.transform, sender.scale, sender.scale);
    sender.scale = 1.0;
}

- (void)pubPanAction:(UIPanGestureRecognizer *)sender
{
    CGPoint translation = [sender translationInView:self.pubContainer];
    self.pubContainer.center = CGPointMake(sender.view.center.x + translation.x, sender.view.center.y + translation.y);
    [sender setTranslation:CGPointZero inView:self.pubContainer];
}

- (void)subPinchAction:(UIPinchGestureRecognizer *)sender
{
    self.subContainer.transform = CGAffineTransformScale(self.subContainer.transform, sender.scale, sender.scale);
    sender.scale = 1.0;
}

- (void)subPanAction:(UIPanGestureRecognizer *)sender
{
    CGPoint translation = [sender translationInView:self.subContainer];
    self.subContainer.center = CGPointMake(sender.view.center.x + translation.x, sender.view.center.y + translation.y);
    [sender setTranslation:CGPointZero inView:self.subContainer];
}


/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (void)doConnect:(NSString *)token
{
    OTError *error = nil;
    
    [_session connectWithToken:token error:&error];
    if (error)
    {
        [self showAlert:[error localizedDescription]];
    }
}

/**
 * Sets up an instance of OTPublisher to use with this session. OTPubilsher
 * binds to the device camera and microphone, and will provide A/V streams
 * to the OpenTok session.
 */
- (void)doPublish
{
    OTPublisherSettings *settings = [[OTPublisherSettings alloc] init];
    settings.name = [UIDevice currentDevice].name;
    _publisher = [[OTPublisher alloc] initWithDelegate:self settings:settings];
   
    OTError *error = nil;
    [_session publish:_publisher error:&error];
    if (error)
    {
        [self showAlert:[error localizedDescription]];
    }
    
    [self.pubContainer insertSubview:_publisher.view atIndex:0];
    [_publisher.view setFrame:CGRectMake(0, 0, self.pubContainer.frame.size.width, self.pubContainer.frame.size.height)];
    [_publisher.view setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
}

/**
 * Cleans up the publisher and its view. At this point, the publisher should not
 * be attached to the session any more.
 */
- (void)cleanupPublisher {
    [_publisher.view removeFromSuperview];
    _publisher = nil;
    // this is a good place to notify the end-user that publishing has stopped.
}

/**
 * Instantiates a subscriber for the given stream and asynchronously begins the
 * process to begin receiving A/V content for this stream. Unlike doPublish,
 * this method does not add the subscriber to the view hierarchy. Instead, we
 * add the subscriber only after it has connected and begins receiving data.
 */
- (void)doSubscribe:(OTStream*)stream
{
    _subscriber = [[OTSubscriber alloc] initWithStream:stream delegate:self];
    [_subscriber setViewScaleBehavior:OTVideoViewScaleBehaviorFit];
    OTError *error = nil;
    [_session subscribe:_subscriber error:&error];
    if (error)
    {
        [self showAlert:[error localizedDescription]];
    }
}

/**
 * Cleans the subscriber from the view hierarchy, if any.
 * NB: You do *not* have to call unsubscribe in your controller in response to
 * a streamDestroyed event. Any subscribers (or the publisher) for a stream will
 * be automatically removed from the session during cleanup of the stream.
 */
- (void)cleanupSubscriber
{
    [_subscriber.view removeFromSuperview];
    _subscriber = nil;
}

# pragma mark - OTSession delegate callbacks

- (void)sessionDidConnect:(OTSession*)session
{
    NSLog(@"sessionDidConnect (%@)", session.sessionId);
    
    // Step 2: We have successfully connected, now instantiate a publisher and
    // begin pushing A/V streams into OpenTok.
    [self doPublish];
}

- (void)sessionDidDisconnect:(OTSession*)session
{
    NSString* alertMessage =
    [NSString stringWithFormat:@"Session disconnected: (%@)",
     session.sessionId];
    NSLog(@"sessionDidDisconnect (%@)", alertMessage);
}


- (void)session:(OTSession*)mySession
  streamCreated:(OTStream *)stream
{
    NSLog(@"session streamCreated (%@)", stream.streamId);
    if (nil == _subscriber)
    {
        [self doSubscribe:stream];
    }
}

- (void)session:(OTSession*)session
streamDestroyed:(OTStream *)stream
{
    NSLog(@"session streamDestroyed (%@)", stream.streamId);
    
    if ([_subscriber.stream.streamId isEqualToString:stream.streamId])
    {
        [self cleanupSubscriber];
    }
}

- (void)  session:(OTSession *)session
connectionCreated:(OTConnection *)connection
{
    NSLog(@"session connectionCreated (%@)", connection.connectionId);
}

- (void)    session:(OTSession *)session
connectionDestroyed:(OTConnection *)connection
{
    NSLog(@"session connectionDestroyed (%@)", connection.connectionId);
    if ([_subscriber.stream.connection.connectionId
         isEqualToString:connection.connectionId])
    {
        [self cleanupSubscriber];
    }

    [self cleanupPublisher];
    
    [PPToastUtil createSimpleToast:@"상대방이 통화를 종료하였습니다." duration:3000];
    
    [self backPage:nil];
}

- (void) session:(OTSession*)session
didFailWithError:(OTError*)error
{
    NSLog(@"didFailWithError: (%@)", error);
}

# pragma mark - OTSubscriber delegate callbacks

- (void)subscriberDidConnectToStream:(OTSubscriberKit*)subscriber
{
    NSLog(@"subscriberDidConnectToStream (%@)",
          subscriber.stream.connection.connectionId);
    assert(_subscriber == subscriber);
    [_subscriber.view setFrame:CGRectMake(0, 0, self.subContainer.frame.size.width,
                                          self.subContainer.frame.size.height)];
    [self.subContainer insertSubview:_subscriber.view atIndex:0];
    [_subscriber.view setAutoresizingMask:UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight];
}

- (void)subscriber:(OTSubscriberKit*)subscriber
  didFailWithError:(OTError*)error
{
    NSLog(@"subscriber %@ didFailWithError %@",
          subscriber.stream.streamId,
          error);
}

# pragma mark - OTPublisher delegate callbacks

- (void)publisher:(OTPublisherKit *)publisher
    streamCreated:(OTStream *)stream
{
    NSLog(@"Publishing");
}

- (void)publisher:(OTPublisherKit*)publisher
  streamDestroyed:(OTStream *)stream
{
    if ([_subscriber.stream.streamId isEqualToString:stream.streamId])
    {
        [self cleanupSubscriber];
    }
    
    [self cleanupPublisher];
}

- (void)publisher:(OTPublisherKit*)publisher
 didFailWithError:(OTError*) error
{
    NSLog(@"publisher didFailWithError %@", error);
    [self cleanupPublisher];
}

- (void)showAlert:(NSString *)string
{
    // show alertview on main UI
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:@"OTError"
                                                                         message:string
                                                                  preferredStyle:UIAlertControllerStyleAlert];
        [self presentViewController:alertVC animated:YES completion:nil];
    });
}

-(IBAction)backPage:(id)sender
{
    OTError *error = nil;
    [_session disconnect:&error];
    
    PPParameters* param = [[PPParameters alloc] init];
    [self historyBackWithParamObject:param animation:PPAnimationDefault];
}

-(IBAction)on1Click:(id)sender
{
    self.pubContainer.frame = lframe;
    self.subContainer.frame = sframe;
    [self.sContainer bringSubviewToFront:self.subContainer];
}
-(IBAction)on2Click:(id)sender
{
    self.subContainer.frame = lframe;
    self.pubContainer.frame = sframe;
    [self.sContainer bringSubviewToFront:self.pubContainer];
}
-(IBAction)on3Click:(id)sender
{
    self.subContainer.frame = CGRectMake(0, 0, lframe.size.width, lframe.size.height/2);
    self.pubContainer.frame = CGRectMake(0, lframe.size.height/2, lframe.size.width, lframe.size.height/2);
}


@end
