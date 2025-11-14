-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 14, 2025 at 10:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('dragdrop','quiz','coding','other') NOT NULL DEFAULT 'dragdrop',
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config_json`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `activity_items`
--

CREATE TABLE `activity_items` (
  `item_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `question_text` text DEFAULT NULL,
  `answer_key` text DEFAULT NULL,
  `points` decimal(5,2) DEFAULT 1.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `announcement_id` int(10) UNSIGNED NOT NULL,
  `subject_id` int(10) UNSIGNED NOT NULL,
  `instructor_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`announcement_id`, `subject_id`, `instructor_id`, `content`, `created_at`) VALUES
(1, 11, 3, 'asd', '2025-11-12 18:13:45'),
(2, 13, 1, 'sasasasd', '2025-11-14 14:34:48'),
(3, 13, 1, 'asdadsa', '2025-11-14 14:36:05'),
(4, 17, 1, 'sdadad', '2025-11-14 14:42:13'),
(5, 15, 1, 'saasas', '2025-11-14 14:49:19'),
(6, 15, 1, 'sasdasdsadasd', '2025-11-14 14:52:42'),
(7, 15, 1, 'dsdadsa', '2025-11-14 14:55:38'),
(11, 18, 1, 'dsdadsa', '2025-11-14 15:16:01'),
(15, 15, 1, 'sdadad', '2025-11-14 16:20:50'),
(18, 14, 1, 'asdsad', '2025-11-14 16:31:59'),
(19, 14, 1, 'dsadsad', '2025-11-14 16:34:51'),
(20, 20, 1, 'sadasdasd', '2025-11-14 16:43:44'),
(22, 21, 1, 'sadsadsadssdsaddsadsadasdasdsadsdasd', '2025-11-14 16:44:43'),
(23, 21, 1, 'Me', '2025-11-14 16:46:47'),
(26, 21, 1, 'dsadadad', '2025-11-14 17:06:58'),
(28, 14, 1, 'hey', '2025-11-14 17:19:07'),
(29, 14, 1, 'pdf', '2025-11-14 17:19:20'),
(30, 14, 1, 'nc', '2025-11-14 17:19:34'),
(32, 14, 1, 'sdsada', '2025-11-14 17:25:09'),
(33, 14, 1, 'fdsada', '2025-11-14 17:26:12'),
(34, 14, 1, 'het', '2025-11-14 17:42:42');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `file_id` int(11) NOT NULL,
  `uploaded_by` int(11) NOT NULL,
  `activity_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `type` enum('system','activity','submission','feedback') DEFAULT 'system',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posting_teacher`
--

CREATE TABLE `posting_teacher` (
  `posting_id` int(10) UNSIGNED NOT NULL,
  `announcement_id` int(10) UNSIGNED NOT NULL,
  `asset_type` enum('PHOTO_VIDEO','FILE') NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` bigint(20) UNSIGNED DEFAULT 0,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posting_teacher`
--

INSERT INTO `posting_teacher` (`posting_id`, `announcement_id`, `asset_type`, `original_name`, `stored_name`, `file_path`, `mime_type`, `file_size`, `uploaded_at`) VALUES
(1, 23, 'PHOTO_VIDEO', '1v1.jpg', '1763110007419-1v1.jpg', 'uploads/announcements/1763110007419-1v1.jpg', 'image/jpeg', 136681, '2025-11-14 16:46:47'),
(4, 28, 'FILE', '1763110411519-WEEKLY_STATUS_REPORT_-_W8.docx', '1763111947767-1763110411519-WEEKLY_STATUS_REPORT_-_W8.docx', 'uploads/announcements/1763111947767-1763110411519-WEEKLY_STATUS_REPORT_-_W8.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 76544, '2025-11-14 17:19:07'),
(5, 29, 'FILE', 'PROPOSAL-ACCEPTANCE.pdf', '1763111960946-PROPOSAL-ACCEPTANCE.pdf', 'uploads/announcements/1763111960946-PROPOSAL-ACCEPTANCE.pdf', 'application/pdf', 155506, '2025-11-14 17:19:20'),
(6, 30, 'PHOTO_VIDEO', 'Pierre.png', '1763111974537-Pierre.png', 'uploads/announcements/1763111974537-Pierre.png', 'image/png', 893096, '2025-11-14 17:19:34'),
(8, 32, 'FILE', '1763110411519-WEEKLY_STATUS_REPORT_-_W8.docx', '1763112309283-1763110411519-WEEKLY_STATUS_REPORT_-_W8.docx', 'uploads/announcements/1763112309283-1763110411519-WEEKLY_STATUS_REPORT_-_W8.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 76544, '2025-11-14 17:25:09'),
(9, 32, 'FILE', '1763110411519-WEEKLY_STATUS_REPORT_-_W8 (1).docx', '1763112309284-1763110411519-WEEKLY_STATUS_REPORT_-_W8__1_.docx', 'uploads/announcements/1763112309284-1763110411519-WEEKLY_STATUS_REPORT_-_W8__1_.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 76544, '2025-11-14 17:25:09'),
(10, 32, 'FILE', 'WEEKLY STATUS REPORT - W4.pdf', '1763112309374-WEEKLY_STATUS_REPORT_-_W4.pdf', 'uploads/announcements/1763112309374-WEEKLY_STATUS_REPORT_-_W4.pdf', 'application/pdf', 153200, '2025-11-14 17:25:09'),
(11, 32, 'FILE', 'CipherQuest_CipherNomads.pdf', '1763112309381-CipherQuest_CipherNomads.pdf', 'uploads/announcements/1763112309381-CipherQuest_CipherNomads.pdf', 'application/pdf', 4142518, '2025-11-14 17:25:09'),
(12, 32, 'FILE', 'WEEKLY STATUS REPORT - W8.docx', '1763112309442-WEEKLY_STATUS_REPORT_-_W8.docx', 'uploads/announcements/1763112309442-WEEKLY_STATUS_REPORT_-_W8.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 76544, '2025-11-14 17:25:09'),
(13, 32, 'PHOTO_VIDEO', 'DSC_0218.JPG', '1763112309442-DSC_0218.JPG', 'uploads/announcements/1763112309442-DSC_0218.JPG', 'image/jpeg', 2527817, '2025-11-14 17:25:09'),
(14, 33, 'FILE', 'Thesis-GradingForm.xlsx', '1763112372402-Thesis-GradingForm.xlsx', 'uploads/announcements/1763112372402-Thesis-GradingForm.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 18549, '2025-11-14 17:26:12'),
(15, 34, 'PHOTO_VIDEO', 'ZAYN - Dusk Till Dawn (Official Video) ft. Sia - ZaynVEVO (360p, h264).mp4', '1763113362046-ZAYN_-_Dusk_Till_Dawn__Official_Video__ft._Sia_-_ZaynVEVO__360p__h264_.mp4', 'uploads/announcements/1763113362046-ZAYN_-_Dusk_Till_Dawn__Official_Video__ft._Sia_-_ZaynVEVO__360p__h264_.mp4', 'video/mp4', 15119148, '2025-11-14 17:42:42');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `description`) VALUES
(1, 'admin', NULL),
(2, 'instructor', NULL),
(3, 'student', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_subjects`
--

