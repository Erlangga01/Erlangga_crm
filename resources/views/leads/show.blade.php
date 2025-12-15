<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Lead Details') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">Name</h3>
                        <p>{{ $lead->name }}</p>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">Email</h3>
                        <p>{{ $lead->email }}</p>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">Phone</h3>
                        <p>{{ $lead->phone }}</p>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">Address</h3>
                        <p>{{ $lead->address }}</p>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">Interested Product</h3>
                        <p>{{ $lead->product->name ?? 'N/A' }}</p>
                    </div>
                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">Status</h3>
                        <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {{ ucfirst($lead->status) }}
                        </span>
                    </div>

                    <div class="flex gap-4">
                        <a href="{{ route('leads.edit', $lead) }}"
                            class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Edit</a>
                        <form action="{{ route('projects.store') }}" method="POST">
                            @csrf
                            <input type="hidden" name="lead_id" value="{{ $lead->id }}">
                            <input type="hidden" name="product_id" value="{{ $lead->interested_product_id }}">
                            <button type="submit"
                                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" {{ $lead->status == 'Converted' ? 'disabled' : '' }}>
                                Convert to Project
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>