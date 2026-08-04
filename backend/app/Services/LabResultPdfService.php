<?php

namespace App\Services;

use App\Models\LabResult;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LabResultPdfService
{
    /**
     * Ensure an approved lab result has a PDF on disk and return the relative path.
     */
    public function ensurePdf(LabResult $result): string
    {
        $result->loadMissing(['order.patient.user', 'items', 'reviewer']);

        if ($result->pdf_path) {
            $absolute = storage_path('app/public/'.$result->pdf_path);
            if (is_file($absolute)) {
                return $result->pdf_path;
            }
        }

        $relativePath = $this->buildRelativePath($result);
        $html = view('pdf.lab-result', [
            'result' => $result,
            'patient' => $result->order?->patient,
            'order' => $result->order,
            'items' => $result->items,
            'reviewer' => $result->reviewer,
            'generatedAt' => now(),
        ])->render();

        $options = new Options;
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', false);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        Storage::disk('public')->put($relativePath, $dompdf->output());

        $result->update(['pdf_path' => $relativePath]);

        return $relativePath;
    }

    private function buildRelativePath(LabResult $result): string
    {
        $slug = Str::slug($result->report_name ?: 'lab-result');
        $orderPart = $result->order?->order_number
            ? Str::slug($result->order->order_number)
            : (string) $result->order_id;

        return sprintf(
            'lab-results/%s/%s-%d.pdf',
            $orderPart,
            $slug,
            $result->id,
        );
    }
}
