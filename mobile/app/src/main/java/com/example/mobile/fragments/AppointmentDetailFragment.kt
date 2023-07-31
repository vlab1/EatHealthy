package com.example.mobile.fragments

import DishesAdapter
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import com.example.mobile.utils.AllowedDishResponse
import com.example.mobile.utils.AppointmentResponse
import com.google.gson.Gson

class AppointmentDetailFragment : Fragment() {
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: DishesAdapter


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val appointmentJson = arguments?.getString("appointmentJson")
        val gson = Gson()
        val appointment = gson.fromJson(appointmentJson, AppointmentResponse::class.java)
        recyclerView = view.findViewById(R.id.recyclerViewDishes)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        adapter = DishesAdapter(requireFragmentManager())
        recyclerView.adapter = adapter
        updateDishesList(appointment.allowedDishes)

        view.findViewById<TextView>(R.id.idTextViewDietitianFirstName).text = appointment.dietitianId?.profileId?.firstName;
        view.findViewById<TextView>(R.id.idTextViewDietitianLastName).text = appointment.dietitianId?.profileId?.lastName;
        view.findViewById<TextView>(R.id.idTextViewDietitianPatronymic).text = appointment.dietitianId?.profileId?.patronymic;
        view.findViewById<TextView>(R.id.idTextViewDietitianEmail).text = appointment.dietitianId?.email;
        view.findViewById<TextView>(R.id.idTextViewDietitianPhone).text = appointment.dietitianId?.profileId?.phone;
        view.findViewById<TextView>(R.id.idTextViewDietitianRecommendation).text = appointment.recommendations;

        Log.e("meeeee", "me: $appointment")
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_appoinment_detail, container, false)
    }
    private fun updateDishesList(data: List<AllowedDishResponse>?) {
        data?.let {
            adapter.setData(it)
            adapter.notifyDataSetChanged()
        }
    }

}

