CREATE DATABASE nexus_digital;
USE nexus_digital;

-- =========================
-- TABLA USUARIO
-- =========================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    rol ENUM(
        'administrador',
        'vendedor',
        'comprador'
    ) NOT NULL
);

-- =========================
-- TABLA PRODUCTO
-- =========================
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,

    id_usuario INT,

    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
);

-- =========================
-- TABLA CARRITO
-- =========================
CREATE TABLE carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,

    estado ENUM(
        'activo',
        'pendiente',
        'abandonado'
    ) DEFAULT 'activo',

    id_usuario INT NOT NULL,

    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
);

-- =========================
-- TABLA DETALLE_CARRITO
-- =========================
CREATE TABLE detalle_carrito (
    id_item INT AUTO_INCREMENT PRIMARY KEY,

    cantidad INT NOT NULL,

    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,

    FOREIGN KEY (id_carrito)
    REFERENCES carrito(id_carrito),

    FOREIGN KEY (id_producto)
    REFERENCES producto(id_producto),

    UNIQUE(id_carrito, id_producto)
);

-- =========================
-- TABLA ORDEN_COMPRA
-- =========================
CREATE TABLE orden_compra (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,

    fecha DATETIME NOT NULL,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,

    id_usuario INT NOT NULL,

    FOREIGN KEY (id_usuario)
    REFERENCES usuario(id_usuario)
);

-- =========================
-- TABLA DETALLE_ORDEN
-- =========================
CREATE TABLE detalle_orden (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,

    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,

    id_orden INT NOT NULL,
    id_producto INT,

    FOREIGN KEY (id_orden)
    REFERENCES orden_compra(id_orden),

    FOREIGN KEY (id_producto)
    REFERENCES producto(id_producto)
);