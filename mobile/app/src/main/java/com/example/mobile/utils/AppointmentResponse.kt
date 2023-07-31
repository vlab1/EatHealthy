package com.example.mobile.utils

import android.database.Observable
import com.google.gson.annotations.SerializedName

data class AppointmentResponse(
    @SerializedName("_id") val _id: String?,
    @SerializedName("patientId") val patientId: UserResponsePatient?,
    @SerializedName("dietitianId") val dietitianId: UserResponseDietitian?,
    @SerializedName("measurementId") val measurementId: MeasurementResponse?,
    @SerializedName("allowedDishes") val allowedDishes: List<AllowedDishResponse>?,
    @SerializedName("createdAt") var createdAt: String?,
    @SerializedName("updatedAt") var updatedAt: String?,
    @SerializedName("recommendations") var recommendations: String?,
    )

data class UserResponsePatient(
    @SerializedName("_id") var _id: String?,
    @SerializedName("email") var email: String?,
    @SerializedName("emailActivationLink") var emailActivationLink: String?,
    @SerializedName("emailIsActivated") var emailIsActivated: Boolean?,
    @SerializedName("createdAt") var createdAt: String?,
    @SerializedName("updatedAt") var updatedAt: String?,
    @SerializedName("profileId") var profileId: PatientResponse?,
    @SerializedName("profileModel") var profileModel: String?
)

data class UserResponseDietitian(
    @SerializedName("_id") var _id: String?,
    @SerializedName("email") var email: String?,
    @SerializedName("emailActivationLink") var emailActivationLink: String?,
    @SerializedName("emailIsActivated") var emailIsActivated: Boolean?,
    @SerializedName("createdAt") var createdAt: String?,
    @SerializedName("updatedAt") var updatedAt: String?,
    @SerializedName("profileId") var profileId: DietitianResponse?,
    @SerializedName("profileModel") var profileModel: String?
)


data class PatientResponse(
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

data class DietitianResponse(
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

data class MeasurementResponse(
    @SerializedName("_id") val _id: String?,
    @SerializedName("totalCholesterol") val totalCholesterol: Double?,
    @SerializedName("hdlCholesterol") val hdlCholesterol: Double?,
    @SerializedName("vldlCholesterol") val vldlCholesterol: Double?,
    @SerializedName("ldlCholesterol") val ldlCholesterol: Double?,
    @SerializedName("warnings") val warnings: List<WarningResponse>?,
)

data class WarningResponse(
    @SerializedName("description") val description: TranslateResponse?,
)


data class TranslateResponse(
    @SerializedName("en") val en: String?,
    @SerializedName("uk") val uk: String?,
)

data class AllowedDishResponse(
    @SerializedName("_id")  val _id: DishResponse?,
)

data class DishResponse(
    @SerializedName("_id")  val _id: String?,
    @SerializedName("userId") val userId: UserEatingPlaceResponse?,
    @SerializedName("name") val name: String?,
    @SerializedName("price") val price: String?,
    @SerializedName("images") val images: List<String>?,
    @SerializedName("description") val description: TranslateResponse?,
    @SerializedName("ingredients") val ingredients: List<IngredientResponse>?,
)

data class IngredientResponse(
    @SerializedName("name") val name: TranslateResponse?,
    @SerializedName("weight") val weight: String?
)

data class UserEatingPlaceResponse(
    @SerializedName("_id") var _id: String?,
    @SerializedName("email") var email: String?,
    @SerializedName("emailActivationLink") var emailActivationLink: String?,
    @SerializedName("emailIsActivated") var emailIsActivated: Boolean?,
    @SerializedName("createdAt") var createdAt: String?,
    @SerializedName("updatedAt") var updatedAt: String?,
    @SerializedName("profileId") var profileId: ProfileEatingPlaceIdResponse?,
    @SerializedName("profileModel") var profileModel: String?
)

data class ProfileEatingPlaceIdResponse(
    @SerializedName("_id") var _id: String?,
    @SerializedName("contactFirstName") var contactFirstName: String?,
    @SerializedName("contactLastName") var contactLastName: String?,
    @SerializedName("contactPatronymic") var contactPatronymic: String?,
    @SerializedName("contactSex") var contactSex: String?,
    @SerializedName("contactPhone") var contactPhone: String?,
    @SerializedName("contactBirthDate") var contactBirthDate: String?,
    @SerializedName("country") var country: TranslateResponse?,
    @SerializedName("region") var region: TranslateResponse?,
    @SerializedName("city") var city: TranslateResponse?,
    @SerializedName("address") var address: TranslateResponse?,
    @SerializedName("postcode") var postcode: String?,
    @SerializedName("images") var images: List<String>?,
    @SerializedName("name") var name: String?,
    @SerializedName("description") var description: TranslateResponse?,
)
