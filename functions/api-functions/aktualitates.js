const{
    db,
    admin,
    app
} = require('./../admin.js');


// Atgriež aktualitātes kā masīvu.
const AktualitatesGet = app.get('*/aktualitates', (request, response) =>
{
    const postRef = db.collection('aktualitates');
    const aktualitates = [];

    postRef.get()
    .then((querySnapshot) =>{

        // Iterējam cauri visiem objektiem.
        querySnapshot.forEach(function(doc) {

            // Tukšajā masīvā ievietojam iegūto informāciju.
            aktualitates.push({
                id: doc.id,
                datat: doc.data()
            });
        });

        // Iegūto informāciju atgriežam kā response.
        response.send({aktualitates});
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to get aktualitātes."});
    });
});

// Atgriež individuālo aktualitāti pēc norādītā ID.
const AktualitatesGetByID = app.get('*/aktualitates/:id', (request, response) =>
{
    //Iegūstam id un attiecīgo dokumentu.
    const id =  request.params.id;
    const postRef = db.collection('aktualitates').doc(id);

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
        response.status(500).json({"error": "Failed to get aktualitāte."});
    });
});

// Pievieno jaunu aktualitāti.
const AktualitatesPost = app.post('*/aktualitates', (request, response) =>
{
    const postRef = db.collection('aktualitates');

    // Request body sastāvēs no šādām vērtībām:
    const{nosaukums, apraksts, autors} = request.body;

    const data =
    {
        datums: admin.firestore.FieldValue.serverTimestamp(),
        nosaukums,
        apraksts,
        autors
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
        const {nosaukums, apraksts, autors} = data;

        response.status(201).json({
            id: postDoc. id,
            nosaukums,
            apraksts,
            autors
        })
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to create aktualitāte."});
    });
});

// Izdzēš aktualitāti pēc ID.
const AktualitatesDelete = app.delete('*/aktualitates/:id', (request, response) =>
{
    const id =  request.params.id;
    const postRef = db.collection('aktualitates').doc(id);
    
    // Sākumā pārbauda vai aktualitāte ar šādu ID eksistē.
    postRef.get()
    .then((doc) => {
        if(!doc.exists)
        {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })

    // Izdzēš aktualitāti, ja tāda eksistē.
    postRef.delete()
    .then((doc) =>
    {
        response.status(200).json({"success": "Aktualitāte deleted successfully!"});
    })
    .catch((error) => 
    {
        response.status(500).json({"error": "Failed to delete aktualitāte!"});
    });
});


// Izmaina aktualitāti pēc ID.
const AktualitatesUpdate = app.put('*/aktualitates/:id', async (request, response) =>
{
    const id =  request.params.id;
    const postRef = db.collection('aktualitates').doc(id);

    // Sākumā pārbauda vai aktualitāte ar šādu ID eksistē.
    postRef.get()
    .then((doc) => {
        if(!doc.exists)
        {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })

    const{nosaukums, apraksts, autors} = request.body;
    const data =
    {
        datums: admin.firestore.FieldValue.serverTimestamp(),
        nosaukums,
        apraksts,
        autors
    } 

    //Izmainām jau esošās vērtības ar merge
    postRef.set(data,{merge:true})
    .then((doc) =>
    {
        response.status(200).json({"success": "Aktualitāte izmainīta veiksmīgi!"});
    })
    .catch((error) =>
    {
        response.status(500).json({"error": "Failed to update aktualitāte!"});
    });
});

module.exports = {
    AktualitatesGet,
    AktualitatesGetByID,
    AktualitatesPost,
    AktualitatesDelete,
    AktualitatesUpdate
}
