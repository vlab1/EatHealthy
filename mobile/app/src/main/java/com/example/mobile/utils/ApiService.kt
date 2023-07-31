package com.example.mobile.utils

import com.google.gson.JsonObject
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Headers
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {

    @GET("/api/user")
    suspend fun getMe(): Response<BaseResponse<UserResponse>>

    @GET("/api/dietitian-appointment/patient/measurement-statistics")
    suspend fun getMyStatistics(): Response<BaseResponse<StatisticsResponse>>

    @POST("/api/user/patient/register")
    suspend fun register(@Body body: JsonObject): Response<BaseResponse<String>>

    @POST("/api/user/login")
    suspend fun login(@Body body: JsonObject): Response<BaseResponse<String>>

    @GET("/api/dietitian-appointment/patient/get")
    suspend fun getMyAppointments(): Response<BaseListResponse<AppointmentResponse>>

    @PUT("/api/patient/update")
    suspend fun changeProfile(@Body body: JsonObject):Response<JsonObject>

    @PUT("/api/user/update/password")
    suspend fun changePassword(@Body body: JsonObject):Response<JsonObject>

}