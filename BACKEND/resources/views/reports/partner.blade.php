@extends('reports.layout')

@section('content')
    @foreach($dataset->partnerSections ?? [] as $section)
        <h2>{{ $section->partner->name }}</h2>
        @forelse($section->events as $event)
            @include('reports.partials.event-block', ['event' => $event])
        @empty
            <p>Nu există evenimente asociate acestui partener în domeniul de vizibilitate selectat.</p>
        @endforelse
    @endforeach
@endsection
