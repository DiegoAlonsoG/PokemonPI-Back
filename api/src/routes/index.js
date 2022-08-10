const { Router, json} = require('express');
const pokemonsRoute = require('./pokemons');
const typesRoute = require('./types');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');



const router = Router();

router.use('/pokemons', pokemonsRoute);
router.use('/types', typesRoute)



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
