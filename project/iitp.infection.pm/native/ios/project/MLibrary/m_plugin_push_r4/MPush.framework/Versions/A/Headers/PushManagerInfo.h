//
//  PushManagerInfo.h
//

#import <Foundation/Foundation.h>

@interface PushManagerInfo : NSObject

@property (nonatomic, readonly) NSString *clientUID;            // Client ID
@property (nonatomic, readonly) NSString *clientName;           // Client Name
@property (nonatomic, readonly) NSString *groupSequenceNumber;  // Group Sequence Number
@property (nonatomic, readonly) NSString *deviceUUID;           // Device UUID
@property (nonatomic, readonly) NSString *deviceType;           // Device Type Code (I)
@property (nonatomic, readonly) NSString *pushServiceID;        // Push Service ID (APNS token)
@property (nonatomic, readonly) NSString *pushServiceType;      // Push Service Type (APNS)
@property (nonatomic, readonly) NSString *phoneNumber;          // Phone Number

@property (nonatomic, readonly) NSString *applicationID;        // Applicaiton ID
@property (nonatomic, readonly) NSString *host;                 // Receiver Server Host URL
@property (nonatomic, readonly) NSString *receiverVersion;      // Receiver Version
@property (nonatomic, readonly) NSString *customerCode;         // Customer Code for Push ASP 3.0
@property (nonatomic, readonly) NSString *policy;               // Policy ( user:One-User Multi-Devices, device:One-Device One-User )

@property (nonatomic, readonly) NSString *applicationVersion;   // Application Version ( Build Version )
@property (nonatomic, readonly) NSString *osVersion;            // OS Version
@property (nonatomic, readonly) NSString *deviceModel;          // Device Model Name

@property (nonatomic, readonly) NSString *encryptVersion;       // Encryptor Version

@property (nonatomic, readonly) NSString *mode;					// DEV / REAL

@property (nonatomic, readonly) NSString *logServerHost;        // log Server Host URL

@property (nonatomic, readonly) BOOL isEncrypted;               // Active Encrypted Data
@property (nonatomic, readonly) BOOL useStorage;                // Active Storage Data
@property (nonatomic, readonly) BOOL useLog;                    // Use Log for Debugging

@property (nonatomic, readonly) BOOL hasData;                   // Check Data
@property (nonatomic, readonly) BOOL isValidated;               // Check Valid Data

@property (nonatomic) BOOL useCachedPushToken;					// Use Cashed Push Token (Default:NO)
//@property (nonatomic, readonly) NSString * const *customHost;			// 사용자 정의 Host 이 값이 설정되어있으면 manifest.xml에 설정된 값은 무시된다.

- (id)initWithStorage:(BOOL)useStorage;
- (id)initWithStorage:(BOOL)useStorage customHost:(NSString *)host;

- (void)resetStorageData;
- (void)resetPushServiceLastDate;
- (void)resetPushToken;

- (void)changeMode:(NSString *)mode;
- (void)changePhoneNumber:(NSString *)phoneNumber;
- (void)changeHost:(NSString *)host;
- (void)changeReceiverVersion:(NSString *)receiverVersion;

- (NSDictionary *)jsonObject;

- (void)setClientUID:(NSString *)value;
- (void)setPushServiceID:(NSString *)value;


@end
