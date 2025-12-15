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
            'notes' => $request->notes,
            'status' => 'pending_approval',
        ]);

        // Optionally update lead status to processing
        Lead::where('id', $request->lead_id)->update(['status' => 'processing']);

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
        if (Auth::user()->role !== 'manager') {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $project->update(['status' => 'approved']);

        return redirect()->back()->with('success', 'Project approved.');
    }

    /**
     * Reject the project (Manager only).
     */
    public function reject(Project $project)
    {
        if (Auth::user()->role !== 'manager') {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $project->update(['status' => 'rejected']);
        $project->lead->update(['status' => 'lost']);

        return redirect()->back()->with('success', 'Project rejected.');
    }

    /**
     * Complete the project (Installation done).
     */
    public function complete(Project $project)
    {
        // Allow sales or manager to mark complete? Let's say both.

        $project->update([
            'status' => 'completed',
            'installation_date' => now(),
        ]);

        $project->lead->update(['status' => 'converted']);

        // Create Customer Record
        Customer::create([
            'name' => $project->lead->name,
            'email' => $project->lead->email,
            'phone' => $project->lead->phone,
            'address' => $project->lead->address,
            'subscription_date' => now(),
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
