const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

// Configuration pour lire les données du formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------------------------------------------------------
// 1. CONFIGURATION GMAIL
// ---------------------------------------------------------
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ncorp237@gmail.com',
        pass: 'uwuyitdhejknploo'
    }
});

// ---------------------------------------------------------
// 2. LE FORMULAIRE HTML (Interface Utilisateur)
// ---------------------------------------------------------
// Le fichier HTML est maintenant dans index.html

// ---------------------------------------------------------
// 3. ROUTES DU SERVEUR
// ---------------------------------------------------------

// Affiche le formulaire quand on va sur la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Traite l'envoi du formulaire
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    console.log(`📩 Nouveau message reçu de : ${name} (${email})`);

    const mailOptions = {
        // L'expéditeur DOIT être votre compte authentifié pour que Gmail accepte
        from: '"Server mail" <ncorp237@gmail.com>',

        // La destination (C'est ici que vous aviez oublié de changer l'adresse !)
        to: 'ncorp237@gmail.com',

        // C'est l'astuce : quand vous cliquez sur "Répondre", ça ira à l'email du visiteur
        replyTo: email,

        subject: `Nouveau contact de : ${name}`,
        text: `Vous avez reçu un message via votre formulaire ngrok :\n\nNom: ${name}\nEmail du visiteur: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erreur lors de l\'envoi:', error);
            res.send('<h1 style="color:red; text-align:center; margin-top:50px;">Erreur lors de l\'envoi de l\'email. Vérifiez la console du terminal.</h1><p><a href="/">Retour</a></p>');
        } else {
            console.log('Email envoyé : ' + info.response);
            res.send('<h1 style="color:green; text-align:center; margin-top:50px;">Message envoyé avec succès !</h1><p style="text-align:center;"><a href="/">Retour au formulaire</a></p>');
        }
    });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`🚀 Serveur démarré !`);
    console.log(`👉 Testez en local sur : http://localhost:${port}`);
    console.log(`👉 Pour Internet, lancez : ngrok http ${port}`);
});