@extends('reports.layout')

@section('content')
    @forelse($dataset->events ?? [] as $event)
        @include('reports.partials.event-block', ['event' => $event])
    @empty
        <p>Nu există evenimente în acest raport.</p>
    @endforelse
@endsection
