//
//  PPHttpDefaultNetworkManager.h
//

#import <Foundation/Foundation.h>

@protocol HttpDefaultNetworkManagerDelegate<PPNetworkManagerDelegate>

@end

@interface HttpHealthNetworkManager : PPAbstractHttpNetworkManager<PPHttpProviderDelegate>

@end
