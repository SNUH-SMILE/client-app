//
//  UTESmartBandClient.h
//  UTESmartBandClient
//
//  Created by VV on 14/11/28.
//  Copyright © 2014年 vv. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import <UIKit/UIKit.h>
#import "UTEManagerDelegate.h"
#import "UTEModel.h"

#pragma mark - UTESmartBandClient

typedef void(^cardApduResponseBlock)(NSData * _Nullable data,BOOL success);

/*!
 *  UTESmartBandClient
 */
@interface UTESmartBandClient : NSObject

/**
 *   Default false .
 */
@property (nonatomic,assign ) BOOL  debugUTELog;
/**
 *  Delegate
 */
@property (nonatomic,weak   ) id<UTEManagerDelegate> _Nullable delegate;
/**
 *  Bluetooth status
 */
@property (nonatomic,assign,readonly) UTEBluetoothState     bluetoothState;
/**
 *  Whether the device is in sync data
 */
@property (nonatomic,assign,readonly) BOOL  isSyncDevices;
/**
 *  When the device is synchronizing data, the app can also send other commands
 */
@property (nonatomic,assign,readonly) BOOL  isHandleSync;
/**
 *  Whether the device is being upgraded
 */
@property (nonatomic,assign,readonly) BOOL  isUpdateDevices;
/**
 *  Whether the device is testing heart rate
 */
@property (nonatomic,assign,readonly) BOOL  isHeartDetecting;
/**
 *  Whether the device is testing blood pressure
 */
@property (nonatomic,assign,readonly) BOOL  isBloodDetecting;
/**
 *  Whether the device is testing blood oxygen
 */
@property (nonatomic,assign,readonly) BOOL  isBloodOxygenDetecting;
/**
 *  Whether the device is testing respiration
 */
@property (nonatomic,assign,readonly) BOOL  isRespirationDetecting;
/**
 *  Whether the device is testing Body fat
 */
@property (nonatomic,assign,readonly) BOOL  isBodyFatDetecting;
/**
 *  Whether the device is testing ECG
 */
@property (nonatomic,assign,readonly) BOOL  isECGDetecting;
/**
 *  Device sport mode status
 */
@property (nonatomic,assign,readonly) UTEDeviceSportModeStatus  sportModeStatus;
/**
 *  Device's sharing system notification permission on the mobile phone's Bluetooth interface
 */
@property (nonatomic,assign,readonly) BOOL  ancsAuthorized NS_AVAILABLE_IOS(13_0);
/**
 *  See UTEDeviceSportMode
 */
@property (nonatomic,assign,readonly) UTEDeviceSportMode  sportMode;
/**
 *  Whether the device is changing device feature.
 *  Note:When isRKDevices=YES, don't need to consider this value.
 */
@property (nonatomic,assign,readonly) BOOL  isChangeFeature;
/**
 *  Whether the heart rate is being calibrated.
 *  Note:Any value sent by the App to the device during the calibration process is invalid.
 */
@property (nonatomic,assign,readonly) BOOL  isHRMCalibrating;
/**
 *  Whether the 'Raise wrist' is being calibrated.
 *  Note:Any value sent by the App to the device during the calibration process is invalid.
 */
@property (nonatomic,assign,readonly) BOOL  isRaiseHandCalibrating;
/**
 *  Connected device
 *  Note: When disconnected, value is nil
 */
@property (nonatomic,strong,readonly) UTEModelDevices  * _Nullable connectedDevicesModel;
/**
 *  Sets the name of the specified device to be scanned. It is case sensitive. The default is nil.
 */
@property (nonatomic,copy  ) NSString    * _Nullable filterName;
/**
 *  Set the signal strength of the device to be scanned.
 *  Range(0 > filerRSSI > -100, default -70)
 */
@property (nonatomic,assign) NSInteger    filerRSSI;
/**
 *  Specify a device to scan, which services are included. e.g. [@"55dd",@"66ff"], default nil.
 *  Note:You can use third-party software (Lightblue) to connect the device to view the broadcast UUID.
 *  (Lightblue has key value Service UUIDs in Adverisement Data)
 */
@property (nonatomic,strong) NSArray      * _Nullable filerServers;
/**
 *  Scan multiple devices, each containing services. e.g. @[ @[@"55dd",@"66ff"], @[@"22dd",@"33ff"] ]
 *  Note:You can use third-party software (Lightblue) to connect the device to view the broadcast UUID.
 *  (Lightblue has key value Service UUIDs in Adverisement Data)
 */
@property (nonatomic,strong) NSArray      * _Nullable filerServersArray;
/**
 *  Scan devices repeatedly, default NO.
 *  Note:If yes,the signal value of the device is updated in real time during the scanning process.
 */
@property (nonatomic,assign) BOOL         isScanRepeat;
/**
 *  Scan devices without filtering, default NO.
 *  Note:If yes,filterName/filerServers/filerServersArray is invalid.
 *  Delegate uteManagerDiscoverDevices: will show all surrounding devices
 */
@property (nonatomic,assign) BOOL         isScanAllDevice;
/**
 *  Set this value in advance, and then call the connected device. When the connection status between the device and the app changes,
 *  when the app is in the background, the phone will pop up a system dialog prompt. Default UTEDeviceAlertTypeNone.
 *  Note:DeviceAlertType only works if Bluetooth background permissions are not enabled in "Background Mode" in xcode.
 */
@property (nonatomic,assign) UTEDeviceAlertType   deviceAlertType;
/**
 *   Whether the device is RK platform
 */
@property (nonatomic,assign,readonly) BOOL isRKDevices;
/**
 *   Whether the device is NR platform
 */
@property (nonatomic,assign,readonly) BOOL isNRDevices;
/**
 *   Whether the device is SYD platform
 */
@property (nonatomic,assign,readonly) BOOL isSYDDevices;
/**
 *   Does the device's connection require a password
 */
@property (nonatomic,assign,readonly) BOOL isHasPassword;
/**
 *   Whether the connection of the device needs to set a user ID
 *   See setUTEUserID:
 *
 *   Note:If YES, App must set the ID (the device will verify that it is connected to the same App).
 *   If the ID is not set or the ID is inconsistent, the device will not process any instructions
 *   and will actively disconnect after 30 seconds.
 */
