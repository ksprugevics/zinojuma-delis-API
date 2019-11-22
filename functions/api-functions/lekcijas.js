const{
    db,
    admin,
    app
} = require('./../admin.js');

// Atgriež lekcijas kā masīvu.
const LekcijasGet = app.get('*/lekcijas', (request, response) =>
{
    const postRef = db.collection('lekcijas');
    const lekcijas = [];

    postRef.get()
    .then((querySnapshot) =>{

        // Iterējam cauri visiem objektiem.
        querySnapshot.forEach(function(doc) {

            // Tukšajā masīvā ievietojam iegūto informāciju.
            lekcijas.push({
                id: doc.id,
                datat: doc.data()
            });
        });
        // Iegūto informāciju atgriežam kā response.
        response.send({lekcijas});
    })
    .catch((error) => {
        response.status(500).json({"error": "Failed to get lekcijas."});
    });
});

// Atgriež individuālo lekciju pēc norādītā ID.
const LekcijasGetByID = app.get('*/lekcijas/:id', (request, response) =>
{
    //Iegūstam id un attiecīgo dokumentu
    const id =  request.params.id;
    const postRef = db.collection('lekcijas').doc(id);

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
        response.status(500).json({"error": "Failed to get lekcija."});
    });
});

// Pievieno jaunu lekciju.
const LekcijasPost = app.post('*/lekcijas', (request, response) =>
{
    const postRef = db.collection('lekcijas');

    // Request body sastāvēs no šādām vērtībām:
    const{kurss, datums, laiks, kabinets, statuss} = request.body;

    const data =
    {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        kurss,
        datums,
        laiks,
        kabinets,
        statuss

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
        response.status(500).json({error: "Failed to create lekcijas."});
    });
});

// Izdzēš lekciju pēc ID.
const LekcijasDelete = app.delete('*/lekcijas/:id', (request, response) =>
{
    const id =  request.params.id;
    const postRef = db.collection('lekcijas').doc(id);
    
    // Sākumā pārbauda vai lekcija ar šādu ID eksistē.
    postRef.get()
    .then((doc) => {
        if(!doc.exists)
        {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })

    // Izdzēš lekciju, ja tāda eksistē.
    postRef.delete()
    .then(() =>
    {
        response.status(200).json({"success": "Lekcija deleted successfully."});
    })
    .catch((error) => 
    {
        response.status(500).json({"error": "Failed to delete lekcija."});
    });
});

// Izmaina lekciju pēc ID.
const LekcijasUpdate = app.put('*/lekcijas/:id', async (request, response) => 
{
    const id =  request.params.id;
    const postRef = db.collection('lekcijas').doc(id);
    
    // Sākumā pārbauda vai lekcija ar šādu ID eksistē.
    postRef.get()
    .then((doc) => {
        if(!doc.exists)
        {
            return response.status(400).json({"error":"Invalid ID"});
        }
    })

    const{kurss, datums, laiks, kabinets, statuss} = request.body;
    const data =
    {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        kurss,
        datums,
        laiks,
        kabinets,
        statuss

    } 

    //Izmainām jau esošās vērtības ar merge.
    postRef.set(data,{merge:true})
    .then(postRef =>
    {
        response.status(200).json({"success": "Lekcija updated successfully."});
    })
    .catch((error) =>
    {
        response.status(200).json({"error": "Failed to update lekcija."});
    });

});

module.exports = {
    LekcijasGet,
    LekcijasGetByID,
    LekcijasPost,
    LekcijasDelete,
    LekcijasUpdate
}
