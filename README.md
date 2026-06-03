
# Nexus Digital

## Módulo Programador Web | Tecnicatura Superior en Desarrollo Web y Aplicaciones Digitales

## Integrantes
- Juan Ignacio Alonso (Scrum Master)
- Griselda Leonor Aguirre (Developer) 
- Augusto Andrés Raffaeli (Developer) 
- Yohana Eugenia Grosso (Developer)
- María Soledad Scarlata (Developer)




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

### Frontend (Angular)

1. Ingresar a carpet Frontend
cd frontend

2. Instalar dependencias
npm install

3. Ejecutar aplicación
ng serve

4. Abrir en navegador
http://localhost:4200



## Uso
La plataforma permite a los usuarios:
- Registrarse e iniciar sesión  
- Publicar productos  
- Buscar productos  
- Agregar productos al carrito  
- Realizar compras  
- Ver historial de compras


## Requerimientos Funcionales

| Código | Requisito Funcional |
|--------|--------------------|
| RF01 | El sistema debe permitir a los usuarios registrarse ingresando sus datos personales y credenciales, así como iniciar sesión para acceder a su cuenta. |
| RF02 | El sistema debe permitir a los usuarios crear, editar y eliminar productos, ingresando nombre, descripción, precio y stock. |
| RF03 | El sistema debe permitir a los usuarios buscar productos por nombre y aplicar filtros por palabra clave. |
| RF04 | El sistema debe permitir a los usuarios agregar productos al carrito, modificar cantidades y eliminar productos previamente agregados. |
| RF05 | El sistema debe permitir a los usuarios confirmar la compra de los productos del carrito, generando una orden de compra. |
| RF06 | El sistema debe permitir a los usuarios visualizar el historial de compras realizadas. |
| RF07 | El sistema debe permitir a los usuarios visualizar el detalle de cada producto, incluyendo descripción, precio y disponibilidad. |
| RF08 | El sistema debe permitir a los usuarios visualizar un resumen del carrito con el total de la compra antes de confirmarla. |

---

## Requerimientos No Funcionales

| Código | Requisito No Funcional |
|--------|------------------------|
| RNF01 | El sistema debe ser responsive, garantizando su correcto funcionamiento en dispositivos móviles, tablets y computadoras. |
| RNF02 | El sistema debe garantizar la seguridad de los datos personales mediante el uso de cifrado de contraseñas y buenas prácticas de seguridad. |
| RNF03 | El sistema debe estar estructurado de forma modular y organizada, facilitando su mantenimiento, escalabilidad y futuras actualizaciones. |
| RNF04 | El sistema debe ofrecer una interfaz intuitiva y fácil de usar, permitiendo a los usuarios navegar y realizar acciones sin dificultad. |
| RNF05 | El sistema debe responder a las solicitudes del usuario en un tiempo adecuado, garantizando una experiencia fluida. |



## Documentación

[Wiki del Proyecto](https://github.com/Nexus-Proyecto/Nexus-Digital/wiki/Documentaci%C3%B3n-y-Enlaces)

---

> Documento elaborado bajo metodología ágil (Scrum).  
> Proyecto académico — Instituto Superior Politécnico Córdoba (ISPC) — Cohorte 2025.