@property (nonatomic,assign,readonly) BOOL isHasUserID;
/**
 *   Raw data log
 */
@property (nonatomic,assign) BOOL isOpenRawDataLog;
/**
 *   Device is transportation card
 */
@property (nonatomic,assign) BOOL         isCardDevices;
/** 
 *   Whether the Apdu channel is open
 */
@property (nonatomic,assign,readonly) BOOL isOpenApdu;
/**
 *  Data returned by Apdu channel
 */
@property (nonatomic,copy) cardApduResponseBlock _Nullable  cardApduResponseBlock;
@property (nonatomic,assign) BOOL           dailTest;

#pragma mark - UTESmartBandClient

/**
 *  @return UTESmartBandClient
 */
+ (UTESmartBandClient *_Nonnull)sharedInstance;

/**
 *  @discussion Initialize UTESmartBandClient to allow SDK to obtain Bluetooth management and proxy permissions
 */
- (void)initUTESmartBandClient;

/**
 *  @discussion Scan for surrounding devices
 */
- (void)startScanDevices;

/**
 *  @discussion Stop scanning devices
 */
- (void)stopScanDevices;

/**
 *  @discussion Connect the device
 *
 *  @param model identifier cannot be nil
 *  Note:If you can’t connect to the device for a long time, please call disConnectUTEModelDevices first, and then call connectUTEModelDevices after 0.3 seconds. This may improve the chance of connection.
 */
- (void)connectUTEModelDevices:(UTEModelDevices *_Nonnull)model;

/**
*  @discussion Check if the QR code is valid
*
*  @param qrCode identifier cannot be nil
*
*  @return If valid(e.g @"78:55:55:65:33:88"), returns the Bluetooth advertisement address by the device. As well see UTEModelDevices.advertisementAddress .
*/
- (NSString *_Nullable)checkUTEDeviceQRCode:(NSString *_Nonnull)qrCode;

/**
 *  @discussion Disconnect the device
 *
 *  @param model identifier cannot be nil
 *
 *  @return Whether this method is actually executed
 */
- (BOOL)disConnectUTEModelDevices:(UTEModelDevices *_Nonnull)model;

/**
 *  @discussion Set some device information
 *
 *  @param option See UTEOption
 *
 *  @return Whether this method is actually executed. You can invoke checkUTEDevicesStateIsEnable: method to check if it can be set.
 */
- (BOOL)setUTEOption:(UTEOption)option;

/**
 *  @discussion Set alarm
 *
 *  @param array See UTEModelAlarm (Up to 3)
 *  @param count Number of alarm vibrations (0-9); if the UTEModelAlarm attribute 'countVibrate' is not equal to 0, then 'countVibrate' will prevail.
 */
- (void)setUTEAlarmArray:(NSArray<UTEModelAlarm *> *_Nonnull)array vibrate:(NSInteger)count;

/**
 *  @discussion Sedentary reminder (12 to 14 noon and night sleep time, no reminder)
 *  Note:When isHasSitRemindDuration = Yes，please invoke sendUTESitRemindModel:
 *
 *  @param remindTime How long to sit for long, then remind. Unit minute,range<10,180>.
 */
- (void)setUTESitRemindOpenTime:(NSInteger)remindTime;

/**
 *  @discussion Turn off sedentary reminder
 */
- (void)setUTESitRemindClose;

/**
 *  @discussion Please invoke setUTEInfoModel:
 *
 */
//- (BOOL)setUTEInfoHeigh:(CGFloat)heigh
//                 weight:(NSInteger)weight
//                  light:(NSInteger)sec
//            sportTarget:(NSInteger)sportTarget
//              handlight:(BOOL)handlight
//               maxHeart:(NSInteger)maxHeart NS_DEPRECATED_IOS(2_0,7_0, "Implement setUTEInfoModel: instead");


/**
 *   @discussion Set up additional information
 *   Please invoke 'setUTEOption:' to set the device unit( meters or feet) before calling this method.
 *   If it is not invoke 'setUTEOption:', or invoke fails, the distance and calories may all be 0.
 *
 *   @param model See UTEModelDeviceInfo
 *
 */
- (BOOL)setUTEInfoModel:(UTEModelDeviceInfo *_Nonnull)model;

/**
 *  @discussion   How often is the heart rate detected.
 *  In the process of scanning device A, when device A (parameter isSwitchHeart=Yes), device A supports this method regardless of whether device A is connected in the future.
 *
 *  @param isAuto automatic detection
 *
 *  @param time  Range 1 ~ 23 (Unit hour)
 */
- (void)setUTEHeartAuto:(BOOL)isAuto time:(NSInteger)time;

/**
 *  @discussion   How often is the blood pressure detected.
 *  Required isHasBloodAutoTest=Yes.
 *
 *  @param isAuto automatic detection
 *
 *  @param time   Detect every few hours, range 1 ~ 23
 */
- (void)setUTEBloodPressureAuto:(BOOL)isAuto time:(NSInteger)time;

/**
 *  @discussion Send password
 *
 *  @param password Must be a 4-digit number. e.g. @"1234"
 *
 *  @param type See UTEPasswordType
 */
- (void)sendUTEPassword:(NSString *_Nonnull)password type:(UTEPasswordType)type;

/**
 *  @discussion Custom key
 *  If there is a key, you must set it every time you open the App.
 *
 *  @param key e.g. @"90370abc1c1adc1a7d0439fb2cb7e522"
 */
- (void)setUTESDKKey:(NSString *_Nonnull)key;

/**
 *  @discussion Set User ID
 *  Required isHasUserID=Yes
 *  See delegate uteManagerUserIDStatus:
 *
 *  Note:If the ID is incorrect, the device will be disconnected directly.
 */
- (void)setUTEUserID:(NSUInteger)ID;

