const { Router} = require('express');
const axios = require('axios')
const { Types } = require('../db');
const router = Router();

router.get ('/' , async (req,res,next) => {
    try {
    let typesApi = await axios.get('https://pokeapi.co/api/v2/type')
    const typesMap = typesApi.data.results.map((rawTypes) => {
            return {
                name: rawTypes.name
            }
        })
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