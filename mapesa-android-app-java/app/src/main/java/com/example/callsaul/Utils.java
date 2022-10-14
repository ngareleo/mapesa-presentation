package com.example.callsaul;

import android.app.Activity;
import android.widget.Toast;

public class Utils {

    public final static String URL_STRING = "http://29a1-105-163-55-68.ngrok.io";
    public static void createToast(String message, boolean durationLong, Activity activity){
        int toastLength = (durationLong) ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(activity, message, toastLength);
        toast.show();
    }

}
