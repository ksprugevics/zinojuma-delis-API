# Ziņojumu dēlis API

Kursa Tīmekļa tehnoloģijas 2019 ietvaros izstrādātā ziņojuma dēļa API, kas savienota ar firebase datubāzi. API funkcijas ir sadalītas loģiski pa vairākiem failiem. API izstādē tika izmantots expressjs.

## Lietošana
1) Inicializējam npm
`npm init`

2) Instalējam firebase tools
`npm install -g firebase-tools`

3) Autorizējamies firebase
`firebase login`

4) Inicializējam firebase, izvēloties
`firebase init`

Izvēloties funkcijas:

Funkcijas: `functions & hosting`

Valoda: `javascript`

Nepārrakstīt failus: `Don't overwrite`

Instalēt bibliotēkas: `install dependencies`

5) Gadījumā, ja `firebase.json` ir ticis izveidots no jauna, tam pievienot:

`"rewrites": [
{
    "source": "/api/**",
    "functions": "api"
}
]`

6) Lai palaistu:

`cd functions`

`firebase serve --only functions,hosting`
