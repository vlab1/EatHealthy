package com.example.mobile.utils

import android.content.Context
import android.content.SharedPreferences

class SharedPreferencesManager(context: Context) {
    private val sharedPreferences: SharedPreferences = context.getSharedPreferences("my_app_preferences", Context.MODE_PRIVATE)
    private val editor: SharedPreferences.Editor = sharedPreferences.edit()

    fun setAccessToken(token: String) {
        editor.putString("accessToken", token)
        editor.apply()
    }

    fun getAccessToken(): String? {
        return sharedPreferences.getString("accessToken", null)
    }

    fun clearAccessToken() {
        editor.remove("accessToken")
        editor.apply()
    }


}