//
//  MDatabaseManager.h
//

#import <Foundation/Foundation.h>

@interface MRecordSet : NSObject

@property (nonatomic, readonly) NSArray *fields;
@property (nonatomic, readonly) BOOL isFetchable;
@property (nonatomic, readonly) BOOL isClosed;
@property (nonatomic, readonly) NSDictionary *data;
@property (nonatomic, readonly) BOOL endOfFile; // EOF

- (BOOL)moveNext;
- (void)close;

@end

@interface MDatabaseManager : NSObject

//@property (nonatomic, readonly) NSString *storePath;
@property (strong, nonatomic) NSString *storePath;
@property (nonatomic, readonly) NSString *databaseName;
@property (nonatomic, readonly, getter=isCreated) BOOL created;
@property (nonatomic, readonly, getter=isOpened) BOOL opened;
@property (nonatomic, readonly) NSArray *queuedQueries;
@property (nonatomic, readwrite, getter=isEnabledQueue) BOOL enabledQueue;
@property (nonatomic, readonly, getter=isProcessing) BOOL processing;

- (id)initWithPath:(NSString *)path;

- (BOOL)createDatabase;
- (BOOL)deleteDatabase;
- (BOOL)openDatabase;
- (BOOL)closeDatabase;

- (void)asynchronousExecuteQuery:(NSString *)query;
- (MRecordSet *)executeQuery:(NSString *)query error:(NSError **)error;
- (NSArray *)executeQueryWithFile:(NSString *)queryFile error:(NSError **)error;

+ (MDatabaseManager *)defaultManagerWithPath:(NSString *)path;

@end
