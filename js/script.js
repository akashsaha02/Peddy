let likedPets = [];
let allPets = []; 

// fetch and display categories
async function fetchAndDisplayCategories() {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
        const data = await response.json();

        if (data.status === true) {
            const categoriesContainer = document.getElementById('categories');
            let categoriesHTML = '';

            data.categories.forEach(category => {
                categoriesHTML += `
          <div class="category-card flex justify-center items-center gap-5 p-4 bg-white rounded-xl border cursor-pointer transition-all duration-300 ease-in-out transform hover:text-teal-800 hover:border-[#0E7A81] hover:shadow hover:rounded-full" 
               data-category="${category.category}">
            <img src="${category.category_icon}" class="w-6 md:w-10 object-cover" alt="${category.category}">
            <p class="text-md md:text-lg font-semibold">${category.category}</p>
          </div>`;
            });

            categoriesContainer.innerHTML = categoriesHTML;

            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', function () {
                    document.querySelectorAll('.category-card').forEach(c => {
                        c.classList.add('bg-white', 'text-black', "rounded-xl");
                        c.classList.remove('bg-teal-100', 'border-[#0E7A81]', 'rounded-full');
                    });

                    this.classList.remove('bg-white', 'text-black', 'rounded-xl');
                    this.classList.add('bg-teal-100', 'border-[#0E7A81]', 'rounded-full');

                    const categoryName = this.getAttribute('data-category');
                    fetchAndDisplayPets(categoryName);
                });
            });

        } else {
            console.error('Failed to fetch categories data');
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}


// Loader
function showPetsLoader() {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = `
        <div class="flex justify-center items-center col-span-3 p-10 min-h-80 ">
            <span class="loading loading-dots loading-lg"></span>
        </div>
    `;
}

// hide loading spinner and show the pets
function hidePetsLoader() {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = '';
}

// display pets 
async function fetchAndDisplayPets(categoryName = null) {
    showPetsLoader();
    const minLoadingTime = 2000;
    const startTime = Date.now();

    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await response.json();

        const elapsedTime = Date.now() - startTime;
        const remainingTime = minLoadingTime - elapsedTime;

        // Ensure the spinner is visible for at least 2 seconds
        setTimeout(() => {
            hidePetsLoader();

            if (data.status === true) {
                allPets = data.pets;

                // Filter pets by category if categoryName is provided
                const pets = categoryName
                    ? allPets.filter(pet => pet.category.toLowerCase() === categoryName.toLowerCase())
                    : allPets;

                // Display the fetched pets
                displayPets(pets, categoryName || 'All');
            } else {
                console.error('Failed to fetch pets data');
            }
        }, Math.max(remainingTime, 0));  // Wait for the remaining time (if any) to ensure 2 seconds
    } catch (error) {
        hidePetsLoader();  // Hide the loader even if there’s an error
        console.error('Error fetching pets:', error);
    }
}

function openModal(pet) {
    document.getElementById('modalImage').src = pet.image || './images/error.webp';
    document.getElementById('modalPetName').textContent = pet.pet_name || 'Name not available';
    document.getElementById('modalBreed').textContent = pet.breed || 'Not Available';
    document.getElementById('modalGender').textContent = pet.gender || 'Not Available';
    document.getElementById('modalPrice').textContent = `${pet.price || 'Not Available'}`;
    document.getElementById('modalVaccineStatus').textContent = pet.vaccinated_status || 'Not Available';
    document.getElementById('modalDescription').textContent = pet.pet_details || 'No description available';
    document.getElementById('modalBirthDate').textContent = pet.date_of_birth || 'Not Available';
    document.getElementById('my_modal_4').showModal();
}

document.getElementById('sort-price').addEventListener('click', () => {
    showPetsLoader();  // Show the loader

    const minLoadingTime = 2000;  
    const startTime = Date.now();

    const sortedPets = allPets.sort((a, b) => (b.price || 0) - (a.price || 0));
    console.log(sortedPets);

    const elapsedTime = Date.now() - startTime;
    const remainingTime = minLoadingTime - elapsedTime;

    setTimeout(() => {
        hidePetsLoader();  // Hide the spinner

        // Display sorted pets
        displayPets(sortedPets, 'Sorted by Price (Desc)');
    }, Math.max(remainingTime, 0));  
});


