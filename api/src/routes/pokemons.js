const { Router} = require('express');
const axios = require('axios')
const { Pokemons, Types } = require('../db');
const { types } = require('pg');
const router = Router();

router.get ('/' , async (req,res,next) => {
    try {
/////////////////// TRAE DE LA API Y LO GUARDA EN POKEAPI ////////////////////
        const pokeApi = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40')
        // console.log(pokeApi.data.results)
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
            // console.log(pokeDetMap)
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
        // console.log(pokeApi.data.results)
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
            // console.log(pokeDetMap)
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
        
        //////////////////// LOGICA DE PARAMS ///////////////////////////
        const {id} = req.params
        // console.log(id)
        
            // let pokeFilterByIdNumber = allPoke.filter((consulta) =>
            //     consulta.id === Number(id)
            // )

        const pokeFilter = allPoke.find((element) => element.id == id)


        // let pokeFilterByIdString = allPoke.findById(id)
        // console.log(pokeFilterByIdString)
            // if (pokeFilterByIdNumber.length) {
            //     return res.send(pokeFilterByIdNumber)
            // }
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

// router.post ('/' , async (req,res,next) => {
    //     // res.send('soy post /pokemons')
    
    // let typePokemon = await Types.findOne({
    //     where: {name: types.shift()}
    // })
    
    // if (types.length>0) {
    //     typePokemon
    // }
    
    // console.log(typePokemon)
    
    // await newPokemon.addType(types)
    
    // newPokemon.types = types
    // while (types.length>0) {
    //     const typePokemon = await Types.findAll(
    //     { where: {name: types.shift()}}
    //     )
    //     console.log(typePokemon)
    // }
    // await newPokemon.addType(typePokemon)
    
    // for(let i=0;i<types.length;i++){
    //     // console.log(typePokemon)
    //     await newPokemon.addType(typePokemon)
    // }
    
    
    // 	try {
        // 		const { name, life, attack, defense, speed, height, weight, image, types } = req.body;
// 		const newPokemon = await Pokemons.create({
// 			name: name.toLowerCase(),
// 			life,
// 			attack,
// 			defense,
// 			speed,
// 			height,
// 			weight,
// 			image,
// 		});
//         // let typesCreacion = [];
//         while (types.length > 0) {
//             let typeDB = await Types.findOne({
//                 where: {name: types.shift()},
//                 // raw: true
//             });
//             // typesCreacion.push(typeDB)
//             // console.log(typeDB)


//         // const typeDbArr = await Types.findAll({
//         //     where: { name: types },
//         //     raw: true
//         // });
//         // console.log(typeDbArr)

        
//             await newPokemon.addTypes(typeDB);
//         }
        
//         // let listTypes = await Promise.all(
//         //     types.map((elemP) => {
//         //     // console.log(elemP) 
//         //         Types.findOne({ 
//         //             where: { name: elemP },
//         //             raw: true 
//         //         })
//         // })
//         // )
//         // newPokemon.setTypes(listTypes);


//         // console.log(newPokemon)

//         // const typeDbArr = await Types.findAll({
//         //     where: { name: types },
//         //     raw: true
//         // });
//         // console.log(typeDbArr)
//         // let typeNames = [];
//         // for (let i=0; i<typeDbArr.length; i++) {

//         // }
//         // const typeDbId = typeDbArr.map((p) => {
//         // p.name
//         // })
//         // console.log(typeDbId)
//         // await pokemonCreated.addType(typeDbId)


// 		res.send(`Pokemon "${name}" creado con exito`);
// 	} catch (error) {
// 		next(error);
// 	}
// });

// router.post('/:pokemonId/types/:typeId', async(req,res,next) => { 
//     // linkea ambas tablas y relaciona de muchos a muchos
//     try {
//         const {pokemonId,typeId} = req.params;
//         const pokemon = await Pokemons.findByPk(pokemonId)
//         await pokemon.addType(typeId)
//         res.sendStatus(200)
//     } catch (error) { 
//         next(error)
//     }
// })

// router.put ('/' , (req,res,next) => {
//     res.send('soy put /pokemons')
// })

// router.delete ('/' , (req,res,next) => {
//     res.send('soy delete /pokemons')
// })

////////////////////// ANTIGUA LOGICA DE GET DATABASE //////////////////

// let pokeBase = await Pokemons.findAll({
        //         include:
        //             {
        //             model:Types, 
        //             attributes: ["name"]
        //             },
        //         raw: true
        //     })
        // console.log(pokeBase)
        // const pokeBaseFinal = pokeBase.map((elem) => {
        //     // console.log(elem)
        //     // const typesFinal = elem["types.name"].map((t) => {
        //     //     return t
        //     // })
        //     let typesArr = [];
        //     for (let i=0; i<pokeBase.length;i++) {
        //         typesArr.push(pokeBase[i]["types.name"])
        //     }
        //     let typesArrFin = [];
        //     typesArrFin.push({elem.name: hola})
        //     // console.log(typesArr)
        //     return {
        //     name: elem.name,
        //     life: elem.life,
        //     attack: elem.attack,
        //     defense: elem.defense,
        //     speed: elem.speed,
        //     height: elem.height,
        //     weight: elem.weight,
        //     types: typesArr,
        //     image: elem.image
        //     }
        // })
        // console.log(pokeBase);