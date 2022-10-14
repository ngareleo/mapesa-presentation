package com.example.callsaul;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

public class SmsListener extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        // we get the message, perform a direct post upload and create a notification

        System.out.println("Trying something");
        Utils.createToast("Got message", true, (Activity) context);
        final Bundle bundle = intent.getExtras();
        try {
            if (bundle != null) {
                final Object[] pdusObj = (Object[]) bundle.get("pdus");

                for (Object o : pdusObj) {

                    SmsMessage currentMessage = SmsMessage.createFromPdu((byte[]) o);
                    String subject = currentMessage.getDisplayOriginatingAddress();
                    String message = currentMessage.getDisplayMessageBody();
                    int m_id = currentMessage.getIndexOnIcc();
                    System.out.printf("Subject : %s, Message: %s, ID: %d%n", subject, message, m_id);
                }
            }
        }catch (Exception e) {
            Log.e("SmsReceiver", "Exception smsReceiver" +e);

        }
    }
}
