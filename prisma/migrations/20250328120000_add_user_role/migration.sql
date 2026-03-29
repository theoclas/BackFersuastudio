-- AlterTable: rol de usuario (ADMIN vs MANAGER)
ALTER TABLE `users` ADD COLUMN `role` ENUM('ADMIN', 'MANAGER') NOT NULL DEFAULT 'MANAGER';
