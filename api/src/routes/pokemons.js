const { Router} = require('express');
const axios = require('axios')
const { Pokemons, Types } = require('../db');
const { types } = require('pg');
const router = Router();

router.get ('/' , async (req,res,next) => {
    try {
/////////////////// TRAE DE LA API Y LO GUARDA EN POKEAPI ////////////////////
        const pokeApi = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40')
        const pokeDetail = pokeApi.data.results.map((pkm) => axios.get(pkm.url))
        let pokeApiFinal = await Promise.all(pokeDetail).then((rawUrl) => {
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
                    image: details.sprites.front_default,
                    created: false,
                    createdBy: 'Api'
                }
            })
            return pokeDetMap
        })

/////////////////// TRAE DE LA BASE Y LO GUARDA EN POKEBASE ////////////////////
        const pokeBase = await Pokemons.findAll({
            include: {
                model: Types,
                attributes: ["name"],
                through: {
                    attributes: [],
                },
            },
        });
        const pokeBaseFinal = pokeBase.map((elem) => {
            return {
                id: elem.id,
                name: elem.name,
                life: elem.life,
                attack: elem.attack,
                defense: elem.defense,
                speed: elem.speed,
                height: elem.height,
                weight: elem.weight,
                types: elem.types.map((obj) => obj.name),
                image: elem.image,
                created: elem.created,
                createdBy: elem.createdBy
            }
        })

/////////////////////// UNIR LO DE LA API Y LO DE LA BASE ///////////////////////
        const allPoke = [...pokeApiFinal,...pokeBaseFinal]
        // console.log(allPoke)

/////////////////////// LOGICA DE QUERY ////////////////////////////////////
        const {name} = req.query;
        if (name) {
            let pokeFilterByName = allPoke.filter((consulta) => 
                // console.log(consulta)
                consulta.name.toLowerCase() === name.toLowerCase()
            )
            pokeFilterByName.length ? 
            // console.log(pokeFilterByName)
            res.send(pokeFilterByName) : 
            res.status(404).send(`El pokemon "${name}" no existe`)

            
            ////////////////////// RES.SEND FINAL //////////////////////////////////
        } else {
            res.send(allPoke)
        }
    } catch (error) {
        next(error)
    }
})

router.get ('/:id' , async (req,res,next) => {
    try {
        /////////////////// TRAE DE LA API Y LO GUARDA EN POKEAPI ////////////////////
        const pokeApi = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40')
        const pokeDetail = pokeApi.data.results.map((pkm) => axios.get(pkm.url))
        let pokeApiFinal = await Promise.all(pokeDetail).then((rawUrl) => {
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
                    image: details.sprites.front_default,
                    created: false,
                    createdBy: 'Api'
                }
            })
            return pokeDetMap
        })
        
        /////////////////// TRAE DE LA BASE Y LO GUARDA EN POKEBASE ////////////////////
        const pokeBase = await Pokemons.findAll({
            include: {
                model: Types,
                attributes: ["name"],
                through: {
                    attributes: [],
                },
            },
        });
        const pokeBaseFinal = pokeBase.map((elem) => {
            return {
                id: elem.id,
                name: elem.name,
                life: elem.life,
                attack: elem.attack,
                defense: elem.defense,
                speed: elem.speed,
                height: elem.height,
                weight: elem.weight,
                types: elem.types.map((obj) => obj.name),
                image: elem.image,
                created: elem.created,
                createdBy: elem.createdBy
            }
        })
        
        /////////////////////// UNIR LO DE LA API Y LO DE LA BASE ///////////////////////
        const allPoke = [...pokeApiFinal,...pokeBaseFinal]
        
        //////////////////// LOGICA DE PARAMS ///////////////////////////
        const {id} = req.params
        const pokeFilter = allPoke.find((element) => element.id == id)
        if (pokeFilter) {
            return res.send(pokeFilter)
        }
        return res.status(404).send(`El pokemon con el ID:"${id}" no existe`)
        
    } catch (error) {
        next(error)
    }
})        

router.post('/', async (req,res,next)=>{
    try {
        const { name, life, attack,  defense, speed, height, weight, image, types} = req.body
        const [newPokemon, created] = await Pokemons.findOrCreate({
            where: {
                name,
                life,
                attack,
                defense,
                speed,
                height,
                weight,
                image
            },
        })
            if(!created) {
            res.send(`el pokemon "${name}" ya existe`)
        } else {
            const typeDB = await Types.findAll({
                where: { name: types },
            });
            await newPokemon.addTypes(typeDB);
            res.status(200).send(newPokemon)
        }
    } catch(error) {
        next(error)
    }
});

module.exports = router; 