/**
 *  @discussion Read User ID
 *  Required isHasUserID=Yes
 *
 *  Note:If ID = 0,indicates that the device has no ID.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEUserID:(void(^_Nullable)(NSUInteger ID))result;

/**
 *  @discussion Read UV
 *
 *  @param result UV index. Range:0~15
 *
 *  Note:Corresponding 5 levels.
 *  Weakest:0~2
 *  Weak:3~5
 *  Medium:6~8
 *  Strong:9~11
 *  Very strong:12 or more
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceUV:(void(^_Nullable)(NSInteger value))result;

/**
 *  @discussion Check if there is a new version of the firmware.
 *  Callback uteManagerDevicesSate:error:
 *  Note:Run the App once during debugging, you can access the server 5 times in a row, and then please run the App again to continue access.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)checkUTEFirmwareVersion;

/**
 *  @discussion Check if method UTEOption can be called OR Is it possible to set up or perform other operations on the device.
 *  For example, when isSyncDevices=YES, isHeartDetecting=YES, isBloodDetecting=YES, isECGDetecting=YES, isUpdateDevices=YES, other values cannot be sent.
 *
 *  Exceptions: 1. When the device is in the process of testing heart rate, you can send UTEOptionHeartDetectingStop / UTEOptionCloseCameraMode, regardless of the return value.
 *  Exception: 2. When the device is in the process of testing blood pressure, UTEOptionBloodDetectingStop / UTEOptionCloseCameraMode can be sent, regardless of the return value.
 *  Exception: 3. When the device sportModeStatus !=UTEDeviceSportModeStatusClose, you can call the method setUTESportModel: to stop the current motion state.
 *
 *  When isOpenApdu=YES,UTEOption instructions are invalid, this method returns false.
 *
 *  @return value
 */
- (BOOL)checkUTEDevicesStateIsEnable;

/**
 *  @discussion Start firmware upgrade
 *  Callback during upgrade: uteManagerUpdateProcess:
 *  Callback when the upgrade fails or succeeds: uteManagerDevicesSate:error:
 *
 *  Note:Before upgrading, it is recommended to judge the power of the device. When the power is greater than 50, the method upgrade is called, otherwise it is easy to fail.
 */
- (void)beginUpdateFirmware;

/**
 *  @discussion Change device feature. See UTEDeviceFeature
 *
 *  @param isSuccess result
 *
 *  'isMustUpdate' Have to force upgrade（If you do n’t upgrade, the original features will not work）
 *
 */
- (void)changeDeviveFeature:(void(^_Nullable)(BOOL isSuccess,BOOL isMustUpdate))isSuccess;

/**
 *  @discussion Do not disturb
 *
 *  @param type See UTESilenceType
 *
 *  @param start time e.g. @"08:30"
 *
 *  @param end   time e.g. @"23:00"
 *
 *  @param except as follows
 *  Note:
 *  1.When except is Yes, it means "Do not disturb" in the range of (e.g 08: 30 ~ 23: 00), which is not related to the parameter type. But outside of this time, it is related to type and is controlled by the type attribute UTESilenceType.
 *  2.When except is No, it means that “Do Not Disturb” in one day is controlled by the type attribute UTESilenceType, which is not related to startTime and endTime.
 *  3.If you want to turn off 'Do Not Disturb', set except=NO and type to UTESilenceTypeNone.
 *
 *  4."Do not disturb" can not set separate functions at multiple different times, such as setting [UTESilenceTypeVibration] at a certain time A, and then setting B [UTESilenceTypeMessage] at a certain time.
 *  5."Do Not Disturb" can only be set uniformly within a certain time [Do Not Disturb], and then set UTESilenceType outside of this time A.
 */
- (void)sendUTEAllTimeSilence:(UTESilenceType)type exceptStartTime:(NSString *_Nonnull)start endTime:(NSString *_Nonnull)end except:(BOOL)except;

/**
 *  @discussion Set the 7-day weather of the device
 *  Required:isHasWeatherSeven = YES
 *
 *  @param weatherArray It contains 7 days of weather information, and each day is a UTEModelWeather
 *  Please place them in order, index 0 is the first day (today) ... index 6 is the seventh day, and you need to write 7 models.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)sendUTESevenWeather:(NSArray<UTEModelWeather*> *_Nonnull)weatherArray;

/**
 *  @discussion Set the 2-day weather of the device
 *  Required:isHasWeather = YES
 *
 *  @param todayType    See UTEWeatherType
 *  @param currentTemp  Current Temperature
 *  @param maxTemp      Highest temperature today
 *  @param minTemp      Lowest temperature today
 *  @param pm25         Today PM2.5
 *  @param aqi          Air quality today
 *
 *  @param tomorrowType See UTEWeatherType
 *  @param tmrMax       Highest temperature tomorrow
 *  @param tmrMin       Lowest temperature tomorrow
 */
- (void)sendUTETodayWeather:(UTEWeatherType)todayType
                currentTemp:(NSInteger)currentTemp
                    maxTemp:(NSInteger)maxTemp
                    minTemp:(NSInteger)minTemp
                       pm25:(NSInteger)pm25
                        aqi:(NSInteger)aqi
               tomorrowType:(UTEWeatherType)tomorrowType
                     tmrMax:(NSInteger)tmrMax
                     tmrMin:(NSInteger)tmrMin;
/**
 *  @discussion Get the corresponding weather type according to the weather code
 *
 *  @param weatherCode e.g. 101 ,See https://dev.heweather.com/docs/refer/condition
 *
 *  @return See UTEWeatherType
 *
 *  Note:You can freely organize all weather into the types supported by the device.So, this method does not necessarily call.
 */
- (UTEWeatherType)getUTEWeatherType:(NSInteger)weatherCode;

/**
 *  @discussion Get weather information
 *
 *  @param cityID  e.g. @"CN101010100" OR City name (sometimes data is not available)  See https://dev.heweather.com/docs/refer/city
 *
 *  Note:No longer supported, please use other methods to get online weather information
 */
- (void)getUTEWeatherDataFormServer:(NSString *_Nonnull)cityID success:(void (^_Nullable)(id _Nullable data))success failure:(void (^_Nullable)(NSError * _Nullable error))failure NS_DEPRECATED_IOS(2_0,7_0, "No longer supported");

