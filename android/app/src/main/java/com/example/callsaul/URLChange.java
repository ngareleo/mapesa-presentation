package com.example.callsaul;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;

import cz.msebera.android.httpclient.Header;

public class URLChange extends AppCompatActivity {

    public final static String IS_FORCED = "Forced";
    private String finalUrlAddress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_urlchange);
        this.KeyListener();
        Intent intent = getIntent();
        boolean isForced = intent.getBooleanExtra(IS_FORCED, false);
        if (isForced){
            // create a toast
            String toastMessage = "No url found";
            Utils.createToast(toastMessage, true, URLChange.this);
        }


        Button testConnectionButton = findViewById(R.id.test_connection_button);
        testConnectionButton.setOnClickListener( testButton -> {
            EditText urlAddressField = findViewById(R.id.url_address_field);
            String address = urlAddressField.getText().toString();
            this.TestConnection(String.format("http://%s", address));
        });

        Button updateButton = findViewById(R.id.url_change_button);;
        updateButton.setOnClickListener( uButton -> {
            Intent toMainIntent = new Intent(URLChange.this, MainActivity.class);
            toMainIntent.putExtra(MainActivity.URL_STRING, finalUrlAddress);
            startActivity(toMainIntent);
        });
    }

    private void KeyListener (){
        EditText urlAddressField = findViewById(R.id.url_address_field);
        TextView urlHeader = findViewById(R.id.url_address_header);

        urlAddressField.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) { }
            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                urlHeader.setText(String.format("http://%s", urlAddressField.getText().toString()));
            }
            @Override
            public void afterTextChanged(Editable editable) { }
        });
    }

    private void TestConnection(String url){
        AsyncHttpClient client = new AsyncHttpClient();
        String testURL = String.format("%s/test", url);
        System.out.println(testURL);
        client.get(testURL, new AsyncHttpResponseHandler() {

            @Override
            public void onSuccess(int statusCode, Header[] headers, byte[] responseBody) {
                successCallBack(url);
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                errorHandler();
            }
        });
    }

    private void successCallBack(String url){
        this.finalUrlAddress = url;
        Utils.createToast("Connection successful", false, URLChange.this);
    }

    private void errorHandler(){
        String toastMessage = "Connection unsuccessful";
        Utils.createToast(toastMessage, false, URLChange.this);
    }
}