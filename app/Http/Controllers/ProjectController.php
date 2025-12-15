<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Lead;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::with(['lead', 'product'])->get();
        return view('projects.index', compact('projects'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $leads = Lead::where('status', '!=', 'converted')->get(); // Only show non-converted leads? Or all? Let's show all for simplicity or filter.
        $products = Product::all();
        return view('projects.create', compact('leads', 'products'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'product_id' => 'required|exists:products,id',
            'notes' => 'nullable|string',
        ]);

        Project::create([
            'lead_id' => $request->lead_id,
            'product_id' => $request->product_id,
            'sales_id' => $request->user()->id, // Capture Sales ID
            'status' => 'Survey', // Initial status per System Analysis
            'is_manager_approved' => false,
        ]);

        // Update lead status
        Lead::where('id', $request->lead_id)->update(['status' => 'Converted']); // Or 'Qualified'? System Analysis says 'Converted' when project starts? "Lead menghilang dari list Lead dan masuk ke list Project" -> usually Converted.

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $project->load(['lead', 'product']);
        return view('projects.show', compact('project'));
    }

    /**
     * Approve the project (Manager only).
     */
    public function approve(Project $project)
    {
        $project->update([
            'status' => 'Installation',
            'is_manager_approved' => true,
            'approved_by' => request()->user()->id,
            'approved_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Project approved. Ready for installation.');
    }

    /**
     * Reject the project (Manager only).
     */
    public function reject(Project $project)
    {
        $project->update(['status' => 'Cancelled']);

        return redirect()->back()->with('success', 'Project rejected.');
    }

    /**
     * Complete the project (Installation done).
     */
    public function complete(Project $project)
    {
        $project->update([
            'status' => 'Completed',
            'installation_date' => now(),
        ]);

        // Create Customer Record
        // Generate Account Number
        $accountNumber = 'CUST-' . date('Y') . '-' . str_pad($project->id, 4, '0', STR_PAD_LEFT);

        Customer::create([
            'user_account_number' => $accountNumber,
            'project_id' => $project->id,
            'name' => $project->lead->name,
            'billing_address' => $project->lead->address, // Assuming billing address same as lead address
            'subscription_start_date' => now(),
            'status' => 'Active',
        ]);

        return redirect()->back()->with('success', 'Project completed and Customer created.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
