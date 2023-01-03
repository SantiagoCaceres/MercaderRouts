const express=require('express');
const WebScraper =require('../scripts/scarpy.js');
const router = express.Router();
var tabla;

router.get('/tabla', async (req, res) => {

    tabla=await WebScraper();
    res.render('tabla',{datos:tabla})
    
})
    
router.get('/about', (req, res) => res.render('about'))
router.get('/',  (req, res) => { res.render('index')
})

module.exports=router;