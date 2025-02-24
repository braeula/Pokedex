const BASE_URL = "https://pokeapi.co/api/v2/";
let countOfPokemons = 10;
let pokemons = [];
let pokNames = [];
let spinner = `<span class="loader"></span>`
let filteredList;
let filteredPokemons = [];
let html = '';

async function pokemonList(filtered = false) {
    await getPokemonNames();
    let names, count;
    if (filtered && filteredList.length != 0) {
        names = filteredList;
        count = filteredList.length;
    } else if (!filtered) {
        names = pokNames;
        count = countOfPokemons;
    }
    try {
        // let dat = await fetch(BASE_URL + 'pokemon?limit=10&offset=0')
        pokemons = [];
        for (let i = 0; i < count; i++) {
            let data = await fetch(BASE_URL + `pokemon/${names[i]}`)
            pokemons[i] = await data.json();
        }
    } catch (error) {
        console.error('nö');
    }
}

function showFilteredPokemons() {
    let input = document.getElementById('search').value.toLowerCase();
    html = '';
    if (input.length > 2) {
        filteredList = pokNames.filter((item) => item.includes(input));
        getPokemons(true)
    } else if (input.length == 0) {
        getPokemons(false)
    }
}

async function getPokemonNames() {
    let data = await fetch(BASE_URL + 'pokemon/?offset=0&limit=1350');
    data = await data.json();
    try {
        for (let i = 0; i < data.results.length; i++) {
            pokNames[i] = data.results[i].name;
        }
        // console.log(pokNames);        
    } catch (error) {
        console.error('nö');
    }
}

async function getPokemons(filtered) {
    document.getElementById('main-container').innerHTML = spinner;
    document.getElementById('more').classList.toggle('d-none');

    await pokemonList(filtered);

    addPokemons();
    if (!filtered) {
        document.getElementById('more').classList.toggle('d-none');
    }
}

function addPokemons() {
    html='';
    for (let i = 0; i < pokemons.length; i++) {
        let name = pokemons[i].name;
        let type = pokemons[i].types[0].type.name;
        let iconHtml = '';
        // let html=document.getElementById('main-container').innerHTML;
        for (let j = 0; j < pokemons[i].types.length; j++) {
            let typeName = pokemons[i].types[j].type.name
            iconHtml += `<div class="icon shadow ${typeName}"><img src="icons/${typeName}.svg" alt=""></div> `
        }
        let queryimage = `${"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/" + pokemons[i].id + ".png"}`

        html += `<div onclick="showInfo('${pokemons[i].name}')" class="pokemon-container" id="${pokemons[i].id}">
                    <div class="pok-header">
                        <span class="number">#${pokemons[i].id}</span>
                        <span class="title">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
                    </div>
                    <div class="pok-content ${type} ">
                        <img src=${queryimage} alt="">
                    </div>
                    <div class="pok-footer">${iconHtml}</div>          
                </div>`
    }
    html += `<div onclick="showList()" class="overlay d-none" id="overlay"></div>`
    document.getElementById('main-container').innerHTML = html;
    if (countOfPokemons > 10) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
}

function selectInfo() {
    document.getElementById("main").classList.toggle('d-none');
    document.getElementById("info-main").classList.toggle('active');
    document.getElementById("stats").classList.toggle('d-none');
    document.getElementById("info-stats").classList.toggle('active');
}

async function showInfo(name) {
    // document.getElementById('infobox').classList.toggle('d-none');
    document.getElementById('overlay').classList.toggle('d-none');
    let pok = pokemons.find(x => x.name === name)
    // let name = pok.name;
    let type = pok.types[0].type.name;
    let iconHtml = ''
    for (let j = 0; j < pok.types.length; j++) {
        let typeName = pok.types[j].type.name
        iconHtml += `<div class="icon shadow ${typeName}"><img src="icons/${typeName}.svg" alt=""></div> `
    }
    let queryimage = `${"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/" + pok.id + ".png"}`
    let abilities = '';
    for (let j = 0; j < pok.abilities.length; j++) {
        let abilitiyName = pok.abilities[j].ability.name;
        abilities += `${abilitiyName}, `
    }
    let html = ` <div class="infobox" id="infobox">            
            <div class="pok-header" style="height:48px;">
                        <span class="number">#${(pok.id)}</span>
                        <span class="title">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
                    </div>
                    <div class="pok-content ${type} ">
                        <img src=${queryimage} alt="">
                    </div>
            <div class="icon-section">${iconHtml}</div>
            <div class="info-menu">
                <div id="info-main" onclick="selectInfo()" class="menu-item active" style="border-right: 1px solid #082129;">main</div>
                <div id="info-stats" onclick="selectInfo()" class="menu-item">stats</div>
            </div>
            <div id="main" class="info-field">
                <table>
                    <tr>
                        <td>Height</td>
                        <td>: &nbsp; ${pok.height}</td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td>: &nbsp; ${pok.weight}</td>
                    </tr>
                    <tr>
                        <td>Base experience &nbsp;</td>
                        <td>: &nbsp; ${pok.base_experience}</td>
                    </tr>
                    <tr>
                        <td>Abilities</td>
                        <td>: &nbsp; ${abilities.slice(0, - 2)}</td>
                    </tr>
                </table>
            </div>

            <div id="stats" class="info-field d-none">
                <table>
                    <tr class="stats">
                        <td>Hp</td>
                        <td>
                            <progress id="hp" value="${pok.stats[0].base_stat}" max="100"></progress>
                        </td>
                    </tr>
                    <tr class="stats">
                        <td>Attack</td>
                        <td>
                            <progress id="attack" value="${pok.stats[1].base_stat}" max="100"></progress>
                        </td>
                    </tr>
                    <tr class="stats">
                        <td>Defense</td>
                        <td>
                            <progress id="defense" value="${pok.stats[2].base_stat}" max="100"></progress>
                        </td>
                    </tr>
                    <tr class="stats">
                        <td>Special-attack</td>
                        <td>
                            <progress id="sp-attack" value="${pok.stats[3].base_stat}" max="100"></progress>
                        </td>
                    </tr>
                    <tr class="stats">
                        <td>Special-defense &nbsp; &nbsp; &nbsp;</td>
                        <td>
                            <progress id="sp-defense" value="${pok.stats[4].base_stat}" max="100"></progress>
                        </td>
                    </tr>
                    <tr class="stats">
                        <td>Speed</td>
                        <td>
                            <progress id="speed" value="${pok.stats[5].base_stat}" max="100"></progress>
                        </td>
                    </tr>
                </table>
            </div>

        </div>`
    document.getElementById('main-container').innerHTML += html;
}

function showList() {
    document.getElementById('infobox').remove();
    document.getElementById('overlay').classList.toggle('d-none');
}

function increaseCount() {
    countOfPokemons += 10;
    getPokemons();
}

