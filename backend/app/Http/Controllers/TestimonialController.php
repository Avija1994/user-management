<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::latest()->get();

        return response()->json(['data' => $testimonials]);
    }
}
