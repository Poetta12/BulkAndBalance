import express from 'express'
import fs from 'fs'
import bodyParser from 'body-parser'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

const shoppingListFilePath = join(__dirname, '../BDD/shopping_list.json')

app.get('/json/shopping_list.json', (req, res) => {
  fs.readFile(shoppingListFilePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).send('Fichier non trouvé')
      } else {
        console.error('Erreur lors de la lecture du fichier:', err)
        res.status(500).send('Erreur de lecture du fichier')
      }
      return
    }
    res.json(JSON.parse(data))
  })
})

app.post('/api/add-to-shopping-list', (req, res) => {
  const { item } = req.body
  fs.readFile(shoppingListFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Erreur lors de la lecture du fichier:', err)
      res.status(500).send('Erreur de lecture du fichier')
      return
    }

    const shoppingList = data ? JSON.parse(data) : []
    const newItem = { ...item }

    // Ajouter le produit à la liste sans modifier les quantités
    shoppingList.push(newItem)

    fs.writeFile(shoppingListFilePath, JSON.stringify(shoppingList, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("Erreur lors de l'écriture du fichier:", err)
        res.status(500).send("Erreur d'écriture du fichier")
        return
      }
      res.send('Item ajouté avec succès')
    })
  })
})

app.post('/api/remove-from-shopping-list', (req, res) => {
  const { id } = req.body // Supposons que vous passez l'ID du produit à supprimer
  fs.readFile(shoppingListFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Erreur lors de la lecture du fichier:', err)
      res.status(500).send('Erreur de lecture du fichier')
      return
    }

    const shoppingList = data ? JSON.parse(data) : []
    const updatedList = shoppingList.filter((product) => product.id !== id)

    fs.writeFile(shoppingListFilePath, JSON.stringify(updatedList, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("Erreur lors de l'écriture du fichier:", err)
        res.status(500).send("Erreur d'écriture du fichier")
        return
      }
      res.send('Item supprimé avec succès')
    })
  })
})

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`)
})
