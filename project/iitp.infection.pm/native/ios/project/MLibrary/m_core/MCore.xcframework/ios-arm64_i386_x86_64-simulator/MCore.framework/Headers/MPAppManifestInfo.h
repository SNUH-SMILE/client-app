//
//  MPAppManifestInfo.h
//  Library
//
//  Created by Uracle Lab on 12. 5. 17..
//  Copyright (c) 2012년 lab@uracle.co.kr. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MPAppManifestInfo : NSObject {
@private
	NSMutableDictionary *_info;
}
@property (nonatomic, readonly) NSMutableDictionary *info;
@property (nonatomic, readonly) NSString *releaseVersion;
@property (nonatomic, readonly) NSString *releaseDate;

+ (MPAppManifestInfo *) getInstance;

@end