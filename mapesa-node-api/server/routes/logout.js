const express = require("express");
const router = express.Router();

router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()){
        req.logout();
        res.redirect('/login');
    }else{
        res.json({message: "User not authenticated"});
    }
    
});


module.exports = router;