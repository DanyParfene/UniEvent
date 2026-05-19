<?php

declare(strict_types=1);

namespace App\Enums;

enum EventMetricCategory: string
{
    case AlbumFoto = 'album_foto';
    case Facebook = 'facebook';
    case Instagram = 'instagram';
    case TikTok = 'tiktok';
    case ComunicatPresa = 'comunicat_presa';
    case AparitiiPresa = 'aparitii_presa';
    case Statistici = 'statistici';
    case Podcast = 'podcast';
}
