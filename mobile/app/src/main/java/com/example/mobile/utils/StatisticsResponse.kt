package com.example.mobile.utils


import com.google.gson.annotations.SerializedName

data class StatisticsResponse(
    @SerializedName("dietitianAppointment") val dietitianAppointment: List<DietitianAppointmentResponse>?,
    @SerializedName("averageTotalCholesterol") val averageTotalCholesterol: Double?,
    @SerializedName("averageHDLCholesterol") val averageHDLCholesterol: Double?,
    @SerializedName("averageVLDLCholesterol") val averageVLDLCholesterol: Double?,
    @SerializedName("averageLDLCholesterol") val averageLDLCholesterol: Double?,
    )

data class DietitianAppointmentResponse(
    @SerializedName("_id") var _id: String?,
    @SerializedName("measurementId") var measurementId: StatisticsMeasurementResponse?,
)


data class StatisticsMeasurementResponse(
    @SerializedName("_id") val _id: String?,
    @SerializedName("totalCholesterol") val totalCholesterol: Double?,
    @SerializedName("hdlCholesterol") val hdlCholesterol: Double?,
    @SerializedName("vldlCholesterol") val vldlCholesterol: Double?,
    @SerializedName("ldlCholesterol") val ldlCholesterol: Double?,
    @SerializedName("cholesterolNorms") val cholesterolNorms: CholesterolNormsResponse?,
    @SerializedName("createdAt") val createdAt: String?
)

data class CholesterolNormsResponse(
    @SerializedName("_id") val _id: String?,
    @SerializedName("totalCholesterolMin") val totalCholesterolMin: Double?,
    @SerializedName("totalCholesterolMax") val totalCholesterolMax: Double?,
    @SerializedName("hdlCholesterolMin") val hdlCholesterolMin: Double?,
    @SerializedName("hdlCholesterolMax") val hdlCholesterolMax: Double?,
    @SerializedName("vldlCholesterolMin") val vldlCholesterolMin: Double?,
    @SerializedName("vldlCholesterolMax") val vldlCholesterolMax: Double?,
    @SerializedName("ldlCholesterolMin") val ldlCholesterolMin: Double?,
    @SerializedName("ldlCholesterolMax") val ldlCholesterolMax: Double?,
)