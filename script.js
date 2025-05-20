const books = [
    { id: 1, title: "Atomic Habits", author: "James Clear", genre: "Self-help" },
    { id: 2, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction" },
    { id: 3, title: "Deep Work", author: "Cal Newport", genre: "Productivity" },
    { id: 4, title: "Ikigai", author: "Francesc Miralles", genre: "Self-help" },
    { id: 5, title: "1984", author: "George Orwell", genre: "Fiction" },
    { id: 6, title: "Can't Hurt Me", author: "David Goggins", genre: "Biography" },
    { id: 7, title: "The 5 AM Club", author: "Robin Sharma", genre: "Motivation" },
    { id: 8, title: "The Psychology of Money", author: "Morgan Housel", genre: "Finance" },
    { id: 9, title: "Sapiens", author: "Yuval Noah Harari", genre: "History" },
    { id: 10, title: "Ego is the Enemy", author: "Ryan Holiday", genre: "Philosophy" },
];

let currentBookId = null;

function renderBooks(filterText = "", filterGenre = "") {
    const bookGrid = document.getElementById("bookGrid");
    bookGrid.innerHTML = "";

    const filtered = books.filter(book => {
        const text = filterText.toLowerCase();
        const matchesSearch =
            book.title.toLowerCase().includes(text) ||
            book.author.toLowerCase().includes(text) ||
            book.genre.toLowerCase().includes(text);
        const matchesGenre = !filterGenre || book.genre === filterGenre;
        return matchesSearch && matchesGenre;
    });

    if (filtered.length === 0) {
        bookGrid.innerHTML = `<p class="text-center col-span-3 text-gray-500">No books found.</p>`;
        return;
    }

    filtered.forEach(book => {
        const ratings = getBookRatings(book.id);
        const avgRating = ratings.length
            ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(1)
            : "No ratings";

        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow hover:shadow-md cursor-pointer";
        card.innerHTML = `
      <h3 class="text-xl font-semibold">${book.title}</h3>
      <p class="text-gray-600 mb-1">by ${book.author}</p>
      <p class="text-yellow-500 font-medium">Rating: ${avgRating}</p>
      <button class="mt-2 bg-blue-500 text-white px-3 py-1 rounded">View Details</button>
    `;
        card.querySelector("button").addEventListener("click", () => openModal(book));
        bookGrid.appendChild(card);
    });
}

function getBookRatings(id) {
    const key = `ratings-${id}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function getBookReviews(id) {
    const key = `reviews-${id}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function openModal(book) {
    currentBookId = book.id;
    document.getElementById("modalTitle").textContent = book.title;
    document.getElementById("modalAuthor").textContent = "By " + book.author;

    const reviewList = document.getElementById("modalReviews");
    reviewList.innerHTML = "";

    const reviews = getBookReviews(book.id);
    reviews.forEach(({ text, rating }) => {
        const li = document.createElement("li");
        li.textContent = `⭐${rating} - ${text}`;
        reviewList.appendChild(li);
    });

    document.getElementById("reviewInput").value = "";
    document.getElementById("rating").value = "5";
    document.getElementById("bookModal").classList.remove("hidden");
}

document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("bookModal").classList.add("hidden");
});

document.getElementById("submitReview").addEventListener("click", () => {
    const text = document.getElementById("reviewInput").value.trim();
    const rating = parseInt(document.getElementById("rating").value);

    if (text && rating) {
        const reviewKey = `reviews-${currentBookId}`;
        const ratingKey = `ratings-${currentBookId}`;
        const reviews = getBookReviews(currentBookId);
        const ratings = getBookRatings(currentBookId);

        reviews.push({ text, rating });
        ratings.push(rating);

        localStorage.setItem(reviewKey, JSON.stringify(reviews));
        localStorage.setItem(ratingKey, JSON.stringify(ratings));
        openModal(books.find(b => b.id === currentBookId)); // re-render
    }
});

// Filters
document.getElementById("searchBox").addEventListener("input", (e) => {
    renderBooks(e.target.value, document.getElementById("genreFilter").value);
});
document.getElementById("genreFilter").addEventListener("change", (e) => {
    renderBooks(document.getElementById("searchBox").value, e.target.value);
});

// Initial render
renderBooks();
