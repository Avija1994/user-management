-- ============================================================
-- DB SCHEMA: Fruitables Organic E-Commerce Platform
-- Database:  MySQL 8.0
-- Generated: March 24, 2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS `fruitables`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `fruitables`;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE `users` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255)    NOT NULL,
  `email`      VARCHAR(255)    NOT NULL,
  `password`   VARCHAR(255)    NOT NULL,
  `role`       ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  `updated_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: categories
-- ------------------------------------------------------------
CREATE TABLE `categories` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100)    NOT NULL,
  `slug`       VARCHAR(100)    NOT NULL,
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  `updated_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed categories
INSERT INTO `categories` (`name`, `slug`, `created_at`, `updated_at`) VALUES
('Vegetables', 'vegetables', NOW(), NOW()),
('Fruits',     'fruits',     NOW(), NOW()),
('Bread',      'bread',      NOW(), NOW()),
('Meat',       'meat',       NOW(), NOW());

-- ------------------------------------------------------------
-- Table: products
-- ------------------------------------------------------------
CREATE TABLE `products` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `name`        VARCHAR(255)    NOT NULL,
  `slug`        VARCHAR(255)    NOT NULL,
  `description` TEXT            NULL,
  `price`       DECIMAL(10,2)   NOT NULL,
  `unit`        VARCHAR(50)     NOT NULL DEFAULT 'kg',
  `image`       VARCHAR(500)    NULL,
  `stock`       INT             NOT NULL DEFAULT 0,
  `rating`      DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  `is_featured` TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`  TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_price_index` (`price`),
  KEY `products_is_featured_index` (`is_featured`),
  CONSTRAINT `products_category_id_foreign`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed products
INSERT INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `unit`, `stock`, `rating`, `is_featured`, `created_at`, `updated_at`) VALUES
(2, 'Grapes',       'grapes',       'Fresh organic grapes, sweet and juicy.',              4.99, 'kg',   50,  4.5, 1, NOW(), NOW()),
(2, 'Raspberries',  'raspberries',  'Hand-picked organic raspberries.',                    4.99, 'kg',   30,  4.7, 1, NOW(), NOW()),
(2, 'Apricots',     'apricots',     'Sun-ripened organic apricots.',                       4.99, 'kg',   40,  4.3, 0, NOW(), NOW()),
(2, 'Banana',       'banana',       'Organically grown bananas, rich in potassium.',       4.99, 'kg',   60,  4.6, 1, NOW(), NOW()),
(2, 'Oranges',      'oranges',      'Juicy organic oranges full of vitamin C.',            4.99, 'kg',   70,  4.8, 1, NOW(), NOW()),
(1, 'Broccoli',     'broccoli',     'Farm-fresh organic broccoli florets.',                3.99, 'kg',   45,  4.4, 1, NOW(), NOW()),
(1, 'Potatoes',     'potatoes',     'Earthy, creamy organic potatoes.',                    2.99, 'kg',   100, 4.2, 0, NOW(), NOW()),
(1, 'Pumpkin',      'pumpkin',      'Sweet organic pumpkin, great for soups and pies.',    5.99, 'piece',25,  4.5, 0, NOW(), NOW()),
(3, 'Whole Wheat Bread',  'whole-wheat-bread',  'Freshly baked whole wheat organic bread.',  3.49, 'loaf', 20, 4.6, 1, NOW(), NOW()),
(3, 'Sourdough Loaf',     'sourdough-loaf',     'Artisan sourdough bread with organic flour.', 4.49, 'loaf', 15, 4.8, 1, NOW(), NOW()),
(4, 'Organic Chicken',    'organic-chicken',    'Free-range organic chicken, whole.',         12.99,'piece',20, 4.7, 1, NOW(), NOW()),
(4, 'Grass-Fed Beef',     'grass-fed-beef',     'Premium grass-fed organic beef cuts.',       15.99,'kg',   15, 4.9, 1, NOW(), NOW());

-- ------------------------------------------------------------
-- Table: cart_items
-- ------------------------------------------------------------
CREATE TABLE `cart_items` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `quantity`   INT             NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  `updated_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_user_product_unique` (`user_id`, `product_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  CONSTRAINT `cart_items_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: orders
-- ------------------------------------------------------------
CREATE TABLE `orders` (
  `id`              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `user_id`         BIGINT UNSIGNED  NOT NULL,
  `first_name`      VARCHAR(100)     NOT NULL,
  `last_name`       VARCHAR(100)     NOT NULL,
  `company_name`    VARCHAR(255)     NULL,
  `address`         VARCHAR(500)     NOT NULL,
  `city`            VARCHAR(100)     NOT NULL,
  `country`         VARCHAR(100)     NOT NULL,
  `postcode`        VARCHAR(20)      NOT NULL,
  `mobile`          VARCHAR(20)      NOT NULL,
  `email`           VARCHAR(255)     NOT NULL,
  `order_notes`     TEXT             NULL,
  `shipping_method` VARCHAR(100)     NOT NULL,
  `payment_method`  VARCHAR(100)     NOT NULL,
  `subtotal`        DECIMAL(10,2)    NOT NULL,
  `shipping_cost`   DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  `total`           DECIMAL(10,2)    NOT NULL,
  `status`          ENUM('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `created_at`      TIMESTAMP        NULL DEFAULT NULL,
  `updated_at`      TIMESTAMP        NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_status_index` (`status`),
  CONSTRAINT `orders_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: order_items
-- ------------------------------------------------------------
CREATE TABLE `order_items` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`     BIGINT UNSIGNED NOT NULL,
  `product_id`   BIGINT UNSIGNED NULL,
  `product_name` VARCHAR(255)    NOT NULL,
  `price`        DECIMAL(10,2)   NOT NULL,
  `quantity`     INT             NOT NULL,
  `total`        DECIMAL(10,2)   NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: testimonials
-- ------------------------------------------------------------
CREATE TABLE `testimonials` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)    NOT NULL,
  `designation` VARCHAR(255)    NULL,
  `image`       VARCHAR(500)    NULL,
  `comment`     TEXT            NOT NULL,
  `rating`      TINYINT         NOT NULL DEFAULT 5,
  `created_at`  TIMESTAMP       NULL DEFAULT NULL,
  `updated_at`  TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed testimonials
INSERT INTO `testimonials` (`name`, `designation`, `comment`, `rating`, `created_at`, `updated_at`) VALUES
('Client Name 1', 'Profession', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam quaerat voluptatem distinctio labore iusto.', 5, NOW(), NOW()),
('Client Name 2', 'Profession', 'Great quality organic products. Will order again!', 5, NOW(), NOW()),
('Client Name 3', 'Profession', 'Fast delivery and fresh produce every time.', 4, NOW(), NOW()),
('Client Name 4', 'Profession', 'Amazing selection of fruits and vegetables.', 5, NOW(), NOW());

-- ------------------------------------------------------------
-- Table: contacts
-- ------------------------------------------------------------
CREATE TABLE `contacts` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255)    NOT NULL,
  `email`      VARCHAR(255)    NOT NULL,
  `message`    TEXT            NOT NULL,
  `created_at` TIMESTAMP       NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Admin user (password: Admin@123)
-- ------------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
('Admin', 'admin@fruitables.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW());
