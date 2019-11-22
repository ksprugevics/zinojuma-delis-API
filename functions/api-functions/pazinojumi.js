const{
    db,
    admin,
    app
} = require('./../admin.js');

// Atgriež paziņojumus kā masīvu.
const PazinojumiGet = app.get('*/pazinojumi', (request, response) =>
{
    const postRef = db.collection('pazinojumi');
    const pazinojumi = [];

    postRef.get()
    .then((querySnapshot) =>{

    // Iterējam cauri visiem objektiem.
        querySnapshot.forEach(function(doc) {

            // Tukšajā masīvā ievietojam iegūtu informāciju
            pazinojumi.push({
                id: doc.id,
                datat: doc.data()
            });
        });

        // Iegūto informāciju atgriežam kā response
        response.send({pazinojumi});
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to get paziņojumi."});
    });
});

// Atgriež individuālo paziņojumu pēc norādītā ID.
const PazinojumiGetByID = app.get('*/pazinojumi/:id', (request, response) =>
{
    //Iegūstam id un attiecīgo dokumentu
    const id =  request.params.id;
    const postRef = db.collection('pazinojumi').doc(id);

    postRef.get()
    .then((doc) => {
        if(doc.exists)
        {
            return response.status(200).json(doc.data());
        } else {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to get paziņojums."});
    });
});

// Pievieno jaunu paziņojumu.
const PazinojumiPost = app.post('*/pazinojumi', (request, response) =>
{
    const postRef = db.collection('pazinojumi');

    // Request body sastāvēs no šādām vērtībām:
    const{nosaukums, apraksts} = request.body;

    const data =
    {
        datums: admin.firestore.FieldValue.serverTimestamp(),
        nosaukums,
        apraksts
    } 

    // Pievienojam datubāzei requesta body.
    postRef.add(data)
    .then(postRef =>
    {
        return postRef.get();
    })
    .then(postDoc =>
    {
        const data = postDoc.data();
        const {nosaukums, apraksts} = data;

        response.status(201).json({
            id: postDoc. id,
            nosaukums,
            apraksts
        })
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to create paziņojums."});
    });
});

// Izdzēš paziņojumu pēc ID.
const PazinojumiDelete = app.delete('*/pazinojumi/:id', (request, response) =>
{
    const id =  request.params.id;
    const postRef = db.collection('pazinojumi').doc(id);
    
    // Sākumā pārbauda vai paziņojums ar šādu ID eksistē.
    postRef.get()
    .then((doc) => {
        if(!doc.exists)
        {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })
    
    // Izdzēš paziņojumu, ja tāds eksistē.
    postRef.delete()
    .then(() =>
    {
        response.status(200).json({"success": "Paziņojums deleted successfully."});
    })
    .catch((error) => 
    {
        response.status(500).json({"error": "Failed to delete paziņojums."});
    });
});

// Izmaina paziņojumu pēc ID.
const PazinojumiUpdate = app.put('*/pazinojumi/:id', async (request, response) => 
{
    const id =  request.params.id;
    const postRef = db.collection('pazinojumi').doc(id);
    
    // Sākumā pārbauda vai paziņojums ar šādu ID eksistē.
    postRef.get()
    .then((doc) => {
        if(!doc.exists)
        {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })


    // Request body sastāvēs no šādām vērtībām (tādām pašām kā post)
    const{nosaukums, apraksts} = request.body;

    const data =
    {
        datums: admin.firestore.FieldValue.serverTimestamp(),
        nosaukums,
        apraksts,
    } 

    //Izmainām jau esošās vērtības ar merge
    postRef.set(data,{merge:true})
    .then(postRef =>
    {
        response.status(200).json({"success": "Paziņojums updated successfully."});
    })
    .catch((error) =>
    {
        response.status(500).json({"error": "Failed to delete paziņojums!"});
    });

});

module.exports = {
    PazinojumiGet,
    PazinojumiGetByID,
    PazinojumiPost,
    PazinojumiDelete,
    PazinojumiUpdate
}
