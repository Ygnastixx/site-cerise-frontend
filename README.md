# 🍒 Site Cerise — Frontend (Vue 3 + Vite)

Interface web du projet Site Cerise, développée avec **Vue 3 (Composition API)**, **Pinia**, **Vue Router** et du **CSS Modulaire (Scoped)**.

---

## 🛠️ Préréquis \& Guide d'Installation

Si vous venez d'installer votre poste de travail, suivez ces étapes dans l'ordre.

### 1\. Installer Node.js

- Téléchargez et installez la version **LTS** de Node.js depuis [nodejs.org](https://nodejs.org/).
- Vérifiez l'installation dans votre terminal :

```bash
  node -v
  npm -v

```

---

### 2\. Cloner le Dépôt et Installer les Dépendances

```bash
# 1. Cloner le projet
git clone https://github.com/Ygnastixx/site-cerise-frontend.git
cd site-cerise-frontend

# 2. Installer les paquets npm (avec l'option de compatibilité)
npm install

```

---

### 3. Démarrer le Serveur de Développement

```bash
npm run dev

```

L'application sera accessible sur `http://localhost:5173`.

---

## 🎨 Charte Graphique \& Styles (CSS)

- **Variables de couleurs globales** : Définies dans `src/assets/main.css` :
- Vert ENI : `var(--color-eni-green)` (`#1B4D2E`)
- Rouge Cerise : `var(--color-cherry-red)` (`#C82323`)

- **Composants** : Écrivez votre CSS directement à l'intérieur de chaque composant Vue avec la balise `<style scoped>` :

```vue
<template>
  <button class="btn-primary">Mon Bouton</button>
</template>

<style scoped>
.btn-primary {
  background-color: var(--color-cherry-red);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
</style>
```

---

## 🌿 Git Workflow pour l'Équipe

Pour ne pas altérer la branche `main` :

1. Mettez à jour `main` :

```bash
git checkout main
git pull origin main

```

1. Créez votre propre branche de fonctionnalité :

```bash
git checkout -b feature/nom-de-votre-module

```

1. Effectuez vos commits et poussez votre branche :

```bash
git add .
git commit -m "feat(ui): ajout de la barre de navigation"
git push -u origin feature/nom-de-votre-module

```

1. Ouvrez une **Pull Request** sur GitHub pour révision.

---

### 3. Commandes pour faire le premier Push Git

Une fois le `README.md` sauvegardé, exécute cette suite de commandes dans ton terminal :

```bash
# 1. Ajouter tous les fichiers propres
git add .

# 2. Créer le commit
git commit -m "feat: initialisation du projet Vue 3, CSS natif et README d'installation"

# 3. Lier au dépôt distant (si pas encore fait)
git remote add origin https://github.com/votre-compte/site-cerise-frontend.git

# 4. Renommer la branche et pusher
git branch -M main
git push -u origin main

```
