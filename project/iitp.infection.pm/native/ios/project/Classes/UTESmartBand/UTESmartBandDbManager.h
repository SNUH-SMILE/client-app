//
//  UTESmartBandDbManager.h
//  iitp.infection.pm
//
//  Created by 유라클 on 2021/11/29.
//

#import <Foundation/Foundation.h>

@interface UTESmartBandDbManager : NSObject

SHARED_h

- (BOOL) saveSbDevice :(NSString *) dId :(NSString *) dName :(NSDate *) firstSync :(NSDate *) lastSync;
- (BOOL) disconnectSbDevice;
- (NSMutableDictionary *) selectSbDevice :(NSString *) dId;
- (void) saveSynchronized :(int) index :(NSString *) identifier :(NSString *) date :(NSString *) date1 :(NSString *) time1 :(NSString *) date2 :(NSString *) time2 :(NSString *) v1 :(NSString *) v2 :(NSString *) v3 :(NSString *) v4 :(NSString *) v5 :(BOOL) overwrite;
- (NSMutableArray *) querySynchronized :(int) index :(NSString *) identifier :(NSString *) date;
- (NSString *) lastConnectedIdentifier;
- (NSMutableArray *) queryServerSync :(int) index;
- (void) saveServerSyncFinish :(int) index;
- (void) clearDB;
- (NSMutableArray *) selectPushList;
@end
