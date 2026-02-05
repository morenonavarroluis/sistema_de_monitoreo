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
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  KEY `ix_categoria_id_categoria` (`id_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clearport`
--

DROP TABLE IF EXISTS `clearport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `clearport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_port` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `user_ip` varchar(100) NOT NULL,
  `pass_ip` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_clearport_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clearport`
--

LOCK TABLES `clearport` WRITE;
/*!40000 ALTER TABLE `clearport` DISABLE KEYS */;
INSERT INTO `clearport` VALUES (1,'10.20.100.41','SW-PB-FINANZA','Gvaldiris','Gv27039414*','Cisco'),(2,'10.20.100.32','SW-PB-SVMEDICO','Gvaldiris','Gv27039414*','Cisco'),(3,'10.20.100.30','SW-PB-CTINGRESO1','Gvaldiris','Gv27039414*','Cisco'),(4,'10.20.100.31','SW-PB-CTINGRESO2','Gvaldiris','Gv27039414*','Cisco'),(5,'10.20.100.29\r\n','SW-PB-INSUMOS','Gvaldiris','Gv27039414*','Cisco'),(6,'10.20.100.28','SW-PB-JURIDICA1','Gvaldiris','Gv27039414*','Cisco'),(7,'10.20.100.27\r\n','SW-PB-JURIDICA2','Gvaldiris','Gv27039414*','Cisco'),(8,'10.20.100.26','SW-PB-ATCIUDADANO','Gvaldiris','Gv27039414*','Cisco'),(9,'10.20.100.25','SW-P1/2-TECNOGLOGIA','Gvaldiris','Gv27039414*','Cisco'),(10,'10.20.100.52','SW-P2.1/2-INSPECTORIA','M3rc@l ','R3DM3RC@L22','Cisco'),(11,'10.20.100.20','SW-PB-BIENES','Gvaldiris','Gv27039414*','Cisco'),(12,'10.20.100.40','SW-P2-SOPORTE','Gvaldiris','Gv27039414*','Cisco'),(13,'10.20.100.36','SW-P2-PRESUPUESTO','Gvaldiris','Gv27039414*','Cisco'),(14,'10.20.100.35','SW-P2-CONTABILIDAD','Gvaldiris','Gv27039414*','Cisco'),(15,'10.20.100.34','SW-P2-CONTABILIDAD2','Gvaldiris','Gv27039414*','Cisco'),(16,'10.20.100.50','SW-P3-COMPRAS','Gvaldiris','Gv27039414*','Cisco'),(17,'10.20.100.51','SW-P3-MERCADEO','Gvaldiris','Gv27039414*','Cisco'),(18,'10.20.100.49','SW-P3-COMERCIALIZACION','Gvaldiris','Gv27039414*','Cisco'),(19,'10.20.100.47','SW-P3.1/2-PRESIDENCIA','Gvaldiris','Gv27039414*','Cisco'),(20,'10.20.100.57','SW-P4-CTDCALIDAD','Gvaldiris','Gv27039414*','Cisco'),(21,'10.20.100.56','SW-P4-INFRAESTRUCTURA','Gvaldiris','Gv27039414*','Cisco'),(22,'10.20.100.54','SW-P4-INFRAESTRUCTURA2','M3rc@l','R3DM3RC@L22','Cisco'),(23,'10.20.100.33','SW-C5-SALA','Gvaldiris','Gv27039414*','Cisco'),(24,'10.20.100.55','SW-P4-CARNESVNZL','Gvaldiris','Gv27039414*','Cisco'),(25,'10.20.100.48','SW-P3.1/2-UNINVESTIGACIONES','Gvaldiris','Gv27039414*','Cisco'),(26,'10.20.100.58','SW-P5-GSINTITUCIONAL','Gvaldiris','Gv27039414*','Cisco'),(27,'10.20.100.62','SW-P6-LOGISTICA','Gvaldiris','Gv27039414*','Cisco'),(28,'10.20.100.61','SW-P6-LGDISTRIBUCION','Gvaldiris','Gv27039414*','Cisco'),(29,'10.20.100.63','SW-P6-LGDISTRIBUCION2','Gvaldiris','Gv27039414*','Cisco'),(30,'10.20.100.66','SW-P8-AUDITORIA1','Gvaldiris','Gv27039414*','Cisco'),(31,'10.20.100.65','SW-P8-AUDITORIA2','Gvaldiris','Gv27039414*','Cisco'),(32,'10.20.100.67','SW-P8-AUDITORIA3','Gvaldiris','Gv27039414*','Cisco'),(33,'10.20.100.69','SW-P9-GSCOMUNICACIONAL','Gvaldiris','Gv27039414*','Cisco'),(34,'10.20.100.70','SW-P9-COMUNICACIONAL2','Gvaldiris','Gv27039414*','Cisco'),(35,'10.20.100.71','SW-P9-CONTRATACIONES','Gvaldiris','Gv27039414*','Cisco'),(36,'10.20.100.77','SW-P10-GSALUD','Gvaldiris','Gv27039414*','Cisco'),(37,'10.20.100.72','SW-P10-GESSOCIALISTA','Gvaldiris','Gv27039414*','Cisco'),(38,'10.20.100.73','SW-P11-GSHUMANA2','Gvaldiris','Gv27039414*','Cisco'),(39,'10.20.100.76','SW-P11-GSHUMANA','Gvaldiris','Gv27039414*','Cisco'),(40,'10.20.100.74','SW-P12-PRESIDENCIA','Gvaldiris','Gv27039414*','Cisco'),(41,'10.20.100.21','SW-PB-OPERACIONES','M3rc@l','R3DM3RC@L22','Cisco'),(42,'10.20.100.12','SW-P5-PROYECTO','M3rc@l','R3DM3RC@L22','Cisco'),(43,'10.30.2.8','SW2_HUAWEI','M3rc@l','R3DM3RC@L22','HUAWEI'),(44,'10.30.2.7','SW1_CISCO','Gvaldiris','Gv27039414*','Cisco');
/*!40000 ALTER TABLE `clearport` ENABLE KEYS */;
UNLOCK TABLES;

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
  `id_categoria` varchar(100) NOT NULL DEFAULT 'OTROS',
  PRIMARY KEY (`id_ip`),
  KEY `id_categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ip`
--

LOCK TABLES `ip` WRITE;
/*!40000 ALTER TABLE `ip` DISABLE KEYS */;
INSERT INTO `ip` VALUES (1,'10.20.0.42','DNS PRINCIPAL','1'),(2,'10.20.0.37','DNS Estados','1'),(3,'10.20.0.38','Proxy Master','2'),(4,'10.20.0.41','Proxy Slave ','2'),(5,'10.20.0.48','OpenVPN','2'),(6,'192.168.0.21','Servidor RT','3'),(7,'192.168.0.15','NEW Servidor WEB','3'),(8,'192.168.0.5',' Intramercal ','3'),(9,'10.24.26.68',' Mersalud','3'),(10,'10.22.8.57',' Mercloud','3'),(11,'10.20.13.10',' Siga Reporte','4'),(12,'10.20.1.161',' Siga Admi (socarras) ','4'),(13,'10.24.26.124',' Siga WEB (MINPAL)','4'),(14,'10.24.26.103',' Servidor Hatillo1','5'),(15,'10.24.26.104',' Servidor Hatillo2','5'),(16,'10.24.26.105',' Servidor Hatillo3','5'),(17,'10.20.0.105',' Servidor Socarras1','6'),(18,'10.20.0.107',' Servidor Socarras2','6'),(19,'10.20.0.108',' Servidor Socarras3','6'),(20,'10.20.0.109','Servidor Socarras4 ','6'),(21,'10.24.194.1','L2L Principal Socarras ','7'),(22,'10.20.35.4',' LAN Socarras','7'),(23,'10.20.8.12','Tacacs','7'),(24,'10.24.194.132','L2L Centro Plaza','7'),(25,'10.24.31.4','LAN Centro Plaza','7'),(26,'10.24.194.131',' L2L Fundaciones','7'),(27,'10.22.2.5','LAN Fundaciones','7'),(28,'10.22.2.1','Sw CD Fundaciones','7'),(29,'10.24.225.1','Metro Hatillo','7'),(30,'10.24.28.4','LAN Metro Hatillo','7'),(31,'190.202.85.33','Internet Metro','7'),(32,'186.24.13.1','L2L Internet Movistar','7'),(33,'10.20.4.10','FortiGate','7'),(34,'10.24.26.210','ASA Hatillo','7'),(35,'10.22.8.104','SERVIDORES MINPPAL','8'),(36,'10.22.8.105','SERVIDORES MINPPAL','8'),(37,'10.22.8.106','SERVIDORES MINPPAL','8'),(38,'10.22.8.107','SERVIDORES MINPPAL','8'),(39,'10.22.8.108','SERVIDORES MINPPAL','8'),(40,'10.22.8.109','SERVIDORES MINPPAL','8'),(41,'10.22.8.114','SERVIDORES MINPPAL','8');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Juan Perez','manuel@gmail.com','123456'),(2,'manuel navarro','moreno@gmail.com','987456'),(4,'Juan marcano','pancho@gmail.com','123456'),(5,'manuel','test@test.com','123456');
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

-- Dump completed on 2026-02-05 14:38:33
