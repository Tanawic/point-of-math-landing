CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`level` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`price` varchar(50) NOT NULL,
	`category` varchar(50) NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_level_unique` UNIQUE(`level`)
);
