import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.FragmentManager
import androidx.navigation.Navigation
import com.example.mobile.R
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.fragments.AppointmentDetailFragment
import com.example.mobile.fragments.DishFragment
import com.example.mobile.fragments.MainFragment
import com.example.mobile.fragments.SettingsFragment
import com.example.mobile.utils.AllowedDishResponse
import com.example.mobile.utils.AppointmentResponse
import com.google.gson.Gson
import com.squareup.picasso.Picasso
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale



class DishesAdapter(private val fragmentManager: FragmentManager) : RecyclerView.Adapter<DishesAdapter.DishViewHolder>() {
    private val dishes: MutableList<AllowedDishResponse> = mutableListOf()


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DishViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_dish, parent, false)

        return DishViewHolder(view)
    }

    override fun onBindViewHolder(holder: DishViewHolder, position: Int) {
        val dish = dishes[position]
        holder.bind(dish)


        holder.itemView.setOnClickListener {
            val dish = dishes[position]
            val fragment = DishFragment()

            val gson = Gson()
            val dishJson = gson.toJson(dish)

            val bundle = Bundle()
            bundle.putString("dishJson", dishJson)
            fragment.arguments = bundle

            fragmentManager.beginTransaction()
                .replace(R.id.fragmentContainerView, fragment)
                .addToBackStack(null)
                .commit()
        }
    }

    override fun getItemCount(): Int {
        return dishes.size
    }

    fun setData(data: List<AllowedDishResponse>) {
        dishes.clear()
        dishes.addAll(data)
    }

    class DishViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val idTextView: TextView = itemView.findViewById(R.id.idTextViewDish)
        private val idImageViewDish: ImageView = itemView.findViewById(R.id.idImageViewDish)


        fun bind(allowedDish: AllowedDishResponse) {
            idTextView.text = allowedDish._id?.name.toString();
            val imageSrc = "http://192.168.0.104:5000/" + allowedDish._id?.images?.get(0);
            Picasso.get().load(imageSrc).into(idImageViewDish)
        }




    }
}
