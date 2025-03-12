document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.querySelector('.save-recipe');
    
    if (saveButton) {
        // Check if recipe is already in favorites
        checkFavoriteStatus();
        
        saveButton.addEventListener('click', async function() {
            const recipeId = this.getAttribute('data-id');
            const username = this.getAttribute('data-username');
            
            try {
                const response = await fetch('/api/users/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        recipeId: recipeId
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Toggle button text and class based on the action performed
                    if (data.message.includes('added')) {
                        saveButton.textContent = 'Remove from Favorites';
                        saveButton.classList.add('in-favorites');
                    } else {
                        saveButton.textContent = 'Save to Favorites';
                        saveButton.classList.remove('in-favorites');
                    }
                } else {
                    console.error('Failed to update favorites');
                }
            } catch (error) {
                console.error('Error updating favorites:', error);
            }
        });
    }
    
    async function checkFavoriteStatus() {
        const recipeId = saveButton.getAttribute('data-id');
        const username = saveButton.getAttribute('data-username');
        
        try {
            const response = await fetch('/api/users/is-contains-favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    recipeId: recipeId
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Set button text and class based on favorite status
                if (data.message === 'Recipe found in favorite') {
                    saveButton.textContent = 'Remove from Favorites';
                    saveButton.classList.add('in-favorites');
                }
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    }
});
