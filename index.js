
const express = require('express');
let app = express();
let Animal = require('./Animal.js');
let Toy = require('./Toy.js');
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('scripts'));
app.set('view engine', 'ejs');

//app.use(bodyParser.json())

app.get('/', (req, res) =>{            //Center Point Page
   res.sendFile(__dirname + '/public' + '/index.html');
})

app.get('/findt', (req, res)=>{ 
   res.sendFile(__dirname + '/form' +  '/findt.html');
});

app.use('/formaddtoy', (req, res) =>{        //Form Add Toy Page  
   res.render('addtoy'); //ejs
});



 //Form Find Toy Page


app.get('/addtoy', (req, res) =>{       //Form Add Toy Action
   let newToy = new Toy(req.body);
   newToy.save((err) =>{
      if(err){
      res.type('html').status(500);
      res.send('Error: ' + err);
}

else{
   res.render('updatetoy', {toys: newToy})
}

   });

});




app.use('/findToy', (req, res) =>{      //Form Find Toy Action
   let query = {};
   let empty = {};
   if(req.query.id)
   query.id = req.query.id;

    /* if(req.query.name)
    terms.push ({ name: req.query.name });
    if(req.query.price)
    terms.push ({ price: req.query.price });
    let query = {$or : terms };*/
    
    
    if(Object.keys(query).length != 0 ){
       Toy.find(query, (err, toys) =>{
          if(toys.length != 0) {
             if (!err){
                console.log(toys)
                res.json(toys);
               }
               else {
                  console.log(err)
                  res.json({});
               }
            }
            else res.json(empty);
         });
      }

else res.json({});

});


 //Form Add Animal Page

app.use('/formaddanimal', (req, res)=>{ 

res.sendFile(__dirname + '/formanimal' + '/AddAnimal.html')

});

//Form Add Animal Action

app.use('/addanimal',(req, res) =>{
   let newAnimal = new Animal(req.body);
   newAnimal.save((err) =>{
      if(err) {
         res.type('html').status(500);
         res.send('Error: ' + err);
      }
      else {
         console.log(Animal)
         res.render('updateanimal',{animals: newAnimal});
      }
   });
});


//Form Find Animals Page

app.use('/formfindAnimals', (req, res) =>{
   res.sendFile(__dirname + '/formanimal' + '/findAnimals.html')
});



//Find Animals Action

app.use('/findAnimals', (req, res)=>{
   let query = {} ;
   if(req.query.species)
   query.species = req.query.species;
   if(req.query.trait)
   query['traits'] = req.query.trait;
   if(req.query.gender)
   query.gender = req.query.gender;
   if(Object.keys(query).length !=0){
      Animal.find(query,(err,animals) =>{
         if(animals.length != 0)  {
            if (err)  {
               console.log(err)
               res.json({});
            }
            else res.json(animals);
         }
         else res.json({});
      });
   }
   else res.json({});
});


//Animals Age LessThan Action

app.use('/animalsYoungerThan', (req, res) =>{
   let terms = [];
   if(req.query.age)
   for( let i = 0; i < req.query.age; i++) {
      if(i == req.query.age) terms.pop();
      terms.push({age: i}) 
      if(i == req.query.age) terms.pop();
   }
   let query = {$or : terms};
   console.log(query);
   if(terms.length != 0){
      Animal.find( query, (err,ageanimals) =>{
         let name  = [];
         let names = [];
         if(ageanimals.length != 0){
            let ob = Object.keys(ageanimals).length;
            ageanimals.forEach((animal) =>{
               names.push({name: animal.name});
            });
            name.push({count: ob, names: names})
            //console.log(name);
         }
         else{
            name.push({count: 0})
         };
         if(!err) {
            console.log(name)
            res.json(name); }
            else res.json({});
         });
      }
      else res.json({})
   });

   
//calculate page

app.use('/calculate', (req, res) =>{
   res.sendFile(__dirname +  '/form' + '/calculate.html');
});



//calculate Action

app.use('/calculatePrice', (req, res) =>{
   let qtyy = [];
   let qty = [req.query.qty];
   let id = [req.query.id];
   let terms = [];
   if(req.query.id){
      id.forEach((ida) =>{
         terms.push({id: ida})
      });
   }
   if(req.query.qty){
      qty.forEach((qt) =>{
         qtyy.push({qty: qt})
      });
   }
   //console.log(terms)
   let query = {$or: terms}
   Toy.find( query, (err,toys) =>{
      let e = [];
      let total = 0;
      let idtoy = [];
      let items = {};
      let item = []
      let pricy = [];
      let qtyp = [];
      let idequal = [];
      qtyy.forEach((qty) =>{
         qty.qty.forEach((q) =>{
            qtyp.push(q)
         });
      })
      terms.forEach((tr) =>{
         tr.id.forEach((t) =>{
            idequal.push(t)
         });
      });
      toys.forEach((toy) =>{
         pricy.push(toy.price)
         idtoy.push(toy.id)
      });
      if(idtoy.length == 1){
         for(let i =0; i < idequal.length; i++)
         if(idequal[i] == idtoy[0] ) {item.push({item: idtoy[0], qty: +qtyp[i], subtotal: +pricy[0] * +qtyp[i]}) 
         items.items =  item}
      }
      else{
         for(let i =0; i < idequal.length; i++)
         if(idequal[i] == idtoy[i] ) {item.push({item: idtoy[i], qty: +qtyp[i], subtotal: +pricy[i] * +qtyp[i]}) 
         items.items =  item}
      }
      item.forEach((it) =>{
         e.push (it.subtotal)
      });
      for(let i =0; i < e.length; i++) {
         total += e[i]
         items.totalPrice = total
      }
      for(let i =0; i < 2; i++)
      if(qtyp[i] == 0 || isNaN(qtyp[i])){items.items = [],items.totalPrice = 0;}

      if(!err){
         console.log(qtyp,items)
         res.json(items)
      }
      else{
         console.log(err)
         res.json({})
      }
   });
});


app.listen(3000, () => {
   console.log('Listening on port 3000');
});


    
// Please do not delete the following line; we need it for testing!
module.exports = app;