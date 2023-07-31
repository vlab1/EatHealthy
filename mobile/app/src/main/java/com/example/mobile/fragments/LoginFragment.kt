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

class LoginFragment : Fragment() {

    private lateinit var apiService: ApiService
    private var progressDialog: ProgressDialog? = null
    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var  textViewNavigateLoginFragment: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View = inflater.inflate(R.layout.fragment_login, container, false)
        textViewNavigateLoginFragment = view.findViewById((R.id.navRegister))
        textViewNavigateLoginFragment.setOnClickListener {
            Navigation.findNavController(view).navigate(R.id.action_loginFragment_to_registerFragment);
        }
        apiService = RetrofitHelper.getInstance(requireContext()).create(ApiService::class.java)
        emailEditText = view.findViewById(R.id.email)
        passwordEditText = view.findViewById(R.id.password)
        view.findViewById<Button>(R.id.btnLogin).setOnClickListener {
            login()
        }
        return view
    }

    private fun login() {
        val email = emailEditText.text.toString()
        val password = passwordEditText.text.toString()

        lifecycleScope.launch {
            showLoading("Logging in, please wait...")
            val body = JsonObject().apply {
                addProperty("email", email)
                addProperty("password", password)
            }
            val result = apiService.login(body)
            if (result.isSuccessful) {
                val accessToken = result.body()?.data.toString()
                val sharedPreferencesManager = SharedPreferencesManager(requireContext())
                sharedPreferencesManager.setAccessToken(accessToken)
                val intent = Intent(requireContext(), MainActivity::class.java)
                startActivity(intent)
                requireActivity().finish()
            } else {
                val message = result.message()
                Log.e("userLogin", "login field: $message")
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
