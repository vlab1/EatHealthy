package com.example.mobile.fragments

import AppointmentsAdapter
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.lifecycle.lifecycleScope
import com.example.mobile.MainActivity
import com.example.mobile.R
import com.example.mobile.utils.ApiService
import com.example.mobile.utils.RetrofitHelper
import com.example.mobile.utils.SharedPreferencesManager
import kotlinx.coroutines.launch
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.utils.AppointmentResponse


class MainFragment : Fragment() {
    private lateinit var apiService: ApiService
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: AppointmentsAdapter


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        recyclerView = view.findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        adapter = AppointmentsAdapter(requireFragmentManager())
        recyclerView.adapter = adapter
        apiService = RetrofitHelper.getInstance(requireContext()).create(ApiService::class.java)
        getMyAppointments()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_main, container, false)
    }

    private fun getMyAppointments() {
        lifecycleScope.launch {
            val result = apiService.getMyAppointments()

            if (result.isSuccessful) {
                val appointments = result.body()?.data ?: emptyList()
                updateAppointmentsList(appointments)
            } else {
                Log.e("meeeee", "me field: ${result.message()}")
            }
        }
    }

    private fun updateAppointmentsList(appointments: List<AppointmentResponse>) {
        adapter.setData(appointments)
        adapter.notifyDataSetChanged()
    }


}