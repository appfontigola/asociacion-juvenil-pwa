# Asociación Juvenil App

Aplicación móvil para asociaciones juveniles desarrollada con React Native + Expo + TypeScript.

## 📱 Tecnologías

- **React Native** v0.74
- **Expo** SDK 51
- **TypeScript**
- **Firebase** (Auth, Firestore, Cloud Messaging)
- **React Navigation** (bottom tabs + native stack)
- **Zustand** (estado global)
- **AsyncStorage** (sesión local)

## 🏗️ Estructura del proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── ui/           # Botones, inputs, cards, etc.
│   ├── notices/      # Componentes de avisos
│   ├── calendar/     # Componentes de calendario
│   ├── local/        # Componentes de presencia local
│   └── admin/        # Componentes de administración
├── config/           # Configuración (Firebase)
├── constants/        # Tema, colores, roles
├── contexts/         # Contextos (Auth)
├── hooks/            # Hooks personalizados
├── navigation/       # Navegación
├── screens/          # Pantallas
│   ├── auth/         # Login
│   ├── home/         # Dashboard
│   ├── notices/      # CRUD avisos
│   ├── calendar/     # Eventos y asistencia
│   ├── local/        # Presencia en tiempo real
│   ├── profile/      # Perfil de usuario
│   └── admin/        # Panel administrador
├── services/         # Servicios Firebase
├── types/            # Tipos TypeScript
└── utils/            # Validadores y helpers
```

## 🔧 Requisitos

- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Cuenta de Firebase con proyecto activo
- Android Studio (para emulación Android) o Xcode (para iOS)

## 🚀 Instalación

### 1. Clonar e instalar dependencias

```bash
cd asociacion-juvenil
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto (o usa uno existente)
3. Activa **Authentication** > **Sign-in method** > **Email/Password**
4. Activa **Cloud Firestore** > Crear base de datos en modo de pruebas
5. Ve a **Configuración del proyecto** > **General** > **Tus apps** > Crear app web
6. Copia las credenciales y pégalas en `src/config/firebase.ts`

### 3. Configurar Firebase Cloud Messaging (notificaciones push)

1. En Firebase Console, ve a **Cloud Messaging**
2. Obtén la **Server Key** (para enviar notificaciones desde el backend)
3. Guarda la Server Key para usarla al enviar notificaciones desde el panel admin

### 4. Desplegar reglas de seguridad

Copia el contenido de `firestore.rules` en Firebase Console > Firestore > Reglas.

### 5. Iniciar la app

```bash
npx expo start
```

## 📲 Build para instalación manual

### Android (APK)

```bash
eas build -p android --profile preview
```

Esto generará un archivo APK que se puede distribuir e instalar manualmente.

### iOS (Archivo .ipa para instalación manual)

```bash
eas build -p ios --profile preview
```

> **Nota:** Para iOS necesitarás una cuenta de desarrollador de Apple ($99/año) para firmar el build.

## 👥 Roles

### Administrador
- Acceso al panel de administración
- Crear, editar y eliminar usuarios
- Crear, editar y eliminar avisos
- Crear, editar y eliminar actividades
- Enviar notificaciones push

### Usuario
- Ver avisos
- Ver calendario de actividades
- Confirmar asistencia a eventos
- Marcar presencia en el local
- Gestionar su perfil

## 🔐 Estructura Firestore

```
users/
  {uid}/
    email: string
    displayName: string
    role: "admin" | "user"
    active: boolean
    fcmToken?: string
    createdAt: timestamp
    updatedAt: timestamp

notices/
  {noticeId}/
    title: string
    description: string
    authorId: string
    authorName: string
    createdAt: timestamp
    updatedAt: timestamp

events/
  {eventId}/
    title: string
    description: string
    date: timestamp
    time: string
    location?: string
    authorId: string
    authorName: string
    createdAt: timestamp
    updatedAt: timestamp

attendance/
  {eventId_userId}/
    eventId: string
    userId: string
    userName: string
    status: "going" | "not_going" | "undecided"
    updatedAt: timestamp

localPresence/
  {userId}/
    userId: string
    userName: string
    entryTime: timestamp
    active: boolean
```

## 📋 Comandos útiles

```bash
npm start           # Iniciar Expo
npm run android     # Iniciar en Android
npm run ios         # Iniciar en iOS
npm run ts:check    # Verificar tipos TypeScript
```

## Notas importantes

- Los usuarios SOLO pueden ser creados por administradores desde el panel
- No hay registro público
- Las notificaciones push requieren la Server Key de Firebase Cloud Messaging
- La app mantiene la sesión iniciada mediante AsyncStorage
