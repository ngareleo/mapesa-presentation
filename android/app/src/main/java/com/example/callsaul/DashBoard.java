package com.example.callsaul;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.PersistentCookieStore;

import org.json.JSONObject;

import cz.msebera.android.httpclient.Header;


public class DashBoard extends Fragment {


    Activity activity;
    Authenticator authenticator;
    String URL = Utils.URL_STRING;


    public interface Authenticator{
        void authenticateUser();
        void forwardToLogin();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_dash_board, container, false);
    }

    private void isAuthenticated(){
        AsyncHttpClient client = new AsyncHttpClient();
        PersistentCookieStore store = new PersistentCookieStore(this.activity);
        client.setCookieStore(store);
        String testURL = String.format("%s/is-authenticated", URL);
        client.get(testURL, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject responseBody) {
                System.out.println(responseBody.toString());
                successCallBack(responseBody);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                errorHandler();
            }
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        isAuthenticated();
    }

    private void successCallBack(JSONObject obj){
        boolean isAuthenticated = false;
        try{
            isAuthenticated = obj.getBoolean("authenticated");
        }catch (Exception e) {
            Log.e("Login", "Authentication failed");
            System.out.println("Authenticated key not found");
        }
        if (isAuthenticated){
            authenticator.authenticateUser();
            Log.i("Login Activity Info", "User is authenticated");
        }else {
            authenticator.forwardToLogin();
        }
    }

    private void errorHandler(){
        ViewGroup error = this.activity.findViewById(R.id.error_banner);
        error.setVisibility(View.VISIBLE);
    }

    @Override
    public void onAttach(@NonNull Activity activity) {
        super.onAttach(activity);
        this.activity = activity;
        this.authenticator = (Authenticator) activity;
    }
}