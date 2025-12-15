<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Project;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalLeads = Lead::count();
        $totalProjects = Project::where('status', '!=', 'Completed')->where('status', '!=', 'Cancelled')->count(); // Project Berjalan
        $activeCustomers = Customer::where('status', 'Active')->count();
        $totalProducts = Product::count();

        $recentLeads = Lead::latest()->take(3)->get();

        return view('dashboard', compact('totalLeads', 'totalProjects', 'activeCustomers', 'totalProducts', 'recentLeads'));
    }
}
