"use strict";
//TODO
  //assign api a variable

  //assign a missing img variable
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const searchformterm = $("#searchForm-term");
const episodeList = $("#episodesList");
const TVMazeAPI= `http://api.tvmaze.com/`;
const missingImg = "http://images.unsplash.com/photo-1488372759477-a7f4aa078cb6?auto=format&fit=crop&q=60&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aW1hZ2V8ZW58MHx8MHx8fDA%3D";



/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm() {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
    console.log (searchformterm.val());
    const searchAPI = `http://api.tvmaze.com/search/shows?q=${searchformterm.val()}`
      console.log (searchAPI);

    const response= await axios.get(searchAPI);
    
    const data = response.data;
      console.log(data);

    return response.data.map (result => {

    const show = result.show;
  
    return {
    id: show.id,
    name: show.name,
    summary: show.summary,
    image:
    show.image ? show.image.original : missingImg,
    };
  });
  };




/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  console.log (shows);

  for (let show of shows) {
    const $show = $(`
    <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
  // console.log (populateShows);
};


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodeAPI = `http://api.tvmaze.com/shows/${id}/episodes`;

  try {
    const episodeResponse = await axios.get(episodeAPI);
    const episodeData = episodeResponse.data;
    console.log(episodeData);

    return episodeData.map(e => ({
      id: e.id,
      name: e.name,
      number: e.number,
      season: e.season,
    }));
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return []; // Return an empty array in case of error
  }
};


/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  episodeList.empty();

  for (let episode of episodes){
    const $item = $(
      `<li>
      ${episode.name}
      (season ${episode.season}, episode ${episode.number})
      </li>
      `);

    episodeList.append ($item);
  }
    $episodesArea.show();
 }

 async function getEpisodesAndDisplay(evt) {
  evt.preventDefault();
  
  const showId = $(evt.target).closest(".Show").data("show-id");
  console.log('Show ID:', showId); // Debugging line

  if (showId) {
    const episodes = await getEpisodesOfShow(showId);
    populateEpisodes(episodes);
  } else {
    console.log('No Show ID found'); // Debugging line
  }
}
 
$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);