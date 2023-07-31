package com.example.mobile.utils

import com.google.gson.annotations.SerializedName

data class UserResponse(
    @SerializedName("_id") var _id: String?,
    @SerializedName("email") var email: String?,
    @SerializedName("emailActivationLink") var emailActivationLink: String?,
    @SerializedName("emailIsActivated") var emailIsActivated: Boolean?,
    @SerializedName("createdAt") var createdAt: String?,
    @SerializedName("updatedAt") var updatedAt: String?,
    @SerializedName("profileId") var profileId: ProfileIdResponse?,
    @SerializedName("profileModel") var profileModel: String?
)

data class ProfileIdResponse(
    @SerializedName("_id") var _id: String?,
    @SerializedName("createdAt") var createdAt: String?,
    @SerializedName("updatedAt") var updatedAt: String?,
    @SerializedName("__v") var __v: Int?,
    @SerializedName("birthDate") var birthDate: String?,
    @SerializedName("firstName") var firstName: String?,
    @SerializedName("lastName") var lastName: String?,
    @SerializedName("patronymic") var patronymic: String?,
    @SerializedName("phone") var phone: String?,
    @SerializedName("sex") var sex: String?,
)

