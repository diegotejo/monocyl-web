# Guía Paso a Paso: Cómo Subir un Nuevo Boletín a la Web

Esta guía está diseñada para que cualquier persona, sin importar su experiencia en informática, pueda actualizar los boletines de la web de MONOCYL fácilmente.

---

## 🛠️ Herramientas que vas a necesitar

1. **Un Editor de Texto Mínimo:**
   - Puedes usar el **Bloc de Notas** (ya instalado en Windows) o TextEdit (en Mac).
   - *(Recomendación pro)*: Descargar un programa gratuito llamado **Visual Studio Code**. Es como el Bloc de Notas pero colorea las palabras, lo que hace casi imposible equivocarse.
2. **Acceso a tu Servidor Web:**
   - Normalmente, quien te aloje la web (el "hosting") te dará una página web con un **Administrador de Archivos** (suele llamarse cPanel o Plesk).
   - Opcionalmente, un programa llamado **FileZilla** si te dan claves de acceso por "FTP".

---

## 📝 El Menú Secreto: `newsletters.json`

Toda la magia de los boletines se guarda en un único archivo de texto llamado `newsletters.json` que está dentro de la carpeta `data`. 

Ese archivo es simplemente una lista de "bloques". Cada bloque es un boletín.

### Anatomía de un boletín

Un boletín por dentro se ve exactamente así (¡no te asustes por las llaves y comillas!):

```json
  {
    "id": 4,
    "title": "Título del Boletín",
    "date": "2026-05-12",
    "excerpt": "Una frase corta que resume qué hay en el boletín.",
    "link": "enlace_al_pdf_o_pagina.com",
    "coverImage": ""
  }
```

---

## 🚀 Pasos para subir un nuevo Boletín

### Paso 1: Preparar tu enlace
Primero, necesitas saber dónde está el PDF de tu boletín. Puede estar alojado en Google Drive o puedes subirlo a una carpeta dentro de la web (por ejemplo, crear una carpeta `pdfs/` y subirlo ahí con tu hosting). 
Tendrás que copiar ese enlace.

### Paso 2: Abrir el archivo
1. Entra al administrador de archivos de tu web (Hosting).
2. Ve a la carpeta `data`.
3. Haz doble clic en `newsletters.json` para editarlo (o descárgalo, edítalo en tu ordenador y vuélvelo a subir).

### Paso 3: Copiar y pegar un bloque
1. Ve al final del archivo, justo al **último** boletín de la lista.
2. Añade una **coma `,`** justo después de la llave `}` del último boletín. *(¡Este es el paso donde la gente más suele fallar! La coma le dice al sistema "hey, viene un boletín más").*
3. Pega la plantilla debajo.

**Ejemplo de cómo tiene que quedar:**

```json
[
  {
    "id": 1,
    "title": "Boletín Viejo",
    "date": "2026-01-10",
    "excerpt": "Resumen viejo...",
    "link": "enlace1.com",
    "coverImage": ""
  }, <!-- ¡NO OLVIDES ESTA COMA! -->
  {
    "id": 2,
    "title": "Mi NUEVO Boletín",
    "date": "2026-04-10",
    "excerpt": "¡Este es el nuevo boletín de abril!",
    "link": "enlace_nuevo.com",
    "coverImage": ""
  }
]
```

### Paso 4: Rellenar tus datos
Cambia el texto que está **dentro de las comillas** en tu nuevo bloque:
- `"id"`: Pon el número siguiente (si el último era 3, pon 4). *Nota: el id no lleva comillas.*
- `"title"`: El título que quieres que se vea.
- `"date"`: La fecha en formato `AÑO-MES-DIA` (ejemplo: `2026-04-10`).
- `"excerpt"`: Un resumen cortito.
- `"link"`: Pega el enlace de tu PDF aquí.
- `"coverImage"`: Puedes dejar las comillas vacías `""` y saldrá una foto por defecto, o pegar el enlace de una foto bonita.

### Paso 5: Guardar ✨
Dale a guardar en tu editor. ¡Y ya está! Si recargas la web principal, el nuevo boletín aparecerá mágicamente el primero o último (dependiendo de cómo lo ordenemos).

---

## ⚠️ Errores comunes (Tus salvavidas)
- **"La web se ha quedado en blanco" o "No cargan los boletines"**: Lo más probable es que se te haya olvidado poner una **coma `,`** entre el penúltimo bloque y tu nuevo bloque, o que hayas borrado una comilla `"` sin querer. Vuelve al archivo y revisa.
- **"No funciona el enlace"**: Asegúrate de que el enlace en el `"link"` empieza por `http://` o `https://` si es una página externa.
