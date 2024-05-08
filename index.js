const express = require('express');
const { Pool } = require('pg');
 
const app = express();
const PORT = 5000;

app.use (express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'batalha_pokemon', 
  password: 'ds564',
  port: 7007,
});

//pokemon

app.get('/pokemon', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM pokemon');
        res.status(200).json(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar pokemons', error.message);
        res.status(500).send('Erro ao buscar pokemons');
    }
});

app.post('/pokemon', async (req, res) => {
    const { nome, tipo, tipo2, nivel, hp, ataque, defesa, speed } = req.body;
    try {
        const resultado = await pool.query('INSERT INTO pokemon (nome, tipo, tipo2, nivel, hp, ataque, defesa, speed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [nome, tipo, tipo2, nivel, hp, ataque, defesa, speed]);
        res.status(201).send('Pokemon adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar pokemon', error.message);
        res.status(500).send('Erro ao adicionar pokemon');
    }
});

app.put('/pokemon/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, tipo2, nivel, hp, ataque, defesa, speed } = req.body;
    try {
        const resultado = await pool.query('UPDATE pokemon SET nome = $1, tipo = $2, tipo2 = $3, nivel = $4, hp = $5, ataque = $6, defesa = $7, speed = $8 WHERE id = $9', [nome, tipo, tipo2, nivel, hp, ataque, defesa, speed, id]);
        res.status(200).send('Pokemon atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar pokemon', error.message);
        res.status(500).send('Erro ao atualizar pokemon');
    }
});

app.delete('/pokemon/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await pool.query('DELETE FROM pokemon WHERE id = $1', [id]);
        res.status(200).send('Pokemon deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar pokemon', error.message);
        res.status(500).send('Erro ao deletar pokemon');
    }
});

app.get('/pokemon/nome/:nome', async (req, res) => {
    const nome = req.params.nome;
    const query = `SELECT * FROM pokemon WHERE LOWER(nome) LIKE $1`;
    const values = [`%${nome}%`]; 

    try {
        const resultado = await pool.query(query, values);
        res.status(200).send(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar pokemon', error.message);
        res.status(500).send({ message: error.message });
    }
});

//batalha

app.get('/batalha/:id_pokemon_1/:id_pokemon_2', async (req, res) => {
    const { id_pokemon_1, id_pokemon_2 } = req.params;
    
    try {
        
        const resultado1 = await pool.query('SELECT * FROM pokemon WHERE id = $1', [id_pokemon_1]);
        const resultado2 = await pool.query('SELECT * FROM pokemon WHERE id = $1', [id_pokemon_2]);

        const pokemon1 = resultado1.rows[0];
        const pokemon2 = resultado2.rows[0];

        let vencedor;
        let mensagem;

        const dano1 = Math.max(pokemon1.ataque - pokemon2.defesa, 0);
        const dano2 = Math.max(pokemon2.ataque - pokemon1.defesa, 0);
  
        pokemon1.hp -= dano2;
        pokemon2.hp -= dano1;

        if (pokemon1.speed > pokemon2.speed) {
            pokemon2.hp -= pokemon1.dano;
        } else if (pokemon2.speed > pokemon1.speed) {
            pokemon1.hp -= pokemon2.dano;
        } else {
            pokemon1.hp -= pokemon2.dano;
            pokemon2.hp -= pokemon1.dano;
        }

        if (pokemon1.hp <= 0 && pokemon2.hp <= 0) {
            vencedor = 'Empate';
            mensagem = 'A batalha terminou em empate';
        } else if (pokemon1.hp <= 0) {
            vencedor = pokemon2.id;
            mensagem = 'Pokemon 2 venceu por deixar o HP do adversário em 0';
        } else if (pokemon2.hp <= 0) {
            vencedor = pokemon1.id;
            mensagem = 'Pokemon 1 venceu por deixar o HP do adversário em 0';
        } else {
            if (dano1 > dano2) {
                vencedor = pokemon1.id;
                mensagem = 'Pokemon 1 venceu por causar mais dano';
            } else if (dano2 > dano1) {
                vencedor = pokemon2.id;
                mensagem = 'Pokemon 2 venceu por causar mais dano';
            } else {
                vencedor = 'Empate';
                mensagem = 'A batalha terminou em empate';
            }
        }
        console.log(id_pokemon_1)
        console.log(id_pokemon_2)
        console.log(vencedor)

       await pool.query('INSERT INTO batalha (id_pokemon_1, id_pokemon_2, vencedor) VALUES ($1, $2, $3)', [id_pokemon_1, id_pokemon_2, vencedor]);
        res.json({ message: mensagem, vencedor: vencedor });
    } catch (error) {
        console.error('Erro ao buscar pokemons', error.message);
        res.status(500).send('Erro ao buscar pokemons');
    }
});

//historico

app.get('/batalha', async (req, res) => {
    try {
        console.log('Buscando batalhas...');
        const resultado = await pool.query('SELECT * FROM batalha ORDER BY id DESC');
        console.log('Resultado da busca:', resultado.rows);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar batalhas', error.message);
        res.status(500).send('Erro ao buscar batalhas');
    }
});

app.get('/batalha/nome/:nome', async (req, res) => {
    const nome = req.params.nome.toLowerCase();
    const query = `
        SELECT batalha.* 
        FROM batalha 
        JOIN pokemon AS pokemon1 ON batalha.id_pokemon_1 = pokemon1.id
        JOIN pokemon AS pokemon2 ON batalha.id_pokemon_2 = pokemon2.id
        WHERE LOWER(pokemon1.nome) LIKE $1 OR LOWER(pokemon2.nome) LIKE $1
    `;
    const values = [`%${nome}%`]; 

    try {
        const resultado = await pool.query(query, values);
        res.status(200).send(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar batalha', error.message);
        res.status(500).send({ message: error.message });
    }
});

app.get('/batalha/detalhes', async (req, res) => {
    try {
        console.log('Buscando detalhes das batalhas...');
        const resultado = await pool.query(
            'SELECT batalha.id, pokemon1.nome AS pokemon1, pokemon2.nome AS pokemon2, vencedor.nome AS vencedor FROM batalha JOIN pokemon AS pokemon1 ON batalha.id_pokemon_1 = pokemon1.id JOIN pokemon AS pokemon2 ON batalha.id_pokemon_2 = pokemon2.id JOIN pokemon AS vencedor ON batalha.vencedor = vencedor.id ORDER BY batalha.id DESC'
        );
        console.log('Resultado da busca:', resultado.rows);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Erro ao buscar detalhes das batalhas', error.message);
        res.status(500).send('Erro ao buscar detalhes das batalhas');
    }
});
 
app.get('/' , (req, res) => {
    res.send('Servidor rodando perfeitamente 🎇✨');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}🚀`);
});