/**
 *  @discussion See what 'Dial' information the server can replace
 *
 *  @param sdkkey    e.g. @"dd124a55b7c6f6e6a5d"
 *  @param device    see UTEModelDeviceDisplayModel. Invoke readUTEDisplayInfoFormDevice:
 
 *  @param success success
 *  @param failure System (network) error
 */
- (void)getUTEDisplayInfoFormServer:(NSString *_Nonnull)sdkkey
                             device:(UTEModelDeviceDisplayModel *_Nonnull)device
                            success:(void (^_Nullable)(NSArray<UTEModelDeviceDisplayModel *> *_Nullable))success
                            failure:(void (^_Nullable)(NSError *_Nullable))failure;

/**
 *  @discussion View 'Dial' information supported by the device
 *  Required:isHasSwitchDialOnline = YES
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDisplayInfoFormDevice:(void (^_Nullable)(UTEModelDeviceDisplayModel *_Nullable model))result;

/**
 *  @discussion Send a new 'Dial' (to replace the device's screen display).
 *  Required:isHasSwitchDialOnline=YES.
 *
 *  Note:Invoke getUTEDisplayModelFormServer:success:failure to get the dial data
 *  If the app enters the background, the SDK sending data may be suspended by the system,
 *  and the app will continue to send automatically when it returns to the foreground.
 *
 *  @param binData  firmware (bin file) data. Or see getUTEDisplayModelFormServer:success:failure
 *  @param process  Data sending progress(0 ~ 1.0)
 *
 *  @param success  success
 *  @param failure  error.code See UTEErrorCode
 *
 *  @return It sends successfully or fails
 */
- (BOOL)sendUTEDisplayDataToDevice:(NSData *_Nonnull)binData
                           process:(void (^_Nullable)(CGFloat process))process
                           success:(void (^_Nullable)(void))success
                           failure:(void (^_Nullable)(NSError *_Nullable error))failure;

/**
 *  @discussion Change device background image or font color, and get a new bin file.
 *  Required:isHasSwitchDialOnline=YES.
 *
 *  @param backgroundImage  It is recommended that the size of the picture is the same as the size of the device screen,
 *                          otherwise it will be distorted.(UTEModelDeviceDisplayModel have device size).
 *
 *  @param fontColor  Font color. Colors cannot have transparency.
 *  @param dialIndex  See UTEModelDialInfo()
 *
 *  @param success  UTEModelDialInfo:Get a new Dial.
 *  Then you can call sendUTEDisplayDataToDevice:process:success:failure, and the device interface will change display.
 */

- (void)changeUTEDialBackgroundImage:(UIImage *_Nullable)backgroundImage
                             fontColor:(UIColor *_Nullable)fontColor
                           dialIndex:(NSInteger)dialIndex
                               success:(void (^_Nullable)(UTEModelDialInfo *_Nullable dialInfo))success
                               failure:(void (^_Nullable)(void))failure;

/**
 *  @discussion Get customizable dial information.
 *  Required:isHasSwitchDialOnline=YES.
 *
 *  @param model see UTEModelDeviceDisplayModel. Invoke readUTEDisplayInfoFormDevice.
 *
 *  @return All dials. If it nil, there is no customizable dial.Your UI designer can make the dial resource pack by himself,
 *  and then the developer can invoke method getUTECustomDialInfoFromUnzippedPath: to get the resource pack information.
 *  Please use the reference documents provided by us to make the resource pack.
 */
- (NSArray<UTEModelDialInfo *> *_Nullable)getUTECustomDialDefualtInfo:(UTEModelDeviceDisplayModel *_Nonnull)model;

/**
*  @discussion Get customizable dial(zip url) from server.
*  Required:isHasSwitchDialOnline=YES.
*
*  @param model see UTEModelDeviceDisplayModel. Invoke readUTEDisplayInfoFormDevice.
*
*  @param success . If there is data on the server, zipDials is not empty, otherwise is null.
*
*/
- (void)getUTECustomDialInfoFromServer:(NSString *_Nonnull)sdkkey
                                device:(UTEModelDeviceDisplayModel *_Nonnull)model
                               success:(void (^_Nullable)(NSArray<UTEModelDialServer *> *_Nullable zipDials))success
                               failure:(void (^_Nullable)(void))failure;
/**
 *  @discussion Get customizable dial from unzipped Path.
 *  Required:isHasSwitchDialOnline=YES.
 *
 *  @param unzippedPath unzip the file to get the destination path of the unzipped file.
 *  @param model see UTEModelDeviceDisplayModel. Invoke readUTEDisplayInfoFormDevice.
 *
 *  Note: Invoke getUTEDisplayInfoFormServer:device:success:failure to get customDial.zip download link.
 *  Download customDial.zip from UTEModelDialServer.zipUrl, then unzip the file to get the destination path of the unzipped file.
 *  Or Make a custom resource package according to file 《App自定义表盘制作规范》.
 *  
 *  @return All dials. If it nil, there is no customizable dial OR There is a problem with the unzippedPath, please see the SDK log.
 */
- (NSArray<UTEModelDialInfo *> *_Nullable)getUTECustomDialInfoFromUnzippedPath:(NSString *_Nonnull)unzippedPath defaultInfo:(UTEModelDeviceDisplayModel *_Nonnull)model;

/**
 *  @discussion Display and wearing style
 *
 *  @param wearType  See UTEWearType
 *  @param sreenType See UTEDeviceSreenDisplayType
 */
- (void)sendUTEWearType:(UTEWearType)wearType sreenType:(UTEDeviceSreenDisplayType)sreenType;

/**
 *  @discussion ibeacon
 *
 *  @param option     See UTEIbeaconOption
 *  @param dataString as follows:
 *
 *   UTEIbeaconOptionUUID:  Range(0~9 and not case sensitive a~f) Data length must be equal to 32
 *                          e.g. @"a2b9c738cc9d846aef90639e0e4c9562"
 *
 *   UTEIbeaconOptionMajor: Range(0~65535) Numbers e.g. @"55365"
 *
 *   UTEIbeaconOptionMinor:  Range(0~65535) Numbers e.g. @"65"
 *
 *   UTEIbeaconOptionName:   Range(0~9 and case sensitive a~Z and English symbols on keyboard) Data length is up to 14
 *                           e.g. @"UTE_001"
 *   UTEIbeaconOptionTXPower: Range(1~254) Numbers e.g.@"55"
 *
 *   UTEIbeaconOptionAdvertisingInterval: Range(1~20) Numbers e.g. @"5" (Unit is 100 ms),mean 5*100 = 500ms
 *
 *  @return It sends successfully or fails
 */
