package com.example.mobile.fragments

import IngredientsAdapter
import android.os.Bundle
import android.text.SpannableString
import android.text.style.UnderlineSpan
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.navigation.Navigation
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.R
import com.example.mobile.utils.AllowedDishResponse
import com.example.mobile.utils.AppointmentResponse
import com.example.mobile.utils.IngredientResponse
import com.google.gson.Gson
import org.imaginativeworld.whynotimagecarousel.ImageCarousel
import org.imaginativeworld.whynotimagecarousel.model.CarouselItem

class DishFragment : Fragment() {
    private lateinit var  textViewNavigateEatingPlaceFragment: TextView
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: IngredientsAdapter
    private lateinit var carusel: ImageCarousel

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val dishJson = arguments?.getString("dishJson")
        val gson = Gson()
        val dish = gson.fromJson(dishJson, AllowedDishResponse::class.java)
        val images = dish._id?.images;
        recyclerView = view.findViewById(R.id.recyclerViewIngredients)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        adapter = IngredientsAdapter()
        recyclerView.adapter = adapter
        updateDishesList(dish._id?.ingredients)

        view.findViewById<TextView>(R.id.dishName).text = dish._id?.name;
        view.findViewById<TextView>(R.id.dishPrice).text = dish._id?.price;
        view.findViewById<TextView>(R.id.dishDescription).text = dish._id?.description?.en;
        carusel =  view.findViewById(R.id.carousel)
        carusel.registerLifecycle(lifecycle)
        val list = mutableListOf<CarouselItem>()
        Log.e("meeeee", "me: $images")
        if (images != null) {
            for (i in 0 until images.size) {
                val imageUrl = "http://192.168.0.104:5000/" + images[i]
                val carouselItem = CarouselItem(imageUrl)
                list.add(carouselItem)
            }
        }
        carusel.setData(list)


        val mTextView = view.findViewById<TextView>(R.id.navEatingPlace)

        val mString = "Go to eating place"
        val mSpannableString = SpannableString(mString)

        mSpannableString.setSpan(UnderlineSpan(), 0, mSpannableString.length, 0)
        mTextView.text = mSpannableString
    }

    private fun updateDishesList(data: List<IngredientResponse>?) {
        data?.let {
            adapter.setData(it)
            adapter.notifyDataSetChanged()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View = inflater.inflate(R.layout.fragment_dish, container, false)
        val dishJson = arguments?.getString("dishJson")
        val gson = Gson()
        val dish = gson.fromJson(dishJson, AllowedDishResponse::class.java)
        textViewNavigateEatingPlaceFragment = view.findViewById((R.id.navEatingPlace))
        textViewNavigateEatingPlaceFragment.setOnClickListener {
            val fragment = EatingPlaceFragment()

            val gson = Gson()
            val eatingPlaceJson = gson.toJson(dish._id?.userId?.profileId)

            val bundle = Bundle()
            bundle.putString("eatingPlaceJson", eatingPlaceJson)
            fragment.arguments = bundle
            requireFragmentManager().beginTransaction()
                .replace(R.id.fragmentContainerView, fragment)
                .addToBackStack(null)
                .commit()
        }
        return view
    }

}