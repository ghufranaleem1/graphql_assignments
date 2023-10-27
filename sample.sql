-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 27, 2023 at 06:40 AM
-- Server version: 8.0.31
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sample`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `addrNo` int NOT NULL AUTO_INCREMENT,
  `addrLine1` varchar(255) DEFAULT NULL,
  `addrLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`addrNo`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`addrNo`, `addrLine1`, `addrLine2`, `city`, `postcode`, `country`) VALUES
(1, '123 Main St', 'Apt 4B', 'New York', '10001', 'USA');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `custID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `landLine` varchar(15) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `addressNo` int DEFAULT NULL,
  PRIMARY KEY (`custID`),
  KEY `addressNo` (`addressNo`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`custID`, `firstName`, `lastName`, `gender`, `email`, `landLine`, `mobile`, `addressNo`) VALUES
(1, 'John', 'Doe', 'Male', 'john.doe@example.com', '123-456-7890', '987-654-3210', 1);

-- --------------------------------------------------------

--
-- Table structure for table `customer_orders`
--

DROP TABLE IF EXISTS `customer_orders`;
CREATE TABLE IF NOT EXISTS `customer_orders` (
  `ordID` int NOT NULL AUTO_INCREMENT,
  `dateOrdered` date DEFAULT NULL,
  `orderedQty` int DEFAULT NULL,
  `customerID` int DEFAULT NULL,
  `productID` int DEFAULT NULL,
  PRIMARY KEY (`ordID`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customer_orders`
--

INSERT INTO `customer_orders` (`ordID`, `dateOrdered`, `orderedQty`, `customerID`, `productID`) VALUES
(1, '2023-10-26', 5, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `pId` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `unitPrice` decimal(10,2) DEFAULT NULL,
  `availableQty` int DEFAULT NULL,
  PRIMARY KEY (`pId`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`pId`, `description`, `unitPrice`, `availableQty`) VALUES
(1, 'Product 1', '9.99', 400);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