// Function to display pets dynamically
function displayPets(pets, categoryName) {
    const petsContainer = document.getElementById('pets');
    petsContainer.innerHTML = ''; // Clear the existing content

    if (pets.length === 0) {
        petsContainer.innerHTML = `<div class="col-span-3 flex justify-center items-center flex-col p-5 md:p-20">
        <div class="max-w-3xl ">
            <img class="w-full" src="./images/error.webp" alt="">
        </div>
        <h1 class="text-center text-2xl md:text-3xl font-bold">No Information available in the <span class="font-italic">${categoryName}</span> category.</h1>
    </div>`;
        return;
    }

    // Create pet cards dynamically
    let petsHTML = '';
    pets.forEach((pet, index) => {
        petsHTML += `
                <div class="card bg-base-100 shadow-xl">
                    <figure class="px-5 pt-5">
                        <img class="w-full object-cover rounded-xl"
                            src="${pet.image}" alt="${pet.pet_name}"/>
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title text-">${pet.pet_name || "Name not found"}</h2>
                        <p class="text-md flex items-center gap-2 text-gray-600"><i class="fa-solid fa-boxes-stacked w-4"></i> Breed: ${pet.breed || 'Not Available'}</p>
                        <p class="text-md flex items-center gap-2 text-gray-600"><i class="fa-solid fa-calendar-days w-4"></i> Birth: ${pet.date_of_birth || 'Not Available'}</p>
                        <p class="text-md flex items-center gap-2 text-gray-600"><i class="fa-solid fa-transgender w-4"></i> Gender: ${pet.gender || 'Not Available'}</p>
                        <p class="text-md flex items-center gap-2 text-gray-600"><i class="fa-solid fa-money-check-dollar w-4"></i> Price: ${pet.price || 'Not Available'}$</p>
                        <hr class="my-2">
                        <div class="flex items-center justify-between gap-2 ">
                            <button class="btn btn-sm like-btn" data-pet-id="${pet.petId}" data-pet-img="${pet.image}" ><i class="fa-solid fa-thumbs-up text-[#0E7A81]"></i></button>
                             <button class="btn btn-sm btn-adopt text-[#0E7A81]" onclick="handleAdoptButtonClick(this)">Adopt</button> 
                            <button class="btn btn-sm btn-details text-[#0E7A81]" data-index='${index}'>Details</button>
                        </div>
                    </div>
                </div>
    `;
    });

    // Append the generated HTML to the pets container
    petsContainer.innerHTML = petsHTML;

    // Add event listeners to the "Like" buttons after rendering the pet cards
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function () {
            const petId = this.getAttribute('data-pet-id');
            const petImage = this.getAttribute('data-pet-img');
            addLikedPet(petId, petImage);
        });
    });

    // Attach event listeners to the 'Details' buttons after pets are rendered
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function () {
            const petIndex = this.getAttribute('data-index'); // Get the index of the pet
            const selectedPet = pets[petIndex];  // Get the corresponding pet object using the index
            openModal(selectedPet);  // Open the modal with the pet details
        });
    });
}

// Function to add liked pet to the "liked_image" div
function addLikedPet(petId, petImage) {
    if (likedPets.includes(petId)) {
        alert('Already added');
        return;
    }
    likedPets.push(petId);

    const likedImageContainer = document.getElementById('liked_image');

    const imgElement = `
       <img src="${petImage}" class="w-full rounded-xl object-cover m-2" alt="Liked Pet Image">
   `;

    likedImageContainer.innerHTML += imgElement;
}

// Function to handle adopt button click
function handleAdoptButtonClick(button) {
    const adoptModal = document.getElementById('adoptModal');
    const adoptCountdown = document.getElementById('adoptCountdown');
    const adoptMessage = document.getElementById('adoptMessage');

    adoptCountdown.textContent = '3';
    adoptMessage.textContent = 'Addoption process in progress...';

    adoptModal.showModal();

    let countdownValue = 3;
    const countdownInterval = setInterval(() => {
        countdownValue--;
        adoptCountdown.textContent = countdownValue;

        if (countdownValue === 0) {
            clearInterval(countdownInterval);
            adoptCountdown.textContent = '';
            adoptMessage.textContent = 'Adopted';
            button.classList.add('btn-disabled');  // Disable the button
            button.disabled = true;  // Disable the button functionality

            setTimeout(() => {
                closeAdoptModal();
            }, 500);  
        }
    }, 1000);
}

// Function to close the modal
function closeAdoptModal() {
    const adoptModal = document.getElementById('adoptModal');
    adoptModal.close();
}


fetchAndDisplayCategories();
fetchAndDisplayPets(); 

