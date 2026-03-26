<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('first_name', 100);
            $table->string('last_name',  100);
            $table->string('company_name')->nullable();
            $table->string('address', 500);
            $table->string('city',     100);
            $table->string('country',  100);
            $table->string('postcode',  20);
            $table->string('mobile',    20);
            $table->string('email');
            $table->text('order_notes')->nullable();
            $table->string('shipping_method', 100);
            $table->string('payment_method',  100);
            $table->decimal('subtotal',      10, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('total',         10, 2);
            $table->enum('status', ['pending','processing','shipped','delivered','cancelled'])
                  ->default('pending');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
