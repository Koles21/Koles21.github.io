let apiMainUrl = "https://x8ki-letl-twmt.n7.xano.io/api:Gf36bQ74";

if (document.getElementById('registerBtn')) {
    document.getElementById('registerBtn').onclick = function(e) {
        e.preventDefault();

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let password = document.getElementById('password').value;
        let repeat_password = document.getElementById('repeat_password').value;

        let apiEndpoint = apiMainUrl + "/auth/signup";

        let requestBody = {
            name,
            email,
            phone,
            password,
            repeat_password
        };

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.authToken) {
                localStorage.setItem('authToken', data.authToken);
                alert('Registracija je uspesna');
                window.location.href = 'novi_oglas.html';
            }
        });
    };
}

if (document.getElementById('odjaviSe')) {
    document.getElementById('odjaviSe').onclick = function(e) {
        e.preventDefault();

        localStorage.clear();
        alert('Uspesno ste se odjavili');
        window.location.href = 'index.html';
    };
}


if (document.getElementById('noviOglasBtn')) {
    document.getElementById('noviOglasBtn').onclick = function(e) {
        e.preventDefault();

        let apiEndpoint = apiMainUrl + "/bike";
        let formData = new FormData();

        let make = document.getElementById('make').value;
        let price = document.getElementById('price').value;
        let fuel = document.getElementById('fuel').value;
        let year = document.getElementById('year').value;
        let user_id = document.getElementById('user_id').value;
        let body_type = document.getElementById('karoserija').value;
        let file = document.getElementById('file').files[0];

        // Append data to formData
        formData.append('make', make);
        formData.append('price', price);
        formData.append('fuel', fuel);
        formData.append('year', year);
        formData.append('user_id', user_id);
        formData.append('bike_type', body_type);
        formData.append('file', file);

        let authToken = localStorage.getItem('authToken');

        // Check if authToken exists
        if (!authToken) {
            alert('Authentication token is missing. Please log in again.');
            return;
        }

        // Log the authToken
        console.log('Auth Token:', authToken);

        // Make the POST request
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Something went wrong');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Oglas uspešno dodat. Čeka se odobravanje administratora');
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error adding ad:', error);
            alert(`Error: ${error.message}`);
        });
    };
}

if (document.getElementById('loginBtn')) {
    document.getElementById('loginBtn').onclick = function(e) {
        e.preventDefault();

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let apiEndpoint = apiMainUrl + '/auth/login';

        let requestBody = {
            email,
            password
        };

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.authToken) {
                localStorage.setItem('authToken', data.authToken);
                alert('Uspesno ste se login');
                window.location.href = 'novi_oglas.html';
            }
        });
    };
}

if (localStorage.getItem('authToken')) {
    document.getElementById("navigation").innerHTML = '<a href="novi_oglas.html" class="btn btn-warning">Dodaj oglas</a> <a href="#" id="odjaviSe" class="btn btn-info">Odjavi se</a>';

    document.getElementById('odjaviSe').onclick = function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'index.html';
    };
}

if (document.getElementById("sviOglasi")) {
    let currentUrl = window.location.href;
    if(!currentUrl.includes('?')){
        let apiEndpoint = apiMainUrl + "/bike";

        fetch(apiEndpoint)
        .then(response => response.json())
        .then(bikes => {
            let container = document.getElementById('sviOglasi');

            bikes.forEach(bike => {
                let bikeElement = document.createElement('div');

                bikeElement.className = 'col-sm-4';
                bikeElement.innerHTML = `
                    <div class='bike-item-wraper'>
                        <img src="${bike.bike_image.url}?tpl=big" alt="${bike.make}">
                        <h4>${bike.make}</h4>
                        <p>Cena: ${bike.price} $</p>
                        <p>Godiste: ${bike.year}</p>
                        <a class="btn btn-warning" href="bike.html?id=${bike.id}">Vidi više</a>
                    </div>
                `;

                container.appendChild(bikeElement);
            });
        });
    }
}

if (document.getElementById('appendImage')) {
    let urlParams = new URLSearchParams(window.location.search);
    let bike_id = urlParams.get('id');  // Corrected to get 'id' as a string

    let apiEndpoint = apiMainUrl + "/bike/" + bike_id;

    fetch(apiEndpoint)
    .then(response => response.json())
    .then(bike => {

        bike = bike[0];

        let imageContainer = document.querySelector('#appendImage');
        if (imageContainer) {
            let img = document.createElement('img');
            img.src = `${bike.bike_image.url}`;
            img.alt = bike.make;
            imageContainer.appendChild(img);
        } else {
            alert('Image container #appendImage not found');
        }

        let contentContainer = document.querySelector('#appendContent');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <h4>${bike.make}</h4>
                <p>Cena: ${bike.price}</p>
                <p>Godiste: ${bike.year}</p>
                <p>Karoserija: ${bike.body_type}</p>
                <p>fuel: ${bike.fuel}</p>
                <p>Kontakt telefon: ${bike._user.phone}</p>
            `;
        } else {
            alert('Content container #appendContent not found');
        }
    })
    .catch(error => {
        console.error('Error fetching bike data:', error);
    });
}


if(document.getElementById('pretraziBtn')) {

    let currentUrl = window.location.href;

    if(currentUrl.includes('?')) {
        let queryParams = new URLSearchParams(window.location.search);

        let make = queryParams.get('make');
        let year_from = queryParams.get('year_from');
        let year_to = queryParams.get('year_to');
        let price = queryParams.get('price');
        let fuel = queryParams.get('fuel');
        let karoserija = queryParams.get('karoserija');

        if(make)
            document.getElementById('make').value = make;
        
        if(fuel)
            document.getElementById('fuel').value = fuel;

        if(karoserija)
            document.getElementById('karoserija').value = karoserija;

        if(year_from)
            document.getElementById('year_from').value = year_from;

        if(year_to)
            document.getElementById('year_to').value = year_to;

        if(price)
            document.getElementById('price').value = price;


        let apiEndpoint = apiMainUrl + "/search";


        apiEndpoint += `?make=${encodeURIComponent(make)}&year_from=${year_from}&year_to=${year_to}&price=${price}&fuel=${encodeURIComponent(fuel)}&karoserija=${karoserija}`;

        console.log(apiEndpoint);

        fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(bikes => {
            let container = document.getElementById('sviOglasi');

            bikes.forEach(bike => {
                let bikeElement = document.createElement('div');

                bikeElement.className = 'col-sm-4';
                bikeElement.innerHTML = `
                    <div class='bike-item-wraper'>
                        <img src="${bike.bike_image.url}?tpl=big" alt="${bike.make}">
                        <h4>${bike.make}</h4>
                        <p>Cena: ${bike.price} $</p>
                        <p>Godiste: ${bike.year}</p>
                        <a class="btn btn-warning" href="bike.html?id=${bike.id}">Vidi više</a>
                    </div>
                `;

                container.appendChild(bikeElement);
            });
        });

    }
}
