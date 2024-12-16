-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2024 at 07:25 AM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_biteclub`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_itemlist`
--

CREATE TABLE `tb_itemlist` (
  `itemId` mediumint(8) UNSIGNED NOT NULL,
  `itemOngoingReference` mediumint(8) UNSIGNED DEFAULT NULL,
  `itemMerchant` mediumint(8) UNSIGNED NOT NULL,
  `itemCategory` varchar(40) NOT NULL DEFAULT '',
  `itemName` varchar(100) NOT NULL DEFAULT '',
  `itemCode` varchar(40) NOT NULL DEFAULT '',
  `itemVariation` varchar(40) NOT NULL DEFAULT '',
  `itemDescription` varchar(1000) NOT NULL DEFAULT '',
  `itemInternalPrice` varchar(12) NOT NULL DEFAULT '0.00',
  `itemSvcCharge` varchar(12) NOT NULL DEFAULT '0.00',
  `itemBcPrice` varchar(12) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_itemlist`
--

INSERT INTO `tb_itemlist` (`itemId`, `itemOngoingReference`, `itemMerchant`, `itemCategory`, `itemName`, `itemCode`, `itemVariation`, `itemDescription`, `itemInternalPrice`, `itemSvcCharge`, `itemBcPrice`) VALUES
(1, 0, 1, 'Banh Mi', 'The Classic', 'CJR', 'Junior', 'Vietnamese ham, roast pork, pate, cucumber, pickled radish & carrots, mayo, hoisin sauce, and cilantro\r\n', '169.00', '31.00', '200.00'),
(2, 1, 1, 'Banh Mi', 'The Classic', 'CFULL', 'Full', 'Vietnamese ham, roast pork, pate, cucumber, pickled radish & carrots, mayo, hoisin sauce, and cilantro\r\n', '239.00', '31.00', '270.00'),
(3, 0, 4, 'Rice Meal', 'Sisig Rice', 'SISIG', 'n/a', 'with rice, sili, calamansi', '170.00', '30.00', '200.00'),
(4, 1, 4, 'Rice Meal', 'Beef Tapa', 'TAPA', 'n/a', 'with rice and vegetables', '170.00', '30.00', '200.00'),
(5, 0, 3, 'Fresh Juice', 'Dragonfruit', 'DRGN', 'Small 16oz', 'Iced fresh fruit juice', '79.00', '21.00', '100.00'),
(6, 1, 3, 'Fresh Juice', 'Dragonfruit', 'DRGN', 'Medium 22oz', 'Iced fresh fruit juice', '99.00', '31.00', '130.00');

-- --------------------------------------------------------

--
-- Table structure for table `tb_merchantlist`
--

CREATE TABLE `tb_merchantlist` (
  `merchantId` mediumint(8) UNSIGNED NOT NULL,
  `merchantOngoingReference` mediumint(8) UNSIGNED DEFAULT NULL,
  `merchantName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tb_merchantlist`
--

INSERT INTO `tb_merchantlist` (`merchantId`, `merchantOngoingReference`, `merchantName`) VALUES
(1, 0, 'Banh Mi Kitchen'),
(2, 1, 'Eagle Bites'),
(3, 2, 'Delsey\'s Juice'),
(4, 3, 'Buslo Sizzlingan');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_itemlist`
--
ALTER TABLE `tb_itemlist`
  ADD PRIMARY KEY (`itemId`),
  ADD KEY `item_key_merchant` (`itemMerchant`);

--
-- Indexes for table `tb_merchantlist`
--
ALTER TABLE `tb_merchantlist`
  ADD PRIMARY KEY (`merchantId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_itemlist`
--
ALTER TABLE `tb_itemlist`
  MODIFY `itemId` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tb_merchantlist`
--
ALTER TABLE `tb_merchantlist`
  MODIFY `merchantId` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_itemlist`
--
ALTER TABLE `tb_itemlist`
  ADD CONSTRAINT `item_key_merchant` FOREIGN KEY (`itemMerchant`) REFERENCES `tb_merchantlist` (`merchantId`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
