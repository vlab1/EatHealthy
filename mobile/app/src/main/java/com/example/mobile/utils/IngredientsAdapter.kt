import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import com.example.mobile.R
import androidx.recyclerview.widget.RecyclerView
import com.example.mobile.utils.AllowedDishResponse
import com.example.mobile.utils.IngredientResponse


class IngredientsAdapter() : RecyclerView.Adapter<IngredientsAdapter.IngredientsViewHolder>() {
    private val ingredients: MutableList<IngredientResponse> = mutableListOf()


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): IngredientsViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.ingredients_item, parent, false)

        return IngredientsViewHolder(view)
    }

    override fun onBindViewHolder(holder: IngredientsViewHolder, position: Int) {
        val ingredient = ingredients[position]
        holder.bind(ingredient)
    }

    override fun getItemCount(): Int {
        return ingredients.size
    }

    fun setData(data: List<IngredientResponse>) {
        ingredients.clear()
        ingredients.addAll(data)
    }

    class IngredientsViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val idTextViewIngredientsName: TextView = itemView.findViewById(R.id.idTextViewIngredientsName)
        private val idTextViewIngredientsWeight: TextView = itemView.findViewById(R.id.idTextViewIngredientsWeight)


        fun bind(ingredient: IngredientResponse) {
            idTextViewIngredientsName.text = ingredient.name?.en.toString();
            idTextViewIngredientsWeight.text = ingredient.weight.toString();
        }




    }
}
