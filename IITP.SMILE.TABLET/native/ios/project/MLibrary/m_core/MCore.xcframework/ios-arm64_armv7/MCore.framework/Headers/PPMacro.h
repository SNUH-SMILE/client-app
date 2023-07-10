/*
 *  PPMacro.h
 *  MeerKat
 *
 *  Created by Uracle Lab on 11. 1. 13..
 *  Copyright 2011 . All rights reserved.
 *
 */

// == RELEASE SECTION =========================================================
#pragma mark -
#pragma mark release section

#define PP_RELEASE(__POINTER) {if (nil != (__POINTER)){[__POINTER release];__POINTER = nil;} else {}}
#define PP_CFRELEASE(__POINTER) {if (nil != (__POINTER)){CFRelease(__POINTER);__POINTER = nil;} else {}}

#import "MPCategoryBundle.h"

#define CORE_BUNDLE     @"MCore.bundle"

#define MPResource(res) [CORE_BUNDLE appendPath:res]
#define MPLocalizedString(key, comment) ( [[NSBundle internalAppBundle] localizedStringForKey:(key) value:nil table:nil] ) ? [[NSBundle internalAppBundle] localizedStringForKey:(key) value:nil table:nil] : comment