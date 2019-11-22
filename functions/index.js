const functions = require('firebase-functions');

// Admin un API settingi.
const{
    db,
    admin,
    app
} = require('./admin.js');

// Aktualitātes metodes.
const {
    AktualitatesGet,
    AktualitatesGetByID,
    AktualitatesPost,
    AktualitatesDelete,
    AktualitatesUpdate
 } = require('./api-functions/aktualitates.js');

 // Paziņojumi metodes
 const {
    PazinojumiGet,
    PazinojumiGetByID,
    PazinojumiPost,
    PazinojumiDelete,
    PazinojumiUpdate
 } = require('./api-functions/pazinojumi.js');

// Visi rquesti izsauks app instanci
exports.api = functions.https.onRequest(app);


//Lai palaistu serveri:
//firebase serve --only functions,hosting


//-----------------------------------
//Lekcijas API


app.post('*/lekcijas', (request, response) =>
{

    const postRef = db.collection('lekcijas');

    // Request body sastāvēs no šādām vērtībām
    const{kurss, datums, laiks, kabinets, statuss} = request.body;

    // Dati, kas tiks saglabāti pie katras aktualitātes
    const data =
    {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        kurss,
        datums,
        laiks,
        kabinets,
        statuss

    } 

    // Pievienojam datubāzei post requesta body
    postRef.add(data)
    .then(postRef =>
    {
        return postRef.get();
    })
    .then(postDoc =>
    {
        const data = postDoc.data();
        const {kurss, datums, laiks, kabinets, statuss} = data;

        response.status(201).json({
            id: postDoc. id,
            kurss,
            datums,
            laiks,
            kabinets,
            statuss
        })
    })
    .catch((error) => {
        response.status(500).json({error: "Failed to add lekcijas"});
    });
});

// Lai atgūtu visus paziņojumu
app.get('*/lekcijas', (request, response) =>
{
    const postRef = db.collection('lekcijas');

    // Saturēs visas paziņojumus
    const lekcijas = [];

    // Atgūstam visas paziņojumus
    postRef.get()
    .then((querySnapshot) =>{
        // Iterējam cauri visām aktualitātēm
        querySnapshot.forEach(function(doc) {
            // Tukšajā masīvā ievietojam iegūtu informāciju
            lekcijas.push({
                id: doc.id,
                datat: doc.data()
            });
        });
        // Iegūto informāciju atgriežam kā response
        response.send({lekcijas});
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to add lekcijas"});
    });
});


// Lai izdzēstu aktualitāti ar konkrēto id
app.delete('*/lekcijas/:id', (request, response) =>
{
    const id =  request.params.id;
    const postRef = db.collection('lekcijas').doc(id);
    
    //TODO: Parbaude vai id nav tukss un ir valid

    postRef.delete()
    .then(() =>
    {
        response.status(200).json({"success": "Lekcija deleted successfully!"});
    })
    .catch((error) => 
    {
        response.status(500).json({"error": "Failed to delete lekcija!"});
    });
});



// Lai atgrieztu aktualitāti ar konkrētu ID
app.get('*/lekcijas/:id', (request, response) =>
{
    //Iegūstam id un attiecīgo dokumentu
    const id =  request.params.id;
    const postRef = db.collection('lekcijas').doc(id);


    //Atrodam un atgriežam to
    postRef.get()
    .then((doc) => {
        if(doc.exists)
        {
            return response.status(200).json(doc.data());
        } else {
            return response.status(400).json({"message":"Lekcija with that ID not found."});
        }
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to get lekcija!"});
    });
});


app.put('*/lekcijas/:id', async (request, response) => {
    
    //Iegūstam id un attiecīgo dokumentu
    const id =  request.params.id;
    const postRef = db.collection('lekcijas').doc(id);
    
    // Request body sastāvēs no šādām vērtībām
    const{kurss, datums, laiks, kabinets, statuss} = request.body;

    // Dati, kas tiks saglabāti pie katras aktualitātes
    const data =
    {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        kurss,
        datums,
        laiks,
        kabinets,
        statuss

    } 

    //Izmainām jau esošās vērtības ar merge
    postRef.set(data,{merge:true})
    .then(postRef =>
    {
        response.status(200).json({"success": "Lekcija edited successfully!"});
    })
    .catch((error) =>
    {
        response.status(500).send(error);
    });

});