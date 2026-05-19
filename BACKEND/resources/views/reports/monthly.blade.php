@extends('reports.layout')

@section('content')
    @php /** @var \App\Support\Report\MonthlyReportDataset $dataset */ @endphp

    <p class="meta">Perioadă: {{ $dataset->periodLabel }}</p>

    <h2>Reach total (social media)</h2>
    <p><strong>{{ number_format($dataset->totalReach) }}</strong></p>

    <h2>Top evenimente după reach</h2>
    @if($dataset->topEvents === [])
        <p>Nu există evenimente cu metrici sociale în această perioadă.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Eveniment</th>
                    <th>Reach</th>
                </tr>
            </thead>
            <tbody>
                @foreach($dataset->topEvents as $row)
                    <tr>
                        <td>{{ $row['name'] }}</td>
                        <td>{{ number_format($row['reach']) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2>Distribuție pe departamente</h2>
    @if($dataset->departmentDistribution === [])
        <p>Nu există evenimente înregistrate în această perioadă.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Departament</th>
                    <th>Număr evenimente</th>
                </tr>
            </thead>
            <tbody>
                @foreach($dataset->departmentDistribution as $row)
                    <tr>
                        <td>{{ $row['department'] }}</td>
                        <td>{{ $row['count'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
