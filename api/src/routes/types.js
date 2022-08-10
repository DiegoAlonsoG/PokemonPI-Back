const { Router} = require('express');
const axios = require('axios')
const { Types } = require('../db');
const router = Router();

router.get ('/' , async (req,res,next) => {
    try {
    let typesApi = await axios.get('https://pokeapi.co/api/v2/type')
    // .then((respuesta) => {
    //     // console.log(respuesta.data.results)
    const typesMap = typesApi.data.results.map((rawTypes) => {
            return {
                name: rawTypes.name
            }
        })
    // console.log(typesMap)
    let consulta = await Types.findAll()
    consulta.length ? 
    res.status(201).send(consulta)
    :
    Types.bulkCreate(typesMap)
    .then((typesDb) => {
        res.status(201).send(typesDb)
    })
}
    catch(error) {
        next(error)
    }
})

module.exports = router;

// res.send('soy post /types')
// const {name} = req.body;
// return Types.create({name})
// .then((newType) => {
//     res.status(201).send(newType)
// })
// res.send('soy get /types')
// try {
//     const types = await Types.findAll();
//     res.send(types)
// } catch (error) {
//     next(error)
// }
// router.post ('/' , (req,res,next) => {


// })

// router.put ('/' , (req,res,next) => {
//     res.send('soy put /types')
// })

// router.delete ('/' , (req,res,next) => {
//     res.send('soy delete /types')
// });