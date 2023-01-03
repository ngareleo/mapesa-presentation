package com.example.callsaul;

import android.app.Activity;
import android.util.Log;

import androidx.fragment.app.Fragment;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.PersistentCookieStore;
import com.loopj.android.http.RequestParams;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import cz.msebera.android.httpclient.Header;

public class MessageUploader {

    static final String URL = Utils.URL_STRING;
    static final String LOG_INFO_HEADER = "Message Uploader Info";
    static final String LOG_ERROR_HEADER = "Message Uploader Error";
    public static final int NO_CONNECTION_MESSAGE = 1;
    public static final int NO_INTERNAL_ERROR = 1;

    Activity callingActivity;
    Fragment callingFrag;

    MessageUploader(Activity activity, Fragment callingFrag){
        this.callingFrag = callingFrag;
        this.callingActivity = activity;
        this.messenger = (Messenger) this.callingFrag;
    }

    interface Messenger {
        void upToDateMessage();
        void toUploadMessage(int m_number);
        void failureMessage(int ErrorCode);
        void uploadSuccessMessage();
    }

    Messenger messenger;

    public void upload(){
        prepareUpload();
    }
    private void makePostUpload(ArrayList<HashMap<String, String>> data){

        AsyncHttpClient client = new AsyncHttpClient();
        PersistentCookieStore store = new PersistentCookieStore(this.callingActivity);
        RequestParams params = new RequestParams();
        params.put("data", data);
        client.setCookieStore(store);
        String uploadURL = String.format("%s/upload", URL);
        client.post(uploadURL, params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject responseBody) {
                System.out.println(responseBody.toString());
                postSuccessCallBack(responseBody);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                postErrorHandler(throwable);
            }
        });
    }

    private void postErrorHandler(Throwable throwable) {
        Log.e(LOG_ERROR_HEADER, throwable.getMessage());
        Utils.createToast("Error uploading messages", true, this.callingActivity);
    }

    private void postSuccessCallBack(JSONObject responseBody) {
        try {
            String message = responseBody.getString("message");

            if (message.equals("Success")){
                String successMsg = "Upload completed successfully";
                Log.i(LOG_INFO_HEADER, String.format("%s\nTime : %s", successMsg, new Date().toString()));
                this.messenger.uploadSuccessMessage();
                // then we update the last update textview

            }else {
                String failureMsg = "Authentication error";
                Log.e(LOG_ERROR_HEADER, failureMsg);
                Utils.createToast(failureMsg, true, this.callingActivity);
            }
        }catch (Exception e){
            Log.e(LOG_ERROR_HEADER, e.getMessage());
        }
    }

    private void prepareUpload () {
        // we look up for the limit
        AsyncHttpClient client = new AsyncHttpClient();
        PersistentCookieStore store = new PersistentCookieStore(this.callingActivity);
        client.setCookieStore(store);
        String url = String.format("%s/upload", URL);

        client.get(url, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject responseBody) {
                // we get data from the database then upload the data
                getSuccessCallBack(responseBody);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {

            }
        });
    }

    private void getSuccessCallBack(JSONObject responseBody){
        try {
            String message = responseBody.getString("message");
            if (message.equals("Okay")){
                // get limit
                System.out.println(responseBody.toString());
                int limit = responseBody.getInt("limit");
                ArrayList<HashMap<String, String>> data = DatabaseReader.getUnreadMessages(this.callingActivity, limit);
                if (data.size() == 0){
                    // up to date
                    // send message to DashBoard
                    Log.i(LOG_INFO_HEADER, "Check up to date");
                    this.messenger.upToDateMessage();
                    return;
                }
                // get the data size
                System.out.println("Upload");
                int data_s = data.size();
                this.messenger.toUploadMessage(data_s);
                this.makePostUpload(data);
            }
        }catch (Exception e){
            Log.e(LOG_ERROR_HEADER, e.getMessage());
        }
    }
}
