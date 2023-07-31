package com.example.mobile.fragments

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import com.example.mobile.R
import com.example.mobile.utils.AllowedDishResponse
import com.example.mobile.utils.ProfileEatingPlaceIdResponse
import com.google.gson.Gson
import org.imaginativeworld.whynotimagecarousel.ImageCarousel
import org.imaginativeworld.whynotimagecarousel.model.CarouselItem

class EatingPlaceFragment : Fragment() {

    private lateinit var carusel: ImageCarousel

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val eatingPlaceJson = arguments?.getString("eatingPlaceJson")
        val gson = Gson()
        val eatingPlace = gson.fromJson(eatingPlaceJson, ProfileEatingPlaceIdResponse::class.java)
        val images = eatingPlace.images;
        val country = eatingPlace.country?.en;
        val city = eatingPlace.city?.en;
        val region = eatingPlace.region?.en;
        val address = eatingPlace.address?.en;
        val postcode = eatingPlace.postcode;

        view.findViewById<TextView>(R.id.eatingPlaceName).text = eatingPlace.name;
        view.findViewById<TextView>(R.id.eatingPlaceAddress).text = "$country, $region, $city, $address, $postcode"
        view.findViewById<TextView>(R.id.eatingPlaceDescription).text = eatingPlace.description?.en;
        carusel =  view.findViewById(R.id.carousel)
        carusel.registerLifecycle(lifecycle)
        val list = mutableListOf<CarouselItem>()
        if (images != null) {
            for (i in 0 until images.size) {
                val imageUrl = "http://192.168.0.104:5000/" + images[i]
                val carouselItem = CarouselItem(imageUrl)
                list.add(carouselItem)
            }
        }
        carusel.setData(list)
        Log.e("meeeee", "me: $eatingPlace")
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        return inflater.inflate(R.layout.fragment_eating_place, container, false)
    }


}