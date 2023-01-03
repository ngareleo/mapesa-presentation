package com.example.callsaul;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

import com.google.android.material.button.MaterialButton;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.PersistentCookieStore;
import com.loopj.android.http.RequestParams;

import org.json.JSONObject;

import cz.msebera.android.httpclient.Header;

public class LoginHelper {

    View view;
    Activity activity;

    final String URL = Utils.URL_STRING;
    private final String LOG_ERROR_HEADER = "LoginHelper error";
    private final String LOG_INFO_HEADER = "LoginHelper information";

    interface Login{
        void userLoggedIn();
        void logUserOut();
    }

    Login logger;


    public void logUserIn (View view, Activity activity){

        this.view = view;
        this.activity = activity;
        this.logger = (Login) activity;
        String[] formData = checkForm();

        if (formData[0] == null || formData[1] == null){
            Log.i(LOG_INFO_HEADER, "Form invalid");
            return;
        }
        //make the http request
        PersistentCookieStore store = new PersistentCookieStore(this.activity);
        AsyncHttpClient client = new AsyncHttpClient();
        client.setCookieStore(store);
        String loginUrl = String.format("%s/login?type=app", URL);
        RequestParams params = new RequestParams();
        params.put("username", formData[0]);
        params.put("password", formData[1]);
        client.post(loginUrl, params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject responseBody) {
                successCallBack(responseBody);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                errorHandler();
            }


        });
    }

    @SuppressLint("SetTextI18n")
    private void errorHandler() {
        ViewGroup errorBanner = activity.findViewById(R.id.login_error_banner);
        TextView errorText = activity.findViewById(R.id.login_error_text);
        errorText.setText("I apologize, Internal server error");
        errorBanner.setVisibility(View.VISIBLE);
        bannerDisappear();
    }

    @SuppressLint("SetTextI18n")
    private void successCallBack(JSONObject responseBody) {

        try{
            String feedback = responseBody.getString("Authentication");
            if (feedback.equals("Success")){
                logger.userLoggedIn();
            }else{
                // Password and username pair incorrect
                ViewGroup errorBanner = activity.findViewById(R.id.login_error_banner);
                TextView errorText = activity.findViewById(R.id.login_error_text);
                errorText.setText("Username and password pair are incorrect");
                errorBanner.setVisibility(View.VISIBLE);
                bannerDisappear();
            }
        }catch (Exception e){
            // Internal error
            System.out.println(e.getMessage());
        }
    }

    private String[] checkForm(){
        //we get the password and email from the fragment
        if (this.view != null){
            EditText emailField = view.findViewById(R.id.login_email_address),
                    passwordField = view.findViewById(R.id.login_password);
            boolean formValid = true;
            String email = emailField.getText().toString(), password = passwordField.getText().toString();

            if (email.trim().equals("")){
                emailField.setError("I need your username");
                formValid = false;
            }
            if (password.trim().equals("")){
                passwordField.setError("I need the password");
                formValid = false;
            }
            if (formValid) return new String[]{email, password};
        }
        Log.e(this.LOG_ERROR_HEADER, "View object not found");
        return new String[]{null, null};
    }

    private void bannerDisappear(){
        ViewGroup errorBanner = activity.findViewById(R.id.login_error_banner);
        errorBanner.setOnClickListener( banner -> {
            banner.setVisibility(View.INVISIBLE);
        } );
    }

    public void logUserOut(Activity activity){

        Login logger = this.logger;
        PersistentCookieStore store = new PersistentCookieStore(activity);
        AsyncHttpClient client = new AsyncHttpClient();
        client.setCookieStore(store);
        String logoutUrl = String.format("%s/logout", URL);
        client.get(logoutUrl, new AsyncHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, byte[] responseBody) {
                // Go to the login page
                Log.i(LOG_INFO_HEADER, "User logged out");
                //forward user to logout page
                logger.logUserOut();
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                Log.e(LOG_ERROR_HEADER, "Logout request error");
            }
        });

    }
}