CREATE TABLE `student_subjects` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `joined_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `class_code` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `is_archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `instructor_id`, `title`, `description`, `class_code`, `created_at`, `is_archived`) VALUES
(10, 1, 'Shobe', 'testing', 'Y0KMPVBQCS', '2025-11-12 00:38:56', 1),
(11, 3, 'Ivell', '123', 'V0MTQSAQ40', '2025-11-12 02:47:50', 0),
(12, 3, 'Ivell', 'Testing', 'IHRSY5EY70', '2025-11-12 15:37:11', 0),
(13, 1, 'Gecontwo', '1', '7KF2KNRKR0', '2025-11-14 01:21:39', 1),
(14, 1, 'RKZ', '1223', 'ZHEEB404P4', '2025-11-14 01:22:49', 0),
(15, 1, '11', '11', '17GYFG0ZM0', '2025-11-14 14:20:59', 0),
(16, 1, 'Science', 'Gabas', 'P4G9SYXZLK', '2025-11-14 14:24:07', 0),
(17, 1, 'Math', 'sadad', 'EKGS2W9GJH', '2025-11-14 14:42:03', 0),
(18, 1, 'RKZ', 'dsadada', '5XO8POQQMS', '2025-11-14 15:15:38', 0),
(19, 1, 'Kenneth', 'eweqeqeqw', 'N8SBDB86CH', '2025-11-14 15:18:22', 0),
(20, 1, 'heyyy', '123', '4LMV855GYC', '2025-11-14 16:20:59', 0),
(21, 1, 'seb', '123', 'FZV6BX40KW', '2025-11-14 16:44:29', 0);

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `submission_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `submission_data` text DEFAULT NULL,
  `grade` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `role_id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 2, 'shobe', 'shobe@gmail.com', '$2b$10$uPneKGkXvMvlHBQHvQewV.dSvdPQZrbmDCwcXjYVWg/XygEJ7aTSa', '2025-10-28 05:43:52', '2025-10-28 05:43:52'),
(2, 3, 'sebastian', 'seb@gmail.com', '$2b$10$fDcrqN2o8D6jm1zg2G6WAOTru6zNmmCH7ye8HBtJ4xGBy.jlGMEVa', '2025-11-03 14:20:00', '2025-11-03 14:20:00'),
(3, 2, 'Ivell', 'ivell@gmail.com', '$2b$10$epPsxKICZV9buskzta74XuJ8A2Ib6N6883Orc9P0DjNx.5S7NOk82', '2025-11-11 20:41:56', '2025-11-11 23:26:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `instructor_id` (`instructor_id`);

--
-- Indexes for table `activity_items`
--
ALTER TABLE `activity_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `posting_teacher`
--
ALTER TABLE `posting_teacher`
  ADD PRIMARY KEY (`posting_id`),
  ADD KEY `announcement_id` (`announcement_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `student_subjects`
--
ALTER TABLE `student_subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `class_code` (`class_code`),
  ADD KEY `instructor_id` (`instructor_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`submission_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `activity_items`
--
ALTER TABLE `activity_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posting_teacher`
--
ALTER TABLE `posting_teacher`
  MODIFY `posting_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student_subjects`
--
ALTER TABLE `student_subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `fk_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_subject` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `activity_items`
--
ALTER TABLE `activity_items`
  ADD CONSTRAINT `activity_items_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `files_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `posting_teacher`
--
ALTER TABLE `posting_teacher`
  ADD CONSTRAINT `fk_posting_teacher_announcement` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`announcement_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_subjects`
--
ALTER TABLE `student_subjects`
  ADD CONSTRAINT `student_subjects_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
