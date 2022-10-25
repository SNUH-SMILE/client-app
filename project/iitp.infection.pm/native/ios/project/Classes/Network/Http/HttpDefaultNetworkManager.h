//
//  PPHttpDefaultNetworkManager.h
//

#import <Foundation/Foundation.h>

@protocol HttpDefaultNetworkManagerDelegate<PPNetworkManagerDelegate>

@end

@interface HttpDefaultNetworkManager : PPAbstractHttpNetworkManager<PPHttpProviderDelegate>

@end