CREATE TABLE `courseImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseLevel` varchar(100) NOT NULL,
	`imageKey` varchar(500) NOT NULL,
	`imageUrl` text NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseImages_id` PRIMARY KEY(`id`),
	CONSTRAINT `courseImages_courseLevel_unique` UNIQUE(`courseLevel`)
);
