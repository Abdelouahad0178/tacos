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

// Données des tacos pour la modale
const tacosDetails = [
    { title: "Tacos Classique", description: "Un tacos délicieux avec une garniture classique qui ravira vos papilles.", image: "images/TacosClassic.png" },
    { title: "Tacos Géant", description: "Un tacos géant pour les grands appétits, garni de viandes savoureuses.", image: "images/TacosGeant.png" },
    { title: "Tacos Végétarien", description: "Un choix sain et savoureux, rempli de légumes frais et de fromage.", image: "images/TacosVegetal.png" },
    { title: "Tacos Spécial", description: "Notre spécialité maison avec des épices uniques et des ingrédients premium.", image: "images/TacosSpecial.png" },
    { title: "Tacos Mexico", description: "Inspiré de la cuisine mexicaine, ce tacos vous transporte directement au Mexique.", image: "images/tacosmexico.png" },
    { title: "Pizza Margherita", description: "Inspiré de la cuisine italienne, cette Pizza vous transporte directement en Italie.", image: "images/PizzaMargherita.jpg" }
];

// Fonction d'ouverture de la modale
const openModal = (title, description, imageSrc) => {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-image').src = imageSrc;
    document.getElementById('modal').style.display = 'flex';
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
    const slides = document.querySelectorAll('.slide img');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const orderForm = document.getElementById('new-order-form');
    const tacosCategories = document.getElementById('tacos-categories');
    const totalDisplay = document.getElementById('total-display');

    // Afficher la modale lorsqu'une image est cliquée
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            const taco = tacosDetails[index];
            openModal(taco.title, taco.description, taco.image);
        });
    });

    // Fermer la modale
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
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
        const orderDetails = document.getElementById('order-details')?.value || '';
        const orderStatus = "En traitement";
        let total = 0;
        const tacos = [];

        document.querySelectorAll('.tacos-quantity').forEach(input => {
            const category = input.dataset.category;
            const quantity = parseInt(input.value, 10) || 0;
            if (quantity > 0) {
                tacos.push({ category, quantity });
                total += quantity * prices[category];
            }
        });

        const now = new Date();
        const dateTime = now.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

        // Structure des données de la commande
        const orderData = {
            clientName,
            clientPhone,
            clientAddress,
            tacos,
            orderDetails,
            orderStatus,
            total,
            dateTime,
            timestamp: now.getTime()
        };

        // Envoi de la commande à Firebase
        sendOrderToFirebase(orderData);

        // Réinitialisation du formulaire et du total
        orderForm.reset();
        totalDisplay.textContent = "Total à payer : 0 DHS";
    });

    // Fonction de défilement automatique du slider
    let index = 0;
    const slideShow = () => {
        const slides = document.querySelector('.slides');
        const totalSlides = slides.children.length;
        index = (index + 1) % totalSlides;  // Passer à l'index suivant
        slides.style.transform = `translateX(-${index * 100}%)`;
    };
    setInterval(slideShow, 3000);  // Défilement toutes les 3 secondes

   
   
});
