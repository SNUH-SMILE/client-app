/*
 * DataHandle.h
 * 
 * author 류경민(Brain Ryu)
 * version v 1.0.0
 * since : 2010.06.20
 * Date : 2010.07.04
 * email : ryeuf@nate.com
 * Company: URACLE
 * 
 * Copyright (c) URACLE, Inc. 2F Sunglim B/D. 201
 * Yeongdeungpo-Dong, Yeongdeungpo-gu, Seoul 150-037, All Rights Reserved.
 */

#import <Foundation/Foundation.h>

typedef enum PPServerByteOrder {
    PPLittleEndian,
    PPBigEndian
} PPServerByteOrder;

@interface DataHandle : NSObject <NSCopying>
{
    Byte              _paddingByte;
@private
	NSMutableData*    _data;
	uint              _ptr; 
    NSStringEncoding  _encoding;
    PPServerByteOrder _serverBytesOrder;
}
@property (nonatomic, assign) NSStringEncoding  encoding;
@property (nonatomic, assign) PPServerByteOrder serverBytesOrder;
@property (nonatomic, retain) NSMutableData*    data;
@property (nonatomic, assign) uint ptr;
@property (nonatomic, assign) Byte paddingByte;

#pragma mark -
#pragma mark init and delloc method

- (id) initWithSize:(uint)size;

- (void) dealloc;

#pragma mark -
#pragma mark util method

- (unsigned char*)buffer;

- (UInt16) length;

- (void) skip:(uint) scnt;

- (void) replaceBytes:(uint)start length:(uint)len data:(const char *)bytes;

//- (void) description:(NSString *)title;

#pragma mark -
#pragma mark copy method

- (DataHandle*) copyWithZone:(NSZone *)zone;

#pragma mark -
#pragma mark setter method

- (void) setBytes:(const unsigned char *)bs length:(uint)len;

- (void) setByte:(unsigned char) b;

- (void) setShort:(short) n length: (uint) len;

- (void) setInt:(int) n length:(uint)len;

- (void) setUnsinedInt:(unsigned int) n length: (uint) len;

- (void) setLong:(long) n length:(uint)len;

- (void) setString:(NSString *)str;

- (void) setString:(NSString *)str length: (uint) len;

- (void) setFillString:(NSString *)str length:(uint)len specialChar:(NSString *)sChar;

#pragma mark -
#pragma mark getter method

- (NSData *) getBytes: (uint) len;

- (unsigned char) getByte;

- (unsigned char) getByteNotMovePtr;

- (short) getShort: (uint) len;

- (int) getInt:(uint)len;

- (unsigned int) getUInt: (uint) len;

- (long) getLong:(uint)len;

- (unsigned long) getULong: (uint) len;

- (NSString *) getString:(uint) len;

- (NSString *) getStringNotTrim:(uint)len;


#pragma mark -
#pragma mark extends getter method

- (NSString *) getShortToString: (uint) len;

- (NSString *) getShortToCurrencyString: (uint) len;

- (NSString *) getIntToString: (uint)len;

- (NSString *) getIntToCurrencyString: (uint) len;

- (NSString *) getLongToString: (uint)len;

- (NSString *) getLongToCurrencyString: (uint) len;

- (NSString *) getFabsLongToCurrencyString: (uint) len;

- (NSString *) getULongToString: (uint)len;

- (NSString *) getULongToCurrencyString: (uint) len;

- (int) getStrToInt:(uint)len;

- (long) getStrToLong:(uint)len;

@end