- (BOOL)sendUTEIbeacon:(UTEIbeaconOption)option dataString:(NSString *_Nonnull)dataString;

/**
 *  @discussion    Read ibeacon data
 *
 *  @param option  See UTEIbeaconOption
 */
- (void)readUTEIbeacon:(UTEIbeaconOption)option;

/**
 *  @discussion   Set sedentary reminder
 *  Required:isHasSitRemindDuration = Yes
 *
 *  @param model  See UTEModelDeviceSitRemind
 */
- (void)sendUTESitRemindModel:(UTEModelDeviceSitRemind *_Nonnull)model;

/**
 *  @discussion Setting the menstrual
 *
 *  @param  model See UTEModelDeviceMenstruation
 *
 *  @return It sends successfully or fails
 */
- (BOOL)sendMenstruationRemind:(UTEModelDeviceMenstruation *_Nonnull)model;

/**
 *  @discussion  Send custom data to the device
 *  Callback uteManagerSendCustomDataResult:
 *
 *  @param data  The length cannot exceed 108 bytes;
 *  if it exceeds, please send it again after a callback, and each time cannot exceed 108 bytes.
 *
 *  @param flagSync Synchronize historical data.
 */
- (void)sendUTECustomData:(NSData *_Nonnull)data flagSync:(BOOL)flagSync;

/**
 *  @discussion  Send a custom string to the device
 *
 *  @param model See UTEModelDeviceCustomMsg
 */
- (void)sendUTECustomMsg:(UTEModelDeviceCustomMsg *_Nonnull)model;

/**
 *  @discussion  Send contacts to the device
 *  Required:isHasContact=Yes
 *
 *  @param array @[UTEModelContactInfo...]
 */
- (void)sendUTEContactInfo:(NSArray<UTEModelContactInfo *> *_Nonnull)array callback:(void (^_Nullable)(void))callback;

/**
 *  @discussion Customize the language of the device display interface
 *  During the language sending process (approximately 8 seconds, the longer the text, the longer the time), please do not send other command, otherwise the device displays incomplete text.
 *  Required:isHasMultiLanguage=YES
 *
 *  Note:When isHasLanguageSwitchDirectly=YES,please invoke setUTELanguageSwitchDirectly
 */
- (void)setUTELanguageInterface:(UTEModelDeviceInterface *_Nonnull)model;
/**
 *  @discussion Switch device language
 *  Required:isHasLanguageSwitchDirectly=YES
 *
 */
- (void)setUTELanguageSwitchDirectly:(UTEDeviceLanguage)language;

/**
 *  @discussion Information push for the specified app
 *  Required:isHasSocialNotification=Yes OR isHasSocialNotification2=Yes OR isHasIconANCS=Yes
 *
 */
- (void)setUTERemindApp:(UTEModelDeviceRemindApp *_Nonnull)model;
/**
 *  @discussion Correction device to monitor sleep
 *  Required:isHasCustomSleep=Yes
 *
 *  Note:
 *  1. Minimum 3 hours of sleep range at night
 *  2. Minimum 1 hour of siesta range
 *  3. Sleep correction is only for night sleep monitoring and will take effect from tonight.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)setUTESleepAdjustParam:(UTEModelDeviceSleepAdjust *_Nonnull)model;

/**
 *  @discussion Show and hide custom UI interface
 *  Required:isHasCustomDeviceUI=Yes
 *
 *  @param  array See UTEModelDeviceCustomUI
 */
- (void)setUTEDeviceCustomUIStatus:(NSArray<UTEModelDeviceCustomUI *> *_Nonnull)array;

/**
 *  @discussion Read device version
 *  The device will automatically read it once it is connected.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceVersion;

/**
 *  @discussion Read device address
 *  The device will automatically read it once it is connected.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceAddress;

/**
 *  @discussion Read the current riding status of the device
 *
 *  @param  result YES or NO
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceBicycleStatus:(void(^_Nullable)(BOOL isRiding))result;

/**
 *  @discussion Read the current device ball status
 *
 *  @param  result Only one ball can be opened or all closed (allClose = Yes)
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceBallStatus:(void(^_Nullable)(UTEDeviceBallType type, BOOL open, BOOL allClose))result;

/**
 *  @discussion Read the current device interface (show and hide) status
 *
 *  @param  result the status of the support interface
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceCustomUIStatus:(void(^_Nullable)(NSArray<UTEModelDeviceCustomUI *> *_Nullable array))result;

/**
 *  @discussion Read device GPS status
 *
 *  @param  result See UTEDeviceGPSStatus
 *  Note:Because there is a lot of GPS data and the storage capacity of the device is limited, it is recommended to send the command UTEOptionDeleteGPSData to delete the GPS data on the device after synchronizing the GPS data.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTEDeviceGPSStatus:(void(^_Nullable)(UTEDeviceGPSStatus status))result;

/**
 *  @discussion Read heart rate status
 *  Whether the device is detecting heart rate
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readHRMStatus:(void(^_Nullable)(BOOL isHeartDetecting))result;

/**
 *  @discussion Read Blood Oxygen status
 *  Whether the device is detecting
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readBloodOxygenStatus:(void(^_Nullable)(BOOL isDetecting))result;

/**
 *  @discussion Read respiration status
 *  Whether the device is detecting
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readRespirationStatus:(void(^_Nullable)(BOOL isDetecting))result;

/**
 *  @discussion Read the connected device signal value
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceRSSI:(void(^_Nullable)(NSInteger rssi))result;

/**
 *  @discussion Read device body fat status
 *  Whether the device is detecting body fat
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceBodyFatStatus:(void(^_Nullable)(BOOL isDetecting))result;

/**
 *  @discussion Read the language of the current device
 *  Required: isHasReadLanguage=YES
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceLanguage:(void(^_Nullable)(UTEDeviceLanguage language))result;

/**
 *  @discussion Read which languages the current device supports
 *  Required: isHasReadSupportLanguage=YES
 *
 *  supports:NSArray e.g. @[@UTEDeviceLanguageChinese, @UTEDeviceLanguageEnglish...]
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceLanguageSupport:(void(^_Nullable)(UTEDeviceLanguage currentLanguage,NSArray<NSNumber *> * _Nullable supports))result;

/**
 *  @discussion What other types of data are not yet synchronized (or what new data)
 *  Required:isHasDataStatus=YES
 *
 *  @param  result UTEModelDeviceDataStatus Not yet synchronized (or new) data attribute is YES
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceDataStatus:(void(^_Nullable)(UTEModelDeviceDataStatus *_Nullable status))result;

/**
 *  @discussion Read if the device has data to save offline ECG history
 *
 *  @param  result (Format:yyyy-MM-dd-HH-mm) If there is ECG data, the date of the historical data is returned, otherwise nil.
 *
 *  Note:It is recommended to call this method before synchronizing the ECG data of the device, so that the progress percentage of the synchronization will be displayed truthfully.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceECGHistoryDate:(void(^_Nullable)(NSString *_Nullable strDate))result;

/**
*  @discussion Sampling frequency of device's ECG
*
*  @param result
*   frequency. This parameter may be needed when drawing an ECG.How many points are there per second.
*   ignore. The result of the test needs to delete the initial number of points.
*
*
*  @return It sends successfully or fails
*/
- (BOOL)readDeviceECGSamplingfrequency:(void(^_Nullable)(NSInteger frequency ,NSInteger ignore))result;

