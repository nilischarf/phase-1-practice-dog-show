document.addEventListener('DOMContentLoaded', () => {
    dogForm = document.getElementById('dog-form')
    dogTable = document.getElementById('table-body')
    let currentEditDogId = null

    fetchDogs()

    function fetchDogs() {
        fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(dogs => {
                renderDogsTable(dogs)
            })
            .catch(error => console.error('Error fetching dogs:', error))
    }

    function renderDogsTable(dogs) {
        dogTable.innerHTML = ''
        dogs.forEach(dog => {
            addDogToTable(dog)
        })
    }

    function addDogToTable(dog) {
        const tr = document.createElement('tr')
        tr.dataset.id = dog.id

        tr.innerHTML = `
            <td class='dog-name'>${dog.name}</td>
            <td class='dog-breed'>${dog.breed}</td>
            <td class='dog-sex'>${dog.sex}</td>
            <td><button class = 'edit-btn'>Edit</button></td>
        `
        tr.querySelector('.edit-btn').addEventListener('click', () => handleEditButtonClick(dog, tr))

        dogTable.appendChild(tr)
    }
            
    function handleEditButtonClick(dog, row) {
        dogForm.name.value = dog.name
        dogForm.breed.value = dog.breed
        dogForm.sex.value = dog.sex
        currentEditDogId = dog.id
        dogForm.dataset.row = row.dataset.id
    }

    dogForm.addEventListener('submit', e => {
        e.preventDefault()
        
        if (!currentEditDogId) return

        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value, 
        }

        fetch(`http://localhost:3000/dogs/${currentEditDogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDog)
        })
            .then(response => response.json())
            .then(updatedDog => {
                const row = dogTable.querySelector(`[data-id='${updatedDog.id}']`)
                if (row) {
                    row.querySelector('.dog-name').textContent = updatedDog.name
                    row.querySelector('.dog-breed').textContent = updatedDog.breed
                    row.querySelector('.dog-sex').textContent = updatedDog.sex
                }
                dogForm.reset()
                currentEditDogId = null
            })
            .catch(error => console.error('Error updating dog:', error))
    })
})