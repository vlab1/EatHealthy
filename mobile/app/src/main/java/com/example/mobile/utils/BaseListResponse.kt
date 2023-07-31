package com.example.mobile.utils

import android.database.Observable
import com.google.gson.annotations.SerializedName

data class BaseListResponse<T>(
    @SerializedName("data") var data: List<T>? = null
)