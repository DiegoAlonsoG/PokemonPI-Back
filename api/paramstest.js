router.get ('/:id' , async (req,res,next) => {
    try {

        const {id} = req.params
        /////////////////// TRAE DE LA API Y LO GUARDA EN POKEAPI ////////////////////
        const pokeApi = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        // console.log(pokeApi.data.results)
        const findApi =
                {
                    id: pokeApi.data.id,
                    name: pokeApi.data.name,
                    life: pokeApi.data.stats[0].base_stat,
                    attack: pokeApi.data.stats[1].base_stat,
                    defense: pokeApi.data.stats[2].base_stat,
                    speed: pokeApi.data.stats[5].base_stat,
                    height: pokeApi.data.height,
                    weight: pokeApi.data.weight,
                    types: pokeApi.data.types.map((t) => t.type.name),
                    image: pokeApi.data.sprites.front_default,
                    created: false
                }
            // console.log(pokeDetMap)
                
        /////////////////// TRAE DE LA BASE Y LO GUARDA EN POKEBASE ////////////////////
        const pokeBase = await Pokemons.find({
            where: {
                id: id
            }
        })
        const findDb = {
                id: pokeBase.id,
                name: pokeBase.name,
                life: pokeBase.life,
                attack: pokeBase.attack,
                defense: pokeBase.defense,
                speed: pokeBase.speed,
                height: pokeBase.height,
                weight: pokeBase.weight,
                types: pokeBase.types.map((obj) => obj.name),
                image: pokeBase.image,
                created: pokeBase.created
            }
        
        const foundPkm = [...findApi, ...findDb]
        

        if (findApi) {
            return res.send(pokeFilter)
        }
        return res.status(404).send(`El pokemon con el ID:"${id}" no existe`)
        
    } catch (error) {
        next(error)
    }
})