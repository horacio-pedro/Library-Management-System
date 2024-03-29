var express = require('express');
var router = express.Router();
var userModel = require.main.require('./models/User');
var validationRules = require.main.require('./config/validation_rules/rules');
var asyncValidator = require('async-validator-2');

router.get('/', (req, res)=>{
    res.render('login.ejs', {errs: []});
});

router.post('/', (req, res)=>{

    var data = {
        email: req.body.email,
        password: req.body.password
    };

    var rules = validationRules.users.login;
    var validator = new asyncValidator(rules);

    validator.validate(data, (errors, fields)=>{
        if(!errors){
            userModel.validateUser(req.body.email, req.body.password, function(result){
                if(!result){
                  res.render('login', {errs: [{message: 'Email ou palavra-passe inválida'}]});
                }
                else{
                  console.log(result);
                  if(result.is_admin == 1){
                      req.session.admin = result.user_id;
                      res.redirect('/admin/dashboard');
                  }
                  else{
                      req.session.customer = result.user_id;
                      res.redirect('/customer/dashboard');
                  }
                }
            });
        }
        else {
            console.log(fields);
            res.render('login', {errs: errors});
        }
    });

});

module.exports = router;
