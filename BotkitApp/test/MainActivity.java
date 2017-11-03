package com.wolfhackers.counsellink;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;
import android.app.PendingIntent;
import android.app.NotificationManager;
import android.support.v4.app.NotificationCompat;
import android.app.Notification;

import com.loopj.android.http.AsyncHttpClient;
import com.wolfhackers.counsellink.ExpandClass;
import com.wolfhackers.counsellink.RejectClass;
import com.wolfhackers.counsellink.R;


public class MainActivity extends AppCompatActivity {


    private static AsyncHttpClient client = new AsyncHttpClient();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }



}
