CREATE DATABASE Agua_Litoral_Inventory;
DROP DATABASE Agua_Litoral_Inventory;
USE Agua_Litoral_Inventory;

DROP TABLE IF EXISTS `type_user`;
CREATE TABLE `type_user` (
	`ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ROLE` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`ID`)
)DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` ( 
	`ID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `EMAIL` VARCHAR(320) NOT NULL,
    `USERNAME` VARCHAR(64) NOT NULL,
    `PASSWORD` VARCHAR(60) NOT NULL,
    `CREATED_AT` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `TYPE_USER_ID` INT(10) UNSIGNED NOT NULL,
    `CONNECTED` TINYINT(1) UNSIGNED NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE KEY (`EMAIL`),
    UNIQUE KEY (`USERNAME`),
    CONSTRAINT FK_TYPE_USER FOREIGN KEY (`TYPE_USER_ID`) REFERENCES `type_user` (`ID`)
)DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `type_employees`;
CREATE TABLE `type_employees`(
	`ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `JOB_POSITION` VARCHAR(64) NOT NULL UNIQUE,
    PRIMARY KEY (`ID`)
)DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `ID` INT(10) unsigned NOT NULL AUTO_INCREMENT,
  `FIRST_NAME` VARCHAR(50) NOT NULL,
  `LAST_NAME` VARCHAR(50) NOT NULL,
  `ID_CARD` VARCHAR(13) NOT NULL,
  `ADDRESS` VARCHAR(50) NOT NULL,
  `PHONE` VARCHAR(20) NOT NULL,
  `SALARY` INT(10) UNSIGNED NOT NULL,
  `ID_USER` INT UNSIGNED NOT NULL,
  `STATUS` VARCHAR(24) NOT NULL,
  `ADMISSION` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TYPE_EMPLOYEE` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `IDENTIFICATION_CARD` (`ID_CARD`),
  UNIQUE KEY `ID_USER_EMPLOYEE` (`ID_USER`),
  KEY `I_FIRTS_NAME` (`FIRST_NAME`),
  KEY `I_LAST_NAME` (`LAST_NAME`),
  CONSTRAINT FK_TYPE_ROLE_EMPLOYEE FOREIGN KEY (`TYPE_EMPLOYEE`) REFERENCES `type_employees` (`ID`),
  CONSTRAINT FK_USER_EMPLOYEE FOREIGN KEY (`ID_USER`) REFERENCES `users` (`ID`)
)DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(30) NOT NULL,
  `ADDRESS` VARCHAR(50) DEFAULT NULL,
  `PHONE` VARCHAR(20) DEFAULT NULL,
  `STATUS` TINYINT(1) NOT NULL,
  `CREATED_AT` TIMESTAMP NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `I_NAME` (`NAME`),
  UNIQUE KEY `I_PHONE` (`PHONE`)
)DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `detalle_factura`;
CREATE TABLE `detalle_factura` (
  `ID_FACTURA` VARCHAR(15) NOT NULL,
  `CONCEPTO` VARCHAR(100) NOT NULL,
  `CANTIDAD` DOUBLE(12,2) NOT NULL,
  `PRECIO` DOUBLE(12,2) unsigned NOT NULL,
  `IMPORTE` DOUBLE(12,2) unsigned NOT NULL,
  KEY `I_PRECIO` (`PRECIO`)
) DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `factura`;
CREATE TABLE `factura` (
  `ID` VARCHAR(15) NOT NULL,
  `FECHA` DATETIME NOT NULL,
  `NOMBRE_CLIENTE` VARCHAR(50) DEFAULT NULL,
  `DIRECCION` VARCHAR(100) DEFAULT NULL,
  `COMPROBANTE` VARCHAR(50) DEFAULT NULL,
  `TOTAL` DOUBLE(12,2) unsigned NOT NULL,
  `EMPLEADO` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `I_FECHA` (`FECHA`),
  KEY `I_NOMBRE_CLIENTE` (`NOMBRE_CLIENTE`)
) DEFAULT CHARSET=latin1;


CREATE TABLE `inventario` (
  `ID` INT(11) NOT NULL AUTO_INCREMENT,
  `CONCEPTO` VARCHAR(100) NOT NULL,
  `UNIDAD` VARCHAR(20) NOT NULL,
  `CANTIDAD` DOUBLE(12,2) unsigned NOT NULL,
  `COMPRA` DOUBLE(12,2) unsigned NOT NULL,
  `VENTA` DOUBLE(12,2) unsigned NOT NULL,
  `STOCK` DOUBLE(12,2) unsigned DEFAULT NULL,
  `INGRESO` TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `I_CONCEPTO` (`CONCEPTO`),
  KEY `I_INGRESO` (`INGRESO`)
) AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;