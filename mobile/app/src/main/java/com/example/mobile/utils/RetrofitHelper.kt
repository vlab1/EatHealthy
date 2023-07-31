package com.example.mobile.utils

import android.content.Context
import okhttp3.OkHttpClient
import okhttp3.Interceptor
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitHelper {
    private const val baseUrl = "http://192.168.0.104:5000";

    fun getInstance(context: Context): Retrofit {
        val client = OkHttpClient.Builder()
            .addInterceptor(TokenInterceptor(context))
            .build()
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .client(client)
            .build()
    }

    private class TokenInterceptor(private val context: Context) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val originalRequest = chain.request()
            val sharedPreferencesManager = SharedPreferencesManager(context);
            val token = sharedPreferencesManager.getAccessToken()
            val modifiedRequest = originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()

            return chain.proceed(modifiedRequest)
        }
    }
}

