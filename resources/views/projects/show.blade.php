<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Project Details') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="text-2xl font-bold mb-2">Project #{{ $project->id }}</h3>
                            <span class="px-2 py-1 text-sm font-semibold rounded-full 
                                @if($project->status === 'approved') bg-blue-100 text-blue-800 
                                @elseif($project->status === 'completed') bg-green-100 text-green-800
                                @elseif($project->status === 'rejected') bg-red-100 text-red-800
                                @else bg-yellow-100 text-yellow-800 @endif">
                                {{ ucfirst(str_replace('_', ' ', $project->status)) }}
                            </span>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500">Created: {{ $project->created_at->format('d M Y') }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 class="font-bold text-lg mb-4">Lead Information</h4>
                            <p><strong>Company:</strong> {{ $project->lead->name }}</p>
                            <p><strong>Contact:</strong> {{ $project->lead->contact_person }}</p>
                            <p><strong>Email:</strong> {{ $project->lead->email }}</p>
                            <p><strong>Phone:</strong> {{ $project->lead->phone }}</p>
                            <p><strong>Address:</strong> {{ $project->lead->address }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h4 class="font-bold text-lg mb-4">Service Details</h4>
                            <p><strong>Product:</strong> {{ $project->product->name }}</p>
                            <p><strong>Price:</strong> Rp {{ number_format($project->product->price, 0, ',', '.') }}</p>
                            <p><strong>Speed:</strong> {{ $project->product->speed }} Mbps</p>
                            <p><strong>Notes:</strong> {{ $project->notes ?? '-' }}</p>
                            @if($project->installation_date)
                                <p class="mt-2 text-green-600 font-semibold">Installed on:
                                    {{ \Carbon\Carbon::parse($project->installation_date)->format('d M Y') }}</p>
                            @endif
                        </div>
                    </div>

                    <div class="mt-8 flex space-x-4 border-t pt-6">
                        @if(auth()->user()->role === 'manager' && $project->status === 'pending_approval')
                            <form action="{{ route('projects.approve', $project) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <button type="submit"
                                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
                                    Approve Project
                                </button>
                            </form>
                            <form action="{{ route('projects.reject', $project) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <button type="submit"
                                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
                                    onclick="return confirm('Are you sure you want to reject this project?')">
                                    Reject Project
                                </button>
                            </form>
                        @endif

                        @if($project->status === 'approved')
                            <form action="{{ route('projects.complete', $project) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <button type="submit"
                                    class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
                                    onclick="return confirm('Mark as Completed and Create Customer?')">
                                    Mark as Installed / Completed
                                </button>
                            </form>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>