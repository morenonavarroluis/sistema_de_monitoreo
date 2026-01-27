/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: config_ping
-- ------------------------------------------------------
-- Server version	10.6.22-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ip`
--

DROP TABLE IF EXISTS `ip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ip` (
  `id_ip` int(11) NOT NULL AUTO_INCREMENT,
  `ip` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `categoria` varchar(100) NOT NULL DEFAULT 'OTROS',
  PRIMARY KEY (`id_ip`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ip`
--

LOCK TABLES `ip` WRITE;
/*!40000 ALTER TABLE `ip` DISABLE KEYS */;
INSERT INTO `ip` VALUES (1,'10.20.0.42','DNS PRINCIPAL',' DNS PRINCIPAL'),(2,'10.20.0.37','DNS Estados',' DNS PRINCIPAL'),(3,'10.20.0.38','Proxy Master','PROXY'),(4,'10.20.0.41','Proxy Slave ','PROXY'),(5,'10.20.0.48','OpenVPN','PROXY'),(6,'192.168.0.21','Servidor RT','SERVICIO WEB'),(7,'192.168.0.15','NEW Servidor WEB','SERVICIO WEB'),(8,'192.168.0.5',' Intramercal ','SERVICIO WEB'),(9,'10.24.26.68',' Mersalud','SERVICIO WEB'),(10,'10.22.8.57',' Mercloud','SERVICIO WEB'),(11,'10.20.13.10',' Siga Reporte','SERVICIO SIGA'),(12,'10.20.1.161',' Siga Admi (socarras) ','SERVICIO SIGA'),(13,'10.24.26.124',' Siga WEB (MINPAL)','SERVICIO SIGA'),(14,'10.24.26.103',' Servidor Hatillo1','SERVIDORES HATILLO'),(15,'10.24.26.104',' Servidor Hatillo2','SERVIDORES HATILLO'),(16,'10.24.26.105',' Servidor Hatillo3','SERVIDORES HATILLO'),(17,'10.20.0.105',' Servidor Socarras1',' SERVIDORES SOCARRAS'),(18,'10.20.0.107',' Servidor Socarras2',' SERVIDORES SOCARRAS'),(19,'10.20.0.108',' Servidor Socarras3',' SERVIDORES SOCARRAS'),(20,'10.20.0.109','Servidor Socarras4 ',' SERVIDORES SOCARRAS'),(21,'10.24.194.1','L2L Principal Socarras ','ENLACE PRINCIPAL SEDE'),(22,'10.20.35.4',' LAN Socarras','ENLACE PRINCIPAL SEDE'),(23,'10.20.8.12','Tacacs','ENLACE PRINCIPAL SEDE'),(24,'10.24.194.132','L2L Centro Plaza','ENLACE PRINCIPAL SEDE'),(25,'10.24.31.4','LAN Centro Plaza','ENLACE PRINCIPAL SEDE'),(26,'10.24.194.131',' L2L Fundaciones','ENLACE PRINCIPAL SEDE'),(27,'10.22.2.5','LAN Fundaciones','ENLACE PRINCIPAL SEDE'),(28,'10.22.2.1','Sw CD Fundaciones','ENLACE PRINCIPAL SEDE'),(29,'10.24.225.1','Metro Hatillo','ENLACE PRINCIPAL SEDE'),(30,'10.24.28.4','LAN Metro Hatillo','ENLACE PRINCIPAL SEDE'),(31,'190.202.85.33','Internet Metro','ENLACE PRINCIPAL SEDE'),(32,'186.24.13.1','L2L Internet Movistar','ENLACE PRINCIPAL SEDE'),(33,'10.20.4.10','FortiGate','ENLACE PRINCIPAL SEDE'),(34,'10.24.26.210','ASA Hatillo','ENLACE PRINCIPAL SEDE'),(35,'10.22.8.104','SERVIDORES MINPPAL','SERVIDORES MINPPAL'),(36,'10.22.8.105','SERVIDORES MINPPAL','SERVIDORES MINPPAL'),(37,'10.22.8.106','SERVIDORES MINPPAL','SERVIDORES MINPPAL'),(38,'10.22.8.107','SERVIDORES MINPPAL','SERVIDORES MINPPAL'),(39,'10.22.8.108','SERVIDORES MINPPAL','SERVIDORES MINPPAL'),(40,'10.22.8.109','SERVIDORES MINPPAL','SERVIDORES MINPPAL'),(41,'10.22.8.114','SERVIDORES MINPPAL','SERVIDORES MINPPAL');
/*!40000 ALTER TABLE `ip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_usuarios_email` (`email`),
  KEY `ix_usuarios_id` (`id`),
  KEY `ix_usuarios_password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan Perez','manuel@gmail.com','123456'),(2,'manuel navarro','moreno@gmail.com','987456');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-27 15:29:44
