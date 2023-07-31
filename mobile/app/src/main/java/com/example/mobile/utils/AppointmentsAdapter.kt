import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.FragmentManager
import androidx.navigation.Navigation
import com.example.mobile.R
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.fragments.AppointmentDetailFragment
import com.example.mobile.fragments.MainFragment
import com.example.mobile.fragments.SettingsFragment
import com.example.mobile.utils.AppointmentResponse
import com.google.gson.Gson
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale



class AppointmentsAdapter(private val fragmentManager: FragmentManager) : RecyclerView.Adapter<AppointmentsAdapter.AppointmentViewHolder>() {
    private val appointments: MutableList<AppointmentResponse> = mutableListOf()


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AppointmentViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_appointment, parent, false)

        return AppointmentViewHolder(view)
    }

    override fun onBindViewHolder(holder: AppointmentViewHolder, position: Int) {
        val appointment = appointments[position]
        holder.bind(appointment)

        holder.itemView.setOnClickListener {
            val appointment = appointments[position]
            val fragment = AppointmentDetailFragment()
            val gson = Gson()
            val appointmentJson = gson.toJson(appointment)
            val bundle = Bundle()
            bundle.putString("appointmentJson", appointmentJson)
            fragment.arguments = bundle
            fragmentManager.beginTransaction()
                .replace(R.id.fragmentContainerView, fragment)
                .addToBackStack(null)
                .commit()
        }

    }

    override fun getItemCount(): Int {
        return appointments.size
    }

    fun setData(data: List<AppointmentResponse>) {
        appointments.clear()
        appointments.addAll(data)
    }

    class AppointmentViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val idTextView: TextView = itemView.findViewById(R.id.idTextView)
        private val idTextViewDietitianFirstName: TextView = itemView.findViewById(R.id.idTextViewDietitianFirstName)
        private val idTextViewDietitianLastName: TextView = itemView.findViewById(R.id.idTextViewDietitianLastName)
        private val idTextViewDietitianPatronymic: TextView = itemView.findViewById(R.id.idTextViewDietitianPatronymic)


        fun bind(appointment: AppointmentResponse) {
            idTextView.text = convertDateTime(appointment.createdAt.toString())
            idTextViewDietitianFirstName.text = appointment.dietitianId?.profileId?.firstName ?: ""
            idTextViewDietitianLastName.text = appointment.dietitianId?.profileId?.lastName ?: ""
            idTextViewDietitianPatronymic.text = appointment.dietitianId?.profileId?.patronymic ?: ""
        }



        fun convertDateTime(dateTimeString: String): String {
            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.getDefault())
            val outputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

            val date: Date = inputFormat.parse(dateTimeString) ?: return ""
            return outputFormat.format(date)
        }
    }
}
