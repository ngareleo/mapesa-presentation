package com.example.callsaul;

import static android.graphics.Color.parseColor;

import android.animation.ObjectAnimator;
import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.core.widget.ImageViewCompat;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.BounceInterpolator;
import android.view.animation.DecelerateInterpolator;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.android.material.appbar.AppBarLayout;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.navigation.NavigationView;

public class MainPage extends Fragment implements MessageUploader.Messenger{

    Activity activity;
    MessageUploader uploader;
    ObjectAnimator rotAnim;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_main_page, container, false);
    }

    @Override
    public void onStart() {
        super.onStart();
        View view = getView();
        // we first upload data
        this.uploader = new MessageUploader(this.activity, this);
        uploader.upload();
        if (view != null){
            ExtendedFloatingActionButton fab = view.findViewById(R.id.refresh_button);
            fab.setOnClickListener( rb -> {
                this.uploader.upload();
            });
        }
    }



    @Override
    public void onAttach(@NonNull Activity activity) {
        super.onAttach(activity);
        this.activity = activity;
    }

    @SuppressLint({"SetTextI18n", "ResourceAsColor"})
    @Override
    public void upToDateMessage() {
        // we show up to date banner, change logo and text

        if (this.activity != null){
            bannerDisappear();

            ViewGroup errorBanner = this.activity.findViewById(R.id.home_error_banner);
            errorBanner.setVisibility(View.INVISIBLE);

            ImageView logo = this.activity.findViewById(R.id.home_logo);
            logo.setImageResource(R.drawable.ic_finance_logo);

            TextView textView = this.activity.findViewById(R.id.home_logo_text);
            textView.setText("Everything is up to date");
            textView.setTextColor(parseColor("#17CF97"));

        }
    }

    @SuppressLint("DefaultLocale")
    @Override
    public void toUploadMessage(int m_size) {
        // show number of uploads and start animation
        if (this.activity != null){

            // remove error banner
            bannerDisappear();
            TextView toastMsg = this.activity.findViewById(R.id.toast_message);
            toastMsg.setText(String.format("Uploading %d messages", m_size));


            ViewGroup banner = this.activity.findViewById(R.id.upload_indicator);
            ImageView loader = this.activity.findViewById(R.id.loading_ic);
            // rotation
            ObjectAnimator rotate = ObjectAnimator.ofFloat(loader, "rotation", 0f, 360f);
            rotate.setRepeatCount(ValueAnimator.INFINITE);
            rotate.setInterpolator(new DecelerateInterpolator());
            rotate.setDuration(1000);
            this.rotAnim = rotate;
            rotate.start();

            ObjectAnimator b_anim = ObjectAnimator.ofFloat(banner, "Y", 200);
            b_anim.setDuration(1000);
            b_anim.setInterpolator(new BounceInterpolator());
            b_anim.start();
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void failureMessage(int ErrorCode) {

        if (this.activity != null){
            // show error message at the bottom banner

            ViewGroup banner = this.activity.findViewById(R.id.upload_indicator);
            ObjectAnimator b_anim = ObjectAnimator.ofFloat(banner, "Y", -200);
            b_anim.setDuration(500);
            b_anim.start();
            if (this.rotAnim != null){
                this.rotAnim.end();
            }
            //animation stopped

            ViewGroup errorBanner = this.activity.findViewById(R.id.home_error_banner);
            errorBanner.setVisibility(View.VISIBLE);

            // text
            TextView errorMessage = this.activity.findViewById(R.id.home_error_text);
            errorMessage.setText("Error uploading data");
            bannerDisappear();
        }
    }

    @SuppressLint({"ResourceAsColor", "SetTextI18n"})
    @Override
    public void uploadSuccessMessage() {
        // show success message, stop animation, change icon and text
        if (this.activity != null){

            // move the message up
            ViewGroup banner = this.activity.findViewById(R.id.upload_indicator);
            ObjectAnimator b_anim = ObjectAnimator.ofFloat(banner, "Y", -200);
            b_anim.setDuration(500);
            b_anim.start();
            if (this.rotAnim != null){
                this.rotAnim.end();
            }


            ViewGroup errorBanner = this.activity.findViewById(R.id.home_error_banner);
            errorBanner.setVisibility(View.INVISIBLE);

            ImageView logo = this.activity.findViewById(R.id.home_logo);
            logo.setImageResource(R.drawable.ic_finance_logo);


            TextView textView = this.activity.findViewById(R.id.home_logo_text);
            textView.setText("Everything is up to date");
            textView.setTextColor(parseColor("#17CF97"));
        }

    }

    private void bannerDisappear(){
        ViewGroup errorBanner = this.activity.findViewById(R.id.home_error_banner);
        errorBanner.setOnClickListener( banner -> {
            banner.setVisibility(View.INVISIBLE);
        } );
    }

}