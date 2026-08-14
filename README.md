# Overskull Productos — Frontend (Vue 3)

Frontend de la prueba técnica Full Stack: gestión de productos y categorías consumiendo la API en `laravel-api/`.

## Stack técnico

- Vue 3 (Composition API) + Vite
- Pinia (state management)
- Vue Router
- Tailwind CSS 4
- Axios (con interceptor global de errores)

## Requisitos previos

- Node.js >= 20
- npm >= 10
- El backend (`laravel-api`) corriendo y accesible (ver su README)

## Instalación local

```bash
npm install
cp .env.example .env
```

Edita `.env` si tu API corre en otra URL:

```
VITE_API_URL=http://localhost:8000/api
```

Levanta el servidor de desarrollo:

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

Build de producción:

```bash
npm run build
npm run preview
```

## Instalación con Docker

```bash
docker compose up -d --build
```

La app queda disponible en `http://localhost:5173` (servida vía Nginx, apuntando a `VITE_API_URL`, configurable como variable de entorno antes del build ya que Vite embebe las variables `VITE_*` en tiempo de compilación).

## Estructura del proyecto

```
vue-frontend/
├─ src/
│  ├─ components/   # AppLayout, ToastNotification, LoadingSpinner, ConfirmModal
│  ├─ views/        # DashboardView, ProductListView, ProductFormView, CategoryListView
│  ├─ stores/        # Pinia: products, categories, notifications
│  ├─ router/        # Vue Router
│  ├─ services/      # api.js (instancia Axios + interceptor), productService, categoryService
│  └─ utils/         # validators.js
├─ Dockerfile
├─ docker-compose.yml
└─ docker/nginx.conf
```

## Manejo de estados y errores

- Cada store de Pinia (`stores/products.js`, `stores/categories.js`) expone `items`, `loading` y `error`, actualizados en cada acción (`fetchAll`, `create`, `update`, `remove`).
- El interceptor de respuesta en `src/services/api.js` normaliza cualquier error (red, 4xx, 5xx) al formato `{ success: false, message, errors }` y dispara automáticamente un toast de error global mediante el store `notifications`.
- Las acciones de éxito (crear/actualizar/eliminar) muestran un toast de éxito con el `message` devuelto por el backend.
- Los formularios (`ProductFormView`, `CategoryListView`) validan en cliente antes de enviar (`src/utils/validators.js`: nombre requerido, precio numérico > 0, stock entero ≥ 0, categoría requerida) y también muestran los errores de validación devueltos por el backend (422) campo por campo.

## Vistas

1. **Dashboard** (`/`): resumen de totales (productos, categorías, stock, valor de inventario) y productos con bajo stock.
2. **Listado de productos** (`/products`): tabla con edición y eliminación (con modal de confirmación).
3. **Formulario de producto** (`/products/create`, `/products/:id/edit`): creación y edición con validaciones.
4. **Listado de categorías** (`/categories`): CRUD de categorías con formulario inline.

## Comandos útiles

```bash
npm run build      # build de producción, valida que todo el árbol de componentes compile
```
