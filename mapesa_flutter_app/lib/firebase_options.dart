// File generated by FlutterFire CLI.
// ignore_for_file: lines_longer_than_80_chars, avoid_classes_with_only_static_members
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyA_tPXnn8lVHSarTDDquFHjH7lP1tNmjZ0',
    appId: '1:532752553044:web:ea378c2558349c210e89c1',
    messagingSenderId: '532752553044',
    projectId: 'mapesa-e44c3',
    authDomain: 'mapesa-e44c3.firebaseapp.com',
    databaseURL: 'https://mapesa-e44c3-default-rtdb.firebaseio.com',
    storageBucket: 'mapesa-e44c3.appspot.com',
    measurementId: 'G-741Y5NSWJK',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyA_BQlfnVNGcvFTSwaBI1Z7REi6nNpJNEw',
    appId: '1:532752553044:android:3317f6a4be7e65d30e89c1',
    messagingSenderId: '532752553044',
    projectId: 'mapesa-e44c3',
    databaseURL: 'https://mapesa-e44c3-default-rtdb.firebaseio.com',
    storageBucket: 'mapesa-e44c3.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyDO2HLzJ3pGZKvqDVrMDHi0pQ1K7emSkBI',
    appId: '1:532752553044:ios:0186b5512cd8d3ae0e89c1',
    messagingSenderId: '532752553044',
    projectId: 'mapesa-e44c3',
    databaseURL: 'https://mapesa-e44c3-default-rtdb.firebaseio.com',
    storageBucket: 'mapesa-e44c3.appspot.com',
    iosClientId:
        '532752553044-36tbtg6a0geqjp4atjp5ffiudhiljnch.apps.googleusercontent.com',
    iosBundleId: 'com.example.mapesaFlutterApp',
  );
}
