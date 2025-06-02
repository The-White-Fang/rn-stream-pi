package com.streampi;

import android.content.Context;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class StreamPiModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public StreamPiModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "StreamPi";
    }

    @ReactMethod
    public void getDisplayMetrics(Promise promise) {
        try {
            WindowManager windowManager = (WindowManager) reactContext.getSystemService(Context.WINDOW_SERVICE);
            DisplayMetrics metrics = new DisplayMetrics();
            windowManager.getDefaultDisplay().getMetrics(metrics);

            WritableMap displayInfo = Arguments.createMap();
            displayInfo.putInt("width", metrics.widthPixels);
            displayInfo.putInt("height", metrics.heightPixels);
            displayInfo.putDouble("density", metrics.density);
            displayInfo.putDouble("scaledDensity", metrics.scaledDensity);
            displayInfo.putDouble("xdpi", metrics.xdpi);
            displayInfo.putDouble("ydpi", metrics.ydpi);

            promise.resolve(displayInfo);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to get display metrics", e);
        }
    }

    @ReactMethod
    public void getDeviceInfo(Promise promise) {
        try {
            WritableMap deviceInfo = Arguments.createMap();
            deviceInfo.putString("platform", "android");
            deviceInfo.putString("model", android.os.Build.MODEL);
            deviceInfo.putString("manufacturer", android.os.Build.MANUFACTURER);
            deviceInfo.putString("version", android.os.Build.VERSION.RELEASE);
            deviceInfo.putString("sdkVersion", String.valueOf(android.os.Build.VERSION.SDK_INT));

            promise.resolve(deviceInfo);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to get device info", e);
        }
    }

    @ReactMethod
    public void getStoragePath(Promise promise) {
        try {
            String storagePath = reactContext.getFilesDir().getAbsolutePath();
            promise.resolve(storagePath);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to get storage path", e);
        }
    }
} 