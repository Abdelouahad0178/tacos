// Importer les modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdp0QPxkC2TSpd5zVComDmxNOlZy5jSt0",
    authDomain: "mariajob01.firebaseapp.com",
    databaseURL: "https://mariajob01-default-rtdb.firebaseio.com",
    projectId: "mariajob01",
    storageBucket: "mariajob01.firebasestorage.app",
    messagingSenderId: "253374710047",
    appId: "1:253374710047:web:ac7dbb30d2019ae69e702a",
    measurementId: "G-79642QZTTM"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Détails des tacos pour la modale
const tacosDetails = {
    "Classique": { description: "Un tacos classique délicieux.", image: "images/TacosClassic.png" },
    "Géant": { description: "Un tacos géant pour les grands appétits.", image: "images/TacosGeant.png" },
    "Végétarien": { description: "Un tacos végétarien sain et savoureux.", image: "images/TacosVegetal.png" },
    "Spécial": { description: "Notre spécialité avec des ingrédients premium.", image: "images/TacosSpecial.png" },
    "Mexico": { description: "Un tacos inspiré de la cuisine mexicaine.", image: "images/tacosmexico.png" },
    "Margherita": { description: "Une pizza Margherita à l'italienne.", image: "images/PizzaMargherita.jpg" }
};

// Fonction d'ouverture de la modale
const openModal = (category) => {
    const details = tacosDetails[category];
    if (details) {
        document.getElementById('modal-title').textContent = category;
        document.getElementById('modal-description').textContent = details.description;
        document.getElementById('modal-image').src = details.image;
        document.getElementById('modal').style.display = 'flex';
    }
};

// Fonction pour calculer le total
const prices = {
    "Classique": 50,
    "Géant": 80,
    "Végétarien": 60,
    "Spécial": 100,
    "Mexico": 120,
    "Margherita": 110
};

const updateTotal = () => {
    let total = 0;
    document.querySelectorAll('.tacos-quantity').forEach(input => {
        const category = input.dataset.category;
        const quantity = parseInt(input.value, 10) || 0;
        total += quantity * prices[category];
    });
    document.getElementById('total-display').textContent = `Total à payer : ${total} DHS`;
    document.getElementById('total-display-header').textContent = `Total à payer : ${total} DHS`;
};

// Fonction pour envoyer la commande à Firebase
const sendOrderToFirebase = (orderData) => {
    const newOrderRef = push(ref(db, 'orders'));
    set(newOrderRef, orderData);
};

// DOMContentLoaded pour gérer les événements
document.addEventListener('DOMContentLoaded', () => {
    // Gestion du slider
    const slides = document.querySelectorAll('.slide');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const orderForm = document.getElementById('new-order-form');

    // Afficher la modale lorsqu'une image est cliquée
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const category = slide.dataset.category;
            openModal(category);
        });
    });

    // Fermer la modale
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Ajout d'une unité au clic sur les images dans le formulaire
    const tacosImages = document.querySelectorAll('#tacos-categories img');
    tacosImages.forEach(img => {
        img.addEventListener('click', (e) => {
            const category = e.target.alt;
            const input = document.querySelector(`.tacos-quantity[data-category="${category}"]`);
            if (input) {
                input.value = parseInt(input.value || "0", 10) + 1;
                input.dispatchEvent(new Event('input')); // Met à jour le total
            }
        });
    });

    // Calcul et mise à jour du total lors de la modification des quantités
    document.querySelectorAll('.tacos-quantity').forEach(input => {
        input.addEventListener('input', updateTotal);
    });

    // Soumettre la commande
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const clientName = document.getElementById('client-name').value || '';
        const clientPhone = document.getElementById('client-phone').value || '';
        const clientAddress = document.getElementById('client-address').value || '';
        const tacos = [];
        let total = 0;

        document.querySelectorAll('.tacos-quantity').forEach(input => {
            const category = input.dataset.category;
            const quantity = parseInt(input.value, 10) || 0;
            if (quantity > 0) {
                tacos.push({ category, quantity });
                total += quantity * prices[category];
            }
        });

        const orderData = {
            clientName,
            clientPhone,
            clientAddress,
            tacos,
            total,
            orderStatus: "En traitement",
            timestamp: new Date().getTime(), // Stocker le timestamp
            commercialPhone: "" // Numéro de téléphone du livreur (vide par défaut)
        };

        // Envoi de la commande à Firebase
        sendOrderToFirebase(orderData);

        // Réinitialisation du formulaire et du total
        orderForm.reset();
        updateTotal();
    });

    // Fonction de défilement automatique du slider
    let index = 0;
    const slideShow = () => {
        const slidesContainer = document.querySelector('.slides');
        const totalSlides = slidesContainer.children.length;
        index = (index + 1) % totalSlides;
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    };
    setInterval(slideShow, 3000);
});