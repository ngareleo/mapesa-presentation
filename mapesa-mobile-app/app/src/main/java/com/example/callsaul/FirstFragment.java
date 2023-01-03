package com.example.callsaul;

import android.app.Activity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

public class FirstFragment extends Fragment {

    Activity activity;
    LoginHelper helper = new LoginHelper();


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_first, container, false);
    }

    public void onViewCreated(@NonNull View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        View view = getView();

        if (view != null){
            Button loginButton = view.findViewById(R.id.login_button);
            // When user clicks the log in button
            loginButton.setOnClickListener(buttonView -> {
                helper.logUserIn(view, this.activity);
            });
            ViewGroup toSignUpLink = view.findViewById(R.id.signup_link);
            toSignUpLink.setOnClickListener( link -> {

            });
        }
    }

    @Override
    public void onAttach(@NonNull Activity activity) {
        this.activity = activity;
        super.onAttach(activity);
    }
}