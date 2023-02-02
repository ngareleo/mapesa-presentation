import 'package:firebase_auth/firebase_auth.dart';

class UserHandler {
  bool isSignedIn() {
    User? currentUser;
    FirebaseAuth.instance.authStateChanges().listen((User? user) {
      currentUser = user;
    });
    return currentUser != null;
  }
}