/**
 *  @discussion Read which shortcut buttons are supported by the device
 *  Required:isHasShortcutButton=YES
 *
 *  Please see delegate uteManagerShortcutBtnSupport:
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceShortcutBtnSupport;

/**
 *  @discussion Read the status of device shortcut buttons
 *  Required:isHasShortcutButton=YES
 *  Callback uteManagerShortcutBtnStatus:closeType
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceShortcutBtnStatus;

/**
 *  @discussion Which app icons are built into the device
 *  Required:isHasIconANCS=YES
 *
 *  @param result arrayApp See UTEDeviceApp(please convert NSNumber to UTEDeviceApp).
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceSupportAppListANCS:(void(^_Nullable)(NSArray<NSNumber *> * _Nullable arrayApp))result;

/**
 *  @discussion Test body fat
 *
 *  @param  open  Start or stop
 *  @param  model If you are testing body fat, you must set UTEModelDeviceBodyFatConfig
 *
 *  @return It sends successfully or fails
 */
- (BOOL)monitorBodyFat:(BOOL)open config:(UTEModelDeviceBodyFatConfig *_Nonnull)model;

/**
 *  @discussion   Set Body Fat Information
 *  @param  model See UTEModelDeviceBodyFatConfig
 */
- (BOOL)setUTEBodyFatInfo:(UTEModelDeviceBodyFatConfig *_Nonnull)model;

/**
 *  @discussion ECG test
 *
 *  @param  open  Start or stop
 *
 *  @return It sends successfully or fails
 */
- (BOOL)monitorECG:(BOOL)open;

/**
 *  @discussion Calibrate body temperature
 *  Required:isHasCalibrateBodyTemperature = YES
 *  @param  temp      Calibration temperature. Unit Celsius. Exact two decimal places
 *  e.g. @"16.55" @"16" ,range 0.01~255 .
 *
 *  @param  complete  Calibration succeeded or failed
 *
 *  @return It sends successfully or fails
 */
- (BOOL)calibrateBodyTemp:(NSString *_Nonnull)temp complete:(void(^_Nullable)(BOOL success))complete;

