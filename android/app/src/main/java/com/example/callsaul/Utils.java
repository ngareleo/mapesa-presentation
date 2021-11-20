package com.example.callsaul;

import android.app.Activity;
import android.widget.Toast;

public class Utils {

    public final static String URL_STRING = "https://3448-105-163-29-3.ngrok.io";
    public static void createToast(String message, boolean durationLong, Activity activity){
        int toastLength = (durationLong) ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(activity, message, toastLength);
        toast.show();
    }

}
