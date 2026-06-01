<?php /** @var \App\Models\Event $event */ ?>
<div class="event">
    <h3><?php echo e($event->event_name); ?></h3>
    <p>
        <strong>Perioadă:</strong> <?php echo e($event->start_event_date?->format('d.m.Y')); ?> – <?php echo e($event->finish_event_date?->format('d.m.Y')); ?><br>
        <strong>Organizator:</strong> <?php echo e($event->organizer); ?><br>
        <strong>Locație:</strong> <?php echo e($event->location); ?><br>
        <strong>Departament:</strong> <?php echo e($event->department); ?><br>
        <strong>Status:</strong> <?php echo e($event->status->value); ?><br>
        <strong>Participanți estimați:</strong> <?php echo e($event->number_of_participants); ?>

    </p>
    <?php if($event->description): ?>
        <p><strong>Descriere:</strong> <?php echo e(\Illuminate\Support\Str::limit($event->description, 500)); ?></p>
    <?php endif; ?>
    <?php if($event->relationLoaded('partners') && $event->partners->isNotEmpty()): ?>
        <p class="partners"><strong>Parteneri:</strong> <?php echo e($event->partners->pluck('name')->join(', ')); ?></p>
    <?php endif; ?>
    <?php if($event->relationLoaded('metrics') && $event->metrics->isNotEmpty()): ?>
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
                <?php $__currentLoopData = $event->metrics; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $metric): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td><?php echo e($metric->category->value); ?></td>
                        <td><?php echo e($metric->link); ?></td>
                        <td><?php echo e($metric->reach); ?></td>
                        <td><?php echo e($metric->engagement); ?></td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
    <?php endif; ?>
</div>
<?php /**PATH /var/www/html/resources/views/reports/partials/event-block.blade.php ENDPATH**/ ?>