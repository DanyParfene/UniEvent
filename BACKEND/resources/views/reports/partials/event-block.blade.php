@php /** @var \App\Models\Event $event */ @endphp
<div class="event">
    <h3>{{ $event->event_name }}</h3>
    <p>
        <strong>Perioadă:</strong> {{ $event->start_event_date?->format('d.m.Y') }} – {{ $event->finish_event_date?->format('d.m.Y') }}<br>
        <strong>Organizator:</strong> {{ $event->organizer }}<br>
        <strong>Locație:</strong> {{ $event->location }}<br>
        <strong>Departament:</strong> {{ $event->department }}<br>
        <strong>Status:</strong> {{ $event->status->value }}<br>
        <strong>Participanți estimați:</strong> {{ $event->number_of_participants }}
    </p>
    @if($event->description)
        <p><strong>Descriere:</strong> {{ \Illuminate\Support\Str::limit($event->description, 500) }}</p>
    @endif
    @if($event->relationLoaded('partners') && $event->partners->isNotEmpty())
        <p class="partners"><strong>Parteneri:</strong> {{ $event->partners->pluck('name')->join(', ') }}</p>
    @endif
    @if($event->relationLoaded('metrics') && $event->metrics->isNotEmpty())
        <table>
            <thead>
                <tr>
                    <th>Categorie</th>
                    <th>Link</th>
                    <th>Reach</th>
                    <th>Engagement</th>
                </tr>
            </thead>
            <tbody>
                @foreach($event->metrics as $metric)
                    <tr>
                        <td>{{ $metric->category->value }}</td>
                        <td>{{ $metric->link }}</td>
                        <td>{{ $metric->reach }}</td>
                        <td>{{ $metric->engagement }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>
