package com.example.mobile.fragments

import android.app.DatePickerDialog
import android.app.ProgressDialog
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import com.example.mobile.R
import com.example.mobile.utils.ApiService
import com.example.mobile.utils.RetrofitHelper
import com.google.gson.JsonObject
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class ProfileFragment : Fragment() {

    private var progressDialog: ProgressDialog? = null
    private lateinit var apiService: ApiService
    private lateinit var sexSpinner: Spinner
    private lateinit var emailEditText: EditText
    private lateinit var nameEditText: EditText
    private lateinit var surnameEditText: EditText
    private lateinit var patronymicEditText: EditText
    private lateinit var phoneEditText: EditText
//    private lateinit var sexEditText: EditText
    private lateinit var birthDateEditText: EditText
    private lateinit var _id: String
    private lateinit var textViewEmailActivate : TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View = inflater.inflate(R.layout.fragment_profile, container, false)

        emailEditText = view.findViewById(R.id.email)
        nameEditText = view.findViewById(R.id.firstName)
        surnameEditText = view.findViewById(R.id.lastName)
        patronymicEditText = view.findViewById(R.id.patronymic)
        phoneEditText = view.findViewById(R.id.phone)
        sexSpinner = view.findViewById(R.id.sex)
        birthDateEditText = view.findViewById(R.id.birthDate)
        textViewEmailActivate = view.findViewById<TextView>(R.id.textViewEmailActivate)

        val sexOptions = arrayOf("Male", "Female")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, sexOptions)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        sexSpinner.adapter = adapter

        val birthDateCalendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(requireContext(), { _ , year, month, dayOfMonth ->
            birthDateCalendar.set(Calendar.YEAR, year)
            birthDateCalendar.set(Calendar.MONTH, month)
            birthDateCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth)
            val selectedDate = birthDateCalendar.time
            val dateFormatter = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            birthDateEditText.setText(dateFormatter.format(selectedDate))
        }, birthDateCalendar.get(Calendar.YEAR), birthDateCalendar.get(Calendar.MONTH), birthDateCalendar.get(
            Calendar.DAY_OF_MONTH))

        val currentDate = Calendar.getInstance()
        datePicker.datePicker.maxDate = currentDate.timeInMillis

        birthDateEditText.setOnClickListener {
            datePicker.show()
        }

        view.findViewById<Button>(R.id.btnChangeData).setOnClickListener {
            changeData()
        }

        return view;
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        apiService = RetrofitHelper.getInstance(requireContext()).create(ApiService::class.java)
        getMe()
    }


    private fun showLoading(msg: String) {
        progressDialog = ProgressDialog.show(requireContext(), null, msg, true)
    }

    private fun showToast(message: String) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }

    private fun formatDate(inputDate: String?): String {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.getDefault())
        val outputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        return try {
            val date = inputFormat.parse(inputDate)
            outputFormat.format(date)
        } catch (e: Exception) {
            e.printStackTrace()
            ""
        }
    }

    private fun getMe() {
        lifecycleScope.launch {
            val result = apiService.getMe()
            if (result.isSuccessful) {
                _id = result.body()?.data?.profileId?._id.toString();
                emailEditText.setText(result.body()?.data?.email)
                nameEditText.setText(result.body()?.data?.profileId?.firstName)
                surnameEditText.setText(result.body()?.data?.profileId?.lastName)
                patronymicEditText.setText(result.body()?.data?.profileId?.patronymic)
                phoneEditText.setText(result.body()?.data?.profileId?.phone)
                val sexOptions = arrayOf("Male", "Female")
                val sex = result.body()?.data?.profileId?.sex
                val position = sexOptions.indexOf(sex)
                sexSpinner.setSelection(position)
                birthDateEditText.setText(formatDate(result.body()?.data?.profileId?.birthDate))
                val emailIsActivated = result.body()?.data?.emailIsActivated;
                if (emailIsActivated === false) {
                    textViewEmailActivate.setText("Activation email sent to email. If you don't verify your email, the dietitian can't find you.")
                }
                Log.e("meeeee", "me: ${result.body()}")
            } else {
                Log.e("meeeee", "me field: ${result.message()}")
            }
        }
    }

    private fun changeData() {
        val name = nameEditText.text.toString()
        val surname = surnameEditText.text.toString()
        val patronymic = patronymicEditText.text.toString()
        val phone = phoneEditText.text.toString()
        val sex = sexSpinner.selectedItem.toString()
        val birthDate = birthDateEditText.text.toString()
        Log.e("meeeee", "me field: $birthDate")
        lifecycleScope.launch {
            showLoading("Changing, please wait...")

            val body = JsonObject().apply {
                addProperty("_id", _id)
                addProperty("firstName", name)
                addProperty("lastName", surname)
                addProperty("patronymic", patronymic)
                addProperty("phone", phone)
                addProperty("sex", sex)
                addProperty("birthDate", birthDate)
            }
            val result = apiService.changeProfile(body)
            if (result.isSuccessful) {
                showToast("Success changing data")
            } else {
                showToast("Failed changing data")
            }
            progressDialog?.dismiss()
        }
    }
}