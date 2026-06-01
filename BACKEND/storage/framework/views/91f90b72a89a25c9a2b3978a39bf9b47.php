<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="utf-8">
    <title><?php echo e($title); ?></title>
    <style>
        @page { margin: 24px; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1a1a1a; }
        h1 { font-size: 18px; margin: 0 0 8px; }
        h2 { font-size: 14px; margin: 18px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        h3 { font-size: 12px; margin: 12px 0 6px; }
        .meta { color: #555; margin-bottom: 16px; }
        .event { margin-bottom: 16px; page-break-inside: avoid; }
        .event table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        .event th, .event td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
        .event th { background: #f5f5f5; }
        .partners { margin-top: 4px; }
    </style>
</head>
<body>
    <h1><?php echo e($title); ?></h1>
    <p class="meta">Generat la <?php echo e(now()->timezone(config('app.timezone'))->format('d.m.Y H:i')); ?></p>
    <?php echo $__env->yieldContent('content'); ?>
</body>
</html>
<?php /**PATH /var/www/html/resources/views/reports/layout.blade.php ENDPATH**/ ?>