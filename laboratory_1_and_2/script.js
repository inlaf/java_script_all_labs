$(document).ready(function() {
    const API_KEY = '80f5a9d3'; 

    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        const query = $('#search-input').val();
        
        $.ajax({
            url: `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`,
            method: 'GET',
            success: function(response) {
                const container = $('#movies-container');
                container.empty(); 

                if(response.Response === "True") {
                    response.Search.forEach(function(movie) {
                        const cardHTML = `
                            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 movie-card" style="display: none;">
                                <div class="card h-100 shadow-sm">
                                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'}" class="card-img-top" alt="${movie.Title}">
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title">${movie.Title}</h5>
                                        <p class="card-text text-muted">${movie.Year}</p>
                                        <button class="btn btn-outline-success mt-auto add-btn">Add to the list</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        container.append(cardHTML);
                    });
                    
                    $('.movie-card').each(function(index) {
                        $(this).delay(100 * index).fadeIn(400);
                    });
                } else {
                    container.append(`<div class="alert alert-warning w-100">We couldn't find the film</div>`);
                }
            }
        });
    });

    $(document).on('click', '.add-btn', function() {
        const btn = $(this);
        btn.removeClass('btn-outline-success').addClass('btn-success').text('Was added');
        btn.fadeOut(150).fadeIn(150); 
    });
});