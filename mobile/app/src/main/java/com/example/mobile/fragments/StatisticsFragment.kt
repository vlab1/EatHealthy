package com.example.mobile.fragments

import android.graphics.Color
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.mobile.R
import com.example.mobile.utils.ApiService
import com.example.mobile.utils.BaseResponse
import com.example.mobile.utils.RetrofitHelper
import com.example.mobile.utils.StatisticsResponse
import kotlinx.coroutines.launch
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.components.Legend
import com.github.mikephil.charting.formatter.ValueFormatter
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale


class StatisticsFragment : Fragment() {
    private lateinit var apiService: ApiService
    private lateinit var averageTotalCholesterol : TextView
    private lateinit var averageHDLCholesterol : TextView
    private lateinit var averageVLDLCholesterol : TextView
    private lateinit var averageLDLCholesterol : TextView
    private lateinit var lineChart: LineChart
    private lateinit var statistics: StatisticsResponse

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        apiService = RetrofitHelper.getInstance(requireContext()).create(ApiService::class.java)
        getMyStatistics()
        averageTotalCholesterol = view.findViewById(R.id.averageTotalCholesterol)
        averageHDLCholesterol = view.findViewById(R.id.averageHDLCholesterol)
        averageVLDLCholesterol = view.findViewById(R.id.averageVLDLCholesterol)
        averageLDLCholesterol = view.findViewById(R.id.averageLDLCholesterol)
        lineChart = view.findViewById(R.id.lineChart)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view: View = inflater.inflate(R.layout.fragment_statistics, container, false);
        return view
    }

    private fun getMyStatistics() {
        lifecycleScope.launch {
            val result = apiService.getMyStatistics()

            if (result.isSuccessful) {
                val response = result.body()?.data
                val averageTotalCholesterolValue = response?.averageTotalCholesterol?.toString()
                val averageHDLCholesterolValue = response?.averageHDLCholesterol?.toString()
                val averageVLDLCholesterolValue = response?.averageVLDLCholesterol?.toString()
                val averageLDLCholesterolValue = response?.averageLDLCholesterol?.toString()
                averageTotalCholesterol.setText("$averageTotalCholesterolValue (mmol/L)")
                averageHDLCholesterol.setText("$averageHDLCholesterolValue (mmol/L)")
                averageVLDLCholesterol.setText("$averageVLDLCholesterolValue (mmol/L)")
                averageLDLCholesterol.setText("$averageLDLCholesterolValue (mmol/L)")

                val entries1 = mutableListOf<Entry>()
                val entries2 = mutableListOf<Entry>()
                val entries3 = mutableListOf<Entry>()
                val entries4 = mutableListOf<Entry>()
                val labels = mutableListOf<String>()

                val dietitianAppointment = response?.dietitianAppointment;

                dietitianAppointment?.forEachIndexed { index, appointment ->
                    val entry1 = Entry(index.toFloat(), appointment?.measurementId?.totalCholesterol?.toFloat() ?: 0f)
                    val entry2 = Entry(index.toFloat(), appointment?.measurementId?.hdlCholesterol?.toFloat() ?: 0f)
                    val entry3 = Entry(index.toFloat(), appointment?.measurementId?.vldlCholesterol?.toFloat() ?: 0f)
                    val entry4 = Entry(index.toFloat(), appointment?.measurementId?.ldlCholesterol?.toFloat() ?: 0f)
                    entries1.add(entry1)
                    entries2.add(entry2)
                    entries3.add(entry3)
                    entries4.add(entry4)
                    val formattedDateTime = formatDate(appointment?.measurementId?.createdAt);
                    labels.add(formattedDateTime)
                }


                val dataSet1 = LineDataSet(entries1, "Total")
                dataSet1.color = Color.BLUE
                dataSet1.valueTextColor = Color.BLUE


                val dataSet2 = LineDataSet(entries2, "HDL")
                dataSet2.color = Color.RED
                dataSet2.valueTextColor = Color.RED

                val dataSet3 = LineDataSet(entries3, "VLDL")
                dataSet3.color = Color.DKGRAY
                dataSet3.valueTextColor = Color.DKGRAY

                val dataSet4 = LineDataSet(entries4, "LDL")
                dataSet4.color = Color.MAGENTA
                dataSet4.valueTextColor = Color.MAGENTA

                val lineData = LineData(dataSet1, dataSet2, dataSet3, dataSet4)

                lineChart.xAxis.valueFormatter = IndexAxisValueFormatter(labels)
                lineChart.data = lineData
                lineChart.description.isEnabled = false

                val legend = lineChart.legend
                legend.form = Legend.LegendForm.LINE
                legend.textColor = Color.BLACK

                lineChart.invalidate()
            } else {
                Log.e("meeeee", "me field: ${result.message()}")
            }
        }
    }

    private fun formatDate(inputDate: String?): String {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.getDefault())
        val outputFormat = SimpleDateFormat("MM-dd", Locale.getDefault())

        return try {
            val date = inputFormat.parse(inputDate)
            outputFormat.format(date)
        } catch (e: Exception) {
            e.printStackTrace()
            ""
        }
    }

}