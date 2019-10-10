-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: 03-Out-2019 às 14:42
-- Versão do servidor: 5.7.24
-- versão do PHP: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `readnow`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `books`
--

CREATE TABLE `books` (
  `book_id` int(100) NOT NULL,
  `user_id` int(100) DEFAULT NULL,
  `genre` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `title` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `author` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `publisher` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `edition` int(100) NOT NULL,
  `isbn` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `pages` int(100) NOT NULL,
  `date_issued` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `books_request`
--

CREATE TABLE `books_request` (
  `request_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `genre` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `title` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `author` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `edition` int(10) NOT NULL,
  `isbn` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `e-books`
--

CREATE TABLE `e-books` (
  `e-books_id` int(100) NOT NULL,
  `user_id` int(100) DEFAULT NULL,
  `genre` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `title` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `author` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `publisher` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `edition` int(100) NOT NULL,
  `isbn` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `pages` int(100) NOT NULL,
  `readed_data` datetime DEFAULT NULL,
  `file` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `e-books_request`
--

CREATE TABLE `e-books_request` (
  `request_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `genre` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `title` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `author` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `edition` int(10) NOT NULL,
  `isbn` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `issue_date`
--

CREATE TABLE `issue_date` (
  `issue_id` int(10) NOT NULL,
  `book_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `read_data`
--

CREATE TABLE `read_data` (
  `read_id` int(10) NOT NULL,
  `e-books_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `user_id` int(100) NOT NULL,
  `name` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `phone` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `email` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `is_admin` tinyint(4) NOT NULL,
  `password` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `address` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `gender` varchar(300) COLLATE latin1_general_ci NOT NULL,
  `nip` int(255) NOT NULL,
  `patent` varchar(300) COLLATE latin1_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `e-books_request`
--
ALTER TABLE `e-books_request`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `issue_date`
--
ALTER TABLE `issue_date`
  ADD PRIMARY KEY (`issue_id`);

--
-- Indexes for table `read_data`
--
ALTER TABLE `read_data`
  ADD PRIMARY KEY (`read_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `e-books_request`
--
ALTER TABLE `e-books_request`
  MODIFY `request_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `issue_date`
--
ALTER TABLE `issue_date`
  MODIFY `issue_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `read_data`
--
ALTER TABLE `read_data`
  MODIFY `read_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(100) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
