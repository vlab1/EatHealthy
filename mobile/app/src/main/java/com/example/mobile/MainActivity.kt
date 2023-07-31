package com.example.mobile

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.lifecycle.lifecycleScope
import com.example.mobile.databinding.ActivityMainBinding
import com.example.mobile.fragments.LoginFragment
import com.example.mobile.fragments.MainFragment
import com.example.mobile.fragments.ProfileFragment
import com.example.mobile.fragments.SettingsFragment
import com.example.mobile.fragments.StatisticsFragment
import com.example.mobile.utils.ApiService
import com.example.mobile.utils.RetrofitHelper
import com.example.mobile.utils.SharedPreferencesManager
import com.google.gson.JsonObject
import kotlinx.coroutines.launch
import java.util.*
import kotlin.concurrent.schedule

class MainActivity : AppCompatActivity() {

    private lateinit var apiService: ApiService
    private lateinit var  binding: ActivityMainBinding
    private lateinit var toggle: ActionBarDrawerToggle

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val sharedPreferencesManager = SharedPreferencesManager(applicationContext);
        val accessToken = sharedPreferencesManager.getAccessToken();
        if (accessToken != null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragmentContainerView, MainFragment())
                .commit()
        }
        binding.apply {
            if (accessToken == null) {
                navView.visibility = View.GONE
                drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED)
            } else {
                toggle = ActionBarDrawerToggle(this@MainActivity, drawerLayout, R.string.open, R.string.close )
                drawerLayout.addDrawerListener(toggle)
                toggle.syncState()

                supportActionBar?.setDisplayHomeAsUpEnabled(true)


                navView.setNavigationItemSelectedListener {
                    when (it.itemId) {
                        R.id.profile -> {
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fragmentContainerView, ProfileFragment())
                                .commit()
                        }
                        R.id.appoinments -> {
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fragmentContainerView, MainFragment())
                                .commit()
                        }
                        R.id.settings -> {
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fragmentContainerView, SettingsFragment())
                                .commit()
                        }
                        R.id.statistics -> {
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fragmentContainerView, StatisticsFragment())
                                .commit()
                        }
                        R.id.logout -> {
                            logout()
                        }
                    }
                    drawerLayout.closeDrawer(GravityCompat.START)
                    true
                }
            }

        }

    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if(toggle.onOptionsItemSelected(item)) true
        return super.onOptionsItemSelected(item)
    }

    private fun logout() {
        val sharedPreferencesManager = SharedPreferencesManager(applicationContext)
        sharedPreferencesManager.clearAccessToken()
        val intent = Intent(applicationContext, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}