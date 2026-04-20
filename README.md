
# Nexus Digital

## Módulo Programador Web | Tecnicatura Superior en Desarrollo Web y Aplicaciones Digitales

## Integrantes
- María Agustina Alonzo  
- Augusto Andrés Raffaeli  
- Yohana Eugenia Grosso  
- Griselda Leonor Aguirre  
- Scarlata María Soledad  



## Descripción
Nexus Digital es una plataforma de compra y venta de productos a nivel local en la provincia de Córdoba, inspirada en modelos como Mercado Libre.

Permite a los usuarios registrarse, publicar productos, explorar ofertas y realizar compras de manera simple, fomentando el comercio de proximidad.

## Problema que Resuelve
En la provincia de Córdoba, muchos emprendedores, comerciantes locales y particulares enfrentan dificultades para visibilizar sus productos en el entorno digital, lo que limita sus oportunidades de venta.

Además, existen obstáculos para concretar ventas de proximidad de forma organizada y generar confianza con potenciales compradores, debido a la falta de plataformas accesibles y orientadas específicamente al comercio local.



## Propuesta de Valor
Nexus Digital ofrece una solución accesible y centralizada para el comercio local en Córdoba, la plataforma facilita la visibilidad de productos, promueve las ventas de proximidad y mejora la confianza entre compradores y vendedores mediante un entorno digital simple, seguro y organizado.


## Tecnologías Utilizadas
- Frontend: Angular  
- Backend: Django Rest Framework  
- Base de Datos: MySQL  


## Instalación

### Requisitos previos
- Node.js y npm (para Angular)
- Python 3.x
- Django y Django REST Framework
- MySQL

### Backend (Django)
1. Clonar el repositorio:
git clone URL_DEL_REPO

2. Entrar al backend:
cd backend

3. Crear entorno virtual:
python -m venv venv

4. Activar entorno:
- Windows: venv\Scripts\activate  
- Linux/Mac: source venv/bin/activate

5. Instalar dependencias:
pip install -r requirements.txt

6. Ejecutar servidor:
python manage.py runserver



## Requerimientos Funcionales

### Registro e inicio de sesión de usuarios
El sistema permite registrarse ingresando datos personales y credenciales, y luego iniciar sesión.

### Gestión de productos
Permite crear, editar y eliminar productos con nombre, descripción, precio y stock.

### Búsqueda de productos
Permite buscar productos mediante palabras clave.

### Carrito de compras
Permite agregar productos y seleccionar cantidades.

### Confirmación de compra
Genera una orden de compra a partir del carrito.

### Historial de compras
Permite visualizar compras realizadas.


 
## Requerimiento no funcionales

### Seguridad
- Uso de HTTPS  
- Encriptación de contraseñas con PBKDF2 (Django)

### Usabilidad
- Interfaz responsive (Bootstrap)

### Mantenibilidad
- Separación entre frontend (Angular) y backend (Django REST Framework)
