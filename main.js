// Add event listener of enter and get the searched text
// Make http request and get the search results
// Display the search results in the dynamic part

let searchInputEl = document.getElementById("searchInput");
let searchResultsEl = document.getElementById("searchResults");

let spinner = document.getElementById("spinner");

function createAndAppendSearchResult(result){

    // Create result item
    let resultItemEl = document.createElement("div");
    resultItemEl.classList.add("result-item");
    searchResultsEl.appendChild(resultItemEl);

    // Create search result title
    let { link, title, description } = result;
    let titleEl = document.createElement("a");
    titleEl.href = link;
    titleEl.target = "_blank";
    titleEl.textContent = title;
    titleEl.classList.add("result-title");
    resultItemEl.appendChild(titleEl);

    // Create a break element
    let titleBreakEl = document.createElement("br");
    resultItemEl.appendChild(titleBreakEl);

    // Create a url element
    let urlEl = document.createElement("a");
    urlEl.href = link;
    urlEl.target = "_blank";
    urlEl.textContent = link;
    urlEl.classList.add("result-url");
    resultItemEl.appendChild(urlEl);

    // Create a break element
    let linkBreakEl = document.createElement("br");
    resultItemEl.appendChild(linkBreakEl);

    // Create a description element
    let descriptionEl = document.createElement("p");
    descriptionEl.classList.add("link-description");
    descriptionEl.textContent = description;
    resultItemEl.appendChild(descriptionEl);

}

function displayResults(search_results){
    for(let result of search_results){
        createAndAppendSearchResult(result);
    }    
}

function searchWikipedia(event) {
    if (event.key === "Enter") {
        searchResultsEl.textContent = "";
        let searchInput = searchInputEl.value;
        let url = "https://apis.ccbp.in/wiki-search?search=" + searchInput;
        let options = {
            method: "GET"
        };
        spinner.classList.toggle("d-none");
        fetch(url, options).then(function (response){
            return response.json();
        }).then(function (jsonData){
            let { search_results } = jsonData;
            spinner.classList.toggle("d-none");
            displayResults(search_results);
        });
        console.log();
    }
}

searchInputEl.addEventListener("keydown", searchWikipedia);