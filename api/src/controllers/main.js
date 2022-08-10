const axios = require('axios')
const { Pokemons, Types } = require('../db')

let UrlApi = 'https://pokeapi.co/api/v2/pokemon?limit=40';

let getPkmApi = function async () {
    const pokeApi =  axios.get('https://pokeapi.co/api/v2/pokemon?limit=40')
// console.log(pokeApi.data.results)
    const pokeDetail = pokeApi.data.results.map((pkm) => axios.get(pkm.url))
    let pokeApiFinal =  Promise.all(pokeDetail).then((rawUrl) => {
        let pokemon = rawUrl.map((rawDetail) => rawDetail.data)
        let pokeDetMap = pokemon.map((details) => {
            return {
                id: details.id,
                name: details.name,
                life: details.stats[0].base_stat,
                attack: details.stats[1].base_stat,
                defense: details.stats[2].base_stat,
                speed: details.stats[5].base_stat,
                height: details.height,
                weight: details.weight,
                types: details.types.map((t) => t.type.name),
                image: details.sprites.front_default
            }
        })
        // console.log(pokeDetMap)
        return pokeDetMap
    })
}

getPkmApi()