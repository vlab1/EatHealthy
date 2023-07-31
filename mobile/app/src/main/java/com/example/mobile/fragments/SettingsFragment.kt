package com.example.mobile.fragments

import android.app.ProgressDialog
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.lifecycle.lifecycleScope
import com.example.mobile.R
import com.example.mobile.utils.ApiService
import com.example.mobile.utils.RetrofitHelper
import com.google.gson.JsonObject
import kotlinx.coroutines.launch


class SettingsFragment : Fragment() {
    private var progressDialog: ProgressDialog? = null
    private lateinit var apiService: ApiService
    private lateinit var passwordEditText: EditText
    private lateinit var newPasswordEditText: EditText
    private lateinit var newPasswordConfirmationEditText: EditText

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        apiService = RetrofitHelper.getInstance(requireContext()).create(ApiService::class.java)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View = inflater.inflate(R.layout.fragment_settings, container, false)
        passwordEditText = view.findViewById(R.id.password)
        newPasswordEditText = view.findViewById(R.id.newPassword)
        newPasswordConfirmationEditText = view.findViewById(R.id.newPasswordConfirmation)
        view.findViewById<Button>(R.id.btnChangePassword).setOnClickListener {
            changePassword()
        }

        return view
    }

    private fun showLoading(msg: String) {
        progressDialog = ProgressDialog.show(requireContext(), null, msg, true)
    }

    private fun showToast(message: String) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }

    private fun changePassword() {
        val password = passwordEditText.text.toString()
        val newPassword = newPasswordEditText.text.toString()
        val newPasswordConfirmation = newPasswordConfirmationEditText.text.toString()

        if (newPassword != newPasswordConfirmation) {
            showToast("Password and password confirmation do not match")
            return
        }

        lifecycleScope.launch {
            showLoading("Changing, please wait...")

            val body = JsonObject().apply {
                addProperty("password", password)
                addProperty("new_password", newPassword)
            }

            val result = apiService.changePassword(body)

            if (result.isSuccessful) {
                showToast("Success changing password")
                passwordEditText.text.clear()
                newPasswordEditText.text.clear()
                newPasswordConfirmationEditText.text.clear()
            } else {
                showToast("Failed changing password")
            }
            progressDialog?.dismiss()
        }
    }
}