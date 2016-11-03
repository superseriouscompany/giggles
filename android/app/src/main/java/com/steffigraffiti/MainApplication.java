package com.steffigraffiti;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.rnfs.RNFSPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImageResizerPackage(),
            new RNFSPackage(),
            new ImagePickerPackage(),
            new InAppBillingBridgePackage(),
            new ReactNativeAudioPackage(),
            new RNFSPackage(),
            new InAppBillingBridgePackage(),
            new ImagePickerPackage(),
            new ReactNativeAudioPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
