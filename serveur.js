const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer((req, res) => {
    // Gérer la requête pour la page HTML
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Erreur du serveur');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // Gérer la requête pour le fichier CSS dans le dossier "css"
    else if (req.url === '/css/styles.css') {
        fs.readFile(path.join(__dirname, 'css', 'styles.css'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Erreur du serveur');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    }
    // Gérer les requêtes pour les images (jpg, jpeg, png, gif)
    else if (req.url.startsWith('/images/')) {
        const filePath = path.join(__dirname, req.url);
        const extname = path.extname(filePath).toLowerCase();

        // Déterminer le type de contenu en fonction de l'extension du fichier
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.jfif': 'image/jfif',
            '.gif': 'image/gif'
        };
        
        const contentType = mimeTypes[extname];

        // Lire et servir le fichier image si l'extension est prise en charge
        if (contentType) {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Erreur du serveur');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end('Type de fichier non pris en charge');
        }
    }
    // Gérer les autres requêtes
    else {
        res.writeHead(404);
        res.end('Page non trouvée');
    }
});

server.listen(port, () => {
    console.log(`Le serveur est lancé sur http://localhost:${port}`);
});
