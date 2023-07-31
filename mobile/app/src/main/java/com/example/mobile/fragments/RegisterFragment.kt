package com.example.mobile.fragments

import android.app.ProgressDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.Navigation
import com.example.mobile.MainActivity
import com.example.mobile.R
import com.example.mobile.utils.ApiService
import com.example.mobile.utils.RetrofitHelper
import com.example.mobile.utils.SharedPreferencesManager
import com.google.gson.JsonObject
import kotlinx.coroutines.launch
import org.w3c.dom.Text

class RegisterFragment : Fragment() {

    private lateinit var apiService: ApiService
    private var progressDialog: ProgressDialog? = null
    private lateinit var  textViewNavigateRegisterFragment: TextView
    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var passwordConfirmationEditText: EditText

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View = inflater.inflate(R.layout.fragment_register, container, false)
        textViewNavigateRegisterFragment = view.findViewById((R.id.navLogin))
        textViewNavigateRegisterFragment.setOnClickListener {
            Navigation.findNavController(view).navigate(R.id.action_registerFragment_to_loginFragment);
        }
        apiService = RetrofitHelper.getInstance(requireContext()).create(ApiService::class.java)
        emailEditText = view.findViewById(R.id.email)
        passwordEditText = view.findViewById(R.id.password)
        passwordConfirmationEditText = view.findViewById(R.id.password_confirmation)
        view.findViewById<Button>(R.id.btnRegister).setOnClickListener {
            register()
        }
        return view
    }

    private fun register() {
        val email = emailEditText.text.toString()
        val password = passwordEditText.text.toString()
        val passwordConfirmation = passwordConfirmationEditText.text.toString()

        if (password != passwordConfirmation) {
            showToast("Password and password confirmation do not match")
            return
        }

        lifecycleScope.launch {
            showLoading("Registration, please wait...")

            val body = JsonObject().apply {
                addProperty("email", email)
                addProperty("password", password)
                addProperty("password_confirmation", passwordConfirmation)
            }
            val result = apiService.register(body)
            if (result.isSuccessful) {
                val accessToken = result.body()?.data.toString()
                val sharedPreferencesManager = SharedPreferencesManager(requireContext())
                sharedPreferencesManager.setAccessToken(accessToken)
                val intent = Intent(requireContext(), MainActivity::class.java)
                startActivity(intent)
                requireActivity().finish()
            } else {
                Log.e("userRegister", "register field: ${result.message()}")
            }
            progressDialog?.dismiss()
        }
    }

    private fun showLoading(msg: String) {
        progressDialog = ProgressDialog.show(requireContext(), null, msg, true)
    }

    private fun showToast(message: String) {
        Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }
}