/**
 *  @discussion Read the compensation value of the current calibration temperature
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readDeviceCalibrateBodyTemp:(void(^_Nullable)(NSString *_Nullable temp))result;

/**
 *  @discussion Sync data (from a certain date to today)
 *  Required:isHasDataStatus = YES
 *
 *  @param  time From that day. Format:yyyy-MM-dd-HH-mm e.g. @"2018-08-30-09-30"
 *  @param  type See UTEDeviceDataType
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)syncDataCustomTime:(NSString *_Nonnull)time type:(UTEDeviceDataType)type;

/**
 *  @discussion Time for automatic Blood Oxygen test
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setBloodOxygenAutoTest:(BOOL)open time:(UTEBloodOxygenTestTime)testTime;

/**
 *  @discussion Duration of automatic test BloodOxygen
 *  When method (setBloodOxygenAutoTest:time:) parameter open is YES, this method is valid.
 *
 *  @param open  If YES,  BloodOxygen is automatically test between startTime and endTime.
 *               If NO,  BloodOxygen testing throughout the day.
 *
 *  @param startTime  e.g. @"08:30"
 *  @param endTime    e.g. @"18:00"
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setBloodOxygenAutoTestDuration:(BOOL)open startTime:(NSString *_Nonnull)startTime endTime:(NSString *_Nonnull)endTime;

/**
 *  @discussion Time for automatic Respiration test
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setRespirationAutoTest:(BOOL)open time:(UTERespirationTestTime)testTime;

/**
 *  @discussion Duration of automatic test Respiration
 *  When method (setRespirationAutoTest:time:) parameter open is YES, this method is valid.
 *
 *  @param open  If YES,  Respiration is automatically test between startTime and endTime.
 *               If NO,  Respiration testing throughout the day.
 *
 *  @param startTime  e.g. @"08:30"
 *  @param endTime    e.g. @"18:00"
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setRespirationAutoTestDuration:(BOOL)open startTime:(NSString *_Nonnull)startTime endTime:(NSString *_Nonnull)endTime;

/**
 *  @discussion Sync data (from a certain date to today)
 *  Required:isHasBodyTemperature = YES
 *
 *  @param  time From that day. Format:yyyy-MM-dd-HH-mm e.g. @"2018-08-30-09-30"
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)syncBodyTemperature:(NSString *_Nonnull)time;

/**
 *  @discussion Time for automatic body temperature test
 *  Required:isHasBodyTemperature = YES
 *
 *  @param open  If YES,turn on automatic temperature test.
 *               If NO,turn off automatic temperature test.
 *
 *  @param testTime See UTEBodyTempTestTime (Test frequency)
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setBodyTemperatureAutoTest:(BOOL)open time:(UTEBodyTempTestTime)testTime;

/**
 *  @discussion Duration of automatic test body temperature
 *  Required:isHasBodyTemperature = YES
 *  When method (setBodyTemperatureAutoTest:time:) parameter open is YES, this method is valid.
 *
 *  @param open  If YES,  body temperature is automatically test between startTime and endTime.
 *               If NO,  body temperature testing throughout the day.
 *
 *  @param startTime  e.g. @"08:30"
 *  @param endTime    e.g. @"18:00"
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setBodyTemperatureAutoTestDuration:(BOOL)open startTime:(NSString *_Nonnull)startTime endTime:(NSString *_Nonnull)endTime;

/**
 *  @discussion Set body temperature device alarm value
 *  If the body temperature(UTEModelBodyTemperature.bodyTemperature) exceeds the maximum or minimum value,lasts longer than one minute,
 *  the device will alert. See UTEDevicesSateBodyTempAlarm.
 *  Required:isHasBodyTemperature = YES
 *
 *  Max OR Min Temperature range 35 ~ 42.
 *
 *  @param  open  Enable alarm
 *  @param  max   Maximum temperature.
 *  @param  min   Minimum temperature.
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setBodyTemperatureAlarmOpen:(BOOL)open max:(CGFloat)max alarmMin:(CGFloat)min;

/**
 *  @discussion Open body temperature Funtion2(original data collection)
 *
 *  Required:isHasBodyTemperatureFunction2 = YES
 *
 *  @param  open If YES, During the test, UTEModelBodyTemperature.ambientTemperature/shellTemperature have value .
 *                 If NO, During the test, UTEModelBodyTemperature.bodyTemperature/shellTemperature have value .
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)setBodyTemperatureEnableFuntion2:(BOOL)open;

/**
 *  @discussion Read Body Temperature Funtion2 Status
 *
 *  Required:isHasBodyTemperatureFunction2 = YES
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)readBodyTemperatureFuntion2Status:(void(^_Nullable)(BOOL open))result;

/**
 *  @discussion Read Current Body Temperature Current
 *
 *  Required:isHasBodyTemperature = YES
 *
 *  @return It sends successfully or fails
 *
 */
- (BOOL)readBodyTemperatureCurrent;

/**
 *  @discussion Read the status of the device's sport mode
 *  Required:isHasSportHRM = YES
 *
 *  Note:When isHasHeadsetHRM=YES, please invoke readUTESportHeadsetModelStatus
 *  Each time the device is successfully connected, the SDK will automatically read it once.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTESportModelStatus:(void(^_Nullable)(UTEDeviceSportMode mode,UTEDeviceSportModeStatus status))callback;
/**
 *  @discussion Read the status of the Headset's sport mode.
 *  Each time the device is successfully connected, the SDK will automatically read it once.
 *
 *  Required:isHasHeadsetHRM=YES
 *  Callback: uteManagerHeadsetSport
 *
 *  @return It sends successfully or fails
 */
- (BOOL)readUTESportHeadsetModelStatus;

/**
 *  @discussion Set sport mode on or off
 *  Required:isHasSportHRM=YES
 *
 *  Note:When isHasHeadsetHRM=YES please invoke setUTESportHeadsetModel.
 *  Method uteManagerReceiveSportHRM to monitor heart rate and other data.
 *
 *  @param  open Open or close
 *  @param  hrmTime How often does the device save the heart rate value.
 *  @param  mode See UTEDeviceSportMode
 *  @param  callback When the device receives command, there is a callback.OR see delegate uteManagerReceiveSportMode:status
 *
 *  Note:If the device has opened a sport mode A, and then turn it on or off a sport mode(Not Sport Mode A), then there is no callback.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)setUTESportModel:(UTEDeviceSportMode)mode
                    open:(BOOL)open
                 hrmTime:(UTEDeviceIntervalTime)hrmTime
                callback:(void(^_Nullable)(UTEDeviceSportMode mode,BOOL open))callback;

/**
 *  @discussion Set sport mode pause
 *  Required:isHasSportPause=YES
 *
 *  @param info See UTEDeviceSportModeInfo
 *  Note:Set the parameters(UTEDeviceSportModeInfo) ensure that the activity duration of the App is consistent with the activity duration of the device.
 *  See delegate uteManagerReceiveSportMode:
 *
 *  @return It sends successfully or fails
 */
- (BOOL)setUTESportModelPause:(UTEDeviceSportModeInfo *_Nonnull)info;

/**
 *  @discussion Set sport mode continue
 *  Required:isHasSportPause=YES
 *
 *  @param info See UTEDeviceSportModeInfo
 *  Note:Set the parameters(UTEDeviceSportModeInfo) ensure that the activity duration of the App is consistent with the activity duration of the device.
 *  See delegate uteManagerReceiveSportMode:
 *  
 *  @return It sends successfully or fails
 */
- (BOOL)setUTESportModelContinue:(UTEDeviceSportModeInfo *_Nonnull)info;

/**
 *  @discussion Set sport mode Info
 *  Required:isHasSportPause=YES
 *
 *  @param info See UTEDeviceSportModeInfo
 *  Note:You should set the parameters(UTEDeviceSportModeInfo) every second by invoke this method.
 *  In order to keep the device time consistent with the app time during exercise.
 *  There is no need to invoke this method after the exercise is over.
 *
 *  @return It sends successfully or fails
 */
- (BOOL)setUTESportModelInfo:(UTEDeviceSportModeInfo *_Nonnull)info;

/**
 *  @discussion Set Headset sport mode on or off
 *  Required:isHasHeadsetHRM=YES
 *
 *  Note:If the app and device are disconnected for 10 minutes, the heart rate headset will automatically end the exercise.
 *  Status can be monitored through method uteManagerHeadsetSport
 *
 *  @param  open Open or close
 *  @param  hrmTime Unit second, Range(1~200). How often have a heart rate.
 *   Method uteManagerReceiveSportHRM to monitor heart rate and other data.
 *
 *  @param  mode See UTEDeviceSportMode
 *
 *  @return It sends successfully or fails
 */
- (BOOL)setUTESportHeadsetModel:(UTEDeviceSportMode)mode
                           open:(BOOL)open
                        hrmTime:(NSInteger)hrmTime;

/**
 *  @discussion Sync data(All sport data from a certain day to today)
 *  Required:isHasSportHRM=YES
 *  See UTEDevicesSateSyncSuccess,key:kUTEQuerySportHRMData.
 *
 *  @param  time From that day. Format:yyyy-MM-dd-HH-mm  e.g. @"2018-08-30-09-30"
 *
 *  @return It sends successfully or fails
 */
- (BOOL)syncUTESportModelCustomTime:(NSString *_Nonnull)time;

/**
 *  @discussion Modify Bluetooth name
 *  Required:isHasModifyBluetoothName=YES
 *
 *  @param  name The maximum length is 10. Only numbers, English letters, and symbols such as - _ space are supported.
 *
 *  @return It sends successfully or fails
 *
 *  Note:After the modification is completed, you need to restart the Bluetooth device or send UTEOptionDeleteDevicesAllData to factory settings after a delay of more than 0.2 seconds) before the device name takes effect.
 *  1. Because the system has a cache, the system will update the cache after connecting to the device again, and you will see the new name in the next scan.
 *   2. Because the system has a cache, you can also view the broadcast attribute advertisementData in the UTEModelDevices. The key value kCBAdvDataLocalName will change according to the device name in real time.
 */
- (BOOL)modifyUTEBluetoothName:(NSString *_Nonnull)name success:(void(^_Nullable)(BOOL ok))success;

/**
 *  @discussion Check which known devices are connected to the system.
 *
 *  Note:Currently Apple does not provide a method to query which devices and systems are paired
 *
 *  @param  UUID What services does the device have, can fill in one or more services. e.g. @[@"EFF5"].
 *  See mServicesConnectedUUID in UTEModelDevices.
 *
 *  @return If there are no connected devices, 0 will be returned. If yes, then only attributes 'identifier' and 'name' in UTEModelDevices have values.
 */
- (NSArray<UTEModelDevices *> *_Nullable)retrieveConnectedDeviceWithServers:(NSArray<NSString *> *_Nonnull)UUID;

/**
 *  @discussion Check local firmware
 *
 *  @url firmware path
 *  e.g. @"/var/mobile/Containers/Data/Application/xxxxx/SH0AV0000564.bin"
 *  e.g. @"/var/mobile/Containers/Data/Application/xxxxx/SH0AV0000564.img"
 *
 *  @return Is the firmware valid. If Yes , You can invoke method beginUpdateFirmware to upgrade the firmware.
*/
- (BOOL)updateLocalFirmwareUrl:(NSString *_Nonnull)url;

/**
 *  @discussion Current SDK version
 *
 *  @return e.g. @"2.12.13"
 *
 *  Note:If it is a four digit such as @"2.3.10.8", then the last 8 is the 8th debug version.
 */
- (NSString *_Nonnull)sdkVersion;

#pragma mark - Factory Test
/**
 *  @discussion Test for light leakage
 *  Required:isHasFactoryLightLeakage = YES
 *
 *  reesult Temporarily invalid, it can only mean that the device has received the value of the App.
 *  @return It sends successfully or fails.
 */
- (BOOL)factoryReadLightLeakage:(void(^_Nullable)(BOOL success,NSInteger value))result;
- (void)factoryCloseTestLightLeakage;
/**
 *  @discussion Screen auxiliary display
 */
- (void)factoryPostDisplayOpen:(BOOL)open;
/**
 *  @discussion Turn on device stress test
 */
- (void)factoryTestTypeOpenType:(UTEDeviceFactoryType)type result:(void(^_Nullable)(UTEDeviceFactoryType type))result;
- (void)factoryModel:(BOOL)open;
- (void)factoryVibration:(NSInteger)count;
- (void)factoryOriginalSource:(NSString *_Nonnull)cmd;

- (void)factoryOpenTestRGB:(BOOL)open;
- (void)factoryOpenTestTP:(BOOL)open;
- (void)factoryOpenTestGsensor:(BOOL)open;
- (void)factoryOpenTestGPS:(BOOL)open satelliteID:(NSInteger)satelliteID range:(NSInteger)range reference:(NSInteger)reference result:(void(^_Nullable)(BOOL success))result;
- (void)factoryOpenTestNFC:(void(^_Nullable)(BOOL success))result;
- (void)factorySetting:(NSString *_Nonnull)cmd;
- (void)factoryReadGyroData:(void(^_Nullable)(NSInteger range,NSInteger x,NSInteger y,NSInteger z))result;
- (void)factoryReadGeomagnetism:(void(^_Nullable)(BOOL success, CGFloat x,CGFloat y,CGFloat z))result;
- (void)factoryReadAliIC:(void(^_Nullable)(BOOL success))result;

- (void)setUpdateRKLogOpen:(BOOL)open key:(NSString *_Nonnull)key;
- (void)setUpdateRKSilent:(BOOL)silent key:(NSString *_Nonnull)key;

#pragma mark - UTESmartBandClient Traffic card method
/**
 *  @discussion Close channel
 */
- (void)cardCloseApduChannel;
/**
 *  @discussion Send data to the device
 *
 *  @param data Traffic card data
 */
- (void)cardApduSendData:(NSData *_Nonnull)data;

#pragma mark - Used to test firmware local upgrade
- (BOOL)localUpdate:(NSString *_Nonnull)name type:(NSString *_Nonnull)type updateVer:(void(^_Nullable)(NSString *_Nullable updateVer))callback;

#pragma mark - This is an outdated API, compatible with previous versions
/******************************* Do not use *******************************/

- (void)allocateUTEData:(NSData *_Nonnull)data userInfo:(id _Nullable)userInfo response:(BOOL)response;

/******************************* Do not use  ******************************/



@end
