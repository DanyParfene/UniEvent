@extends('reports.layout')

@section('content')
    @php /** @var \App\Support\Report\WeeklyReportDataset $dataset */ @endphp

    <p class="meta">Perioadă analizată: {{ $dataset->periodLabel }}</p>

    <h2>Evenimente săptămâna trecută</h2>
    @forelse($dataset->pastWeekEvents as $event)
        @include('reports.partials.event-block', ['event' => $event])
    @empty
        <p>Nu există evenimente în această perioadă.</p>
    @endforelse

    <h2>Evenimente incomplete (fără metrici sociale)</h2>
    @forelse($dataset->incompleteEvents as $event)
        @include('reports.partials.event-block', ['event' => $event])
    @empty
        <p>Toate evenimentele încheiate au metrici sociale completate.</p>
    @endforelse

    <h2>Program săptămâna viitoare</h2>
    @forelse($dataset->nextWeekEvents as $event)
        @include('reports.partials.event-block', ['event' => $event])
    @empty
        <p>Nu există evenimente programate pentru săptămâna viitoare.</p>
    @endforelse

    <h2>Impact social (săptămâna trecută)</h2>
    @forelse($dataset->socialImpact as $row)
        <div class="event">
            <h3>{{ $row['event']->event_name }}</h3>
            <p><strong>Reach total (social):</strong> {{ $row['total_reach'] }}</p>
        </div>
    @empty
        <p>Nu există date de impact social pentru perioada analizată.</p>
    @endforelse
@endsection
