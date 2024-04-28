const http = require('http');
const url = require('url');
const fs = require('fs');

let data = fs.readFileSync('./pokedex.json');
let pokedex = JSON.parse(data);


const server = http.createServer((req, res) => {
    let path = url.parse(req.url,true).path.slice(1);
    path = decodeURIComponent(path);
    let pokemon = null;

    if (!isNaN(path)) {
        pokemon = pokedex.find(p => p.id === Number(path));
    } 

    else {
        pokemon = pokedex.find(p => 
            Object.values(p.name).some(n => n.toLowerCase() === path.toLowerCase())
        );
    }

    if (pokemon) {
        const response = {
            type: pokemon.type,
            base: {
                HP: pokemon.base.HP,
                Attack: pokemon.base.Attack,
                Defense: pokemon.base.Defense,
                "Sp. Attack": pokemon.base["Sp. Attack"],
                "Sp. Defense": pokemon.base["Sp. Defense"],
                Speed: pokemon.base.Speed
            }
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response));
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Pokemon not found');
    }
});

server.listen(3000, () => {
    console.log('Servidor abierto');
});