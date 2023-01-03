package com.example.callsaul;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.database.Cursor;
import android.database.sqlite.SQLiteException;
import android.net.Uri;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;

public class DatabaseReader {


    private static final Object REQUEST_CODE_ASK_PERMISSIONS = 123;

    public static ArrayList<HashMap<String, String>> getUnreadMessages(Activity callingActivity, int boundary){
        callingActivity.requestPermissions(new String[]{Manifest.permission.READ_SMS}, (Integer) REQUEST_CODE_ASK_PERMISSIONS);
        ArrayList<HashMap<String, String>> transactions = new ArrayList<>();
        final String SMS_URI_INBOX = "content://sms/inbox";
        try {
            int counter = 0;
            Uri uri = Uri.parse(SMS_URI_INBOX);
            System.out.printf("Boundary is %d", boundary);
            String[] projection = new String[] { "_id", "address", "person", "body", "date", "type" };
            Cursor cur = callingActivity.getContentResolver().query(uri,
                    projection,
                    "address = ? AND _id > ?",
                    new String[]{"MPESA", String.valueOf(boundary)},
                    "date desc");
            if (cur.moveToFirst()) {
                int _id = cur.getColumnIndex("_id");
                int index_Body = cur.getColumnIndex("body");
                do{
                    int ID = cur.getInt(_id);
                    String body = cur.getString(index_Body);
                    // Create on object
                    HashMap<String, String> transaction = new HashMap<>();
                    transaction.put("message", body);
                    transaction.put("message_id", String.valueOf(ID));
                    transactions.add(transaction);
                    counter++;
                }while (cur.moveToNext());
                @SuppressLint("DefaultLocale")
                String logMessage = (counter > 0) ? String.format("%d : Transactions made", counter) : "No transactions made";
                Log.i("Database Reader", logMessage);
                if (!cur.isClosed()) {
                    cur.close();
                    cur = null;
                }
            }
        } catch (SQLiteException ex) {
            Log.e("SQLiteException", ex.getMessage());
        }
        return transactions;
    }
}
