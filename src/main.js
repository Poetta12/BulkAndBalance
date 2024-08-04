import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css' // Importation des styles de toastification
import './assets/styles.css' // Importation de vos styles personnalisés
import './assets/main.css'
import './assets/base.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Configuration de vue-toastification
app.use(Toast, {
  position: POSITION.TOP_CENTER,
  timeout: 3000,
  hideProgressBar: false,
  toastClassName: 'toast-custom', // Classe personnalisée globale
  progressClassName: 'toast-progress', // Classe personnalisée pour la barre de progression
  successClassName: 'toast-success', // Classe personnalisée pour les succès
  errorClassName: 'toast-error', // Classe personnalisée pour les erreurs
  infoClassName: 'toast-info' // Classe personnalisée pour les informations
})

app.mount('#app')
