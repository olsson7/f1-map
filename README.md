
# F1 Map <img src="assets/flag.png" width=4% height=4%>

React projekt som visar en karta över alla F1 lopp under aktuell säsong. Kartan är interaktiv där man kan klicka på punkter på kartan för att se information om loppet. Utöver detta visas resultat från varje lopp, förar & konstuktionsställning och vilka förare som tillhör vilka team. 
Projektet använder sig av [Ergast Developer API](http://ergast.com/mrd/). 

## Installation
* Klona detta repository.
```bash
git clone https://github.com/olsson7/f1-map
```

* Se till att du har node.js installerat på din dator genom att köra nedan kommando i valfri terminal
```javascript
node -v
```
* Om du fick att node.js inte kunde hittas så kan du ladda ner det [här](https://nodejs.org/en/download)


* Kör nedan kommando i projektets katalog för att installera nödvändiga paket.
```javascript
npm install
``` 

* API'et kräver ingen nyckel. 

* Kör sedan nedan kommando för att starta react-appen.
```javascript
npm start
```

* Öppna [http://localhost:3000](http://localhost:3000) för att visa appen i webbläsaren.

## Teknologier som används
* [React](https://react.dev/)
* [Axios](https://github.com/axios/axios)
* [Ergast Developer API](http://ergast.com/mrd/)
* [Bootstrap 5.2](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* [Tooltip](https://mui.com/material-ui/api/tooltip/)
* [React-Simple-Maps](https://www.react-simple-maps.io/
)

## Licens
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
