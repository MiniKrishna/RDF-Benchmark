const { Connection, db, query } = require('stardog');
const Path = require('path');


module.exports = function StardogExample() {
    const conn = new Connection({
        username: 'admin',
        password: 'admin',
        endpoint: 'http://localhost:5820',
    });


    const databaseMusic = 'music';
    console.time('createDBMusic');


    const musicTest = db.create(conn, databaseMusic, {}, { files: [{ filename: '/var/opt/source-data/music.ttl' }] }).then(res => {
        console.timeEnd('createDBMusic')
        console.log(res);
        console.time('queryDistinct')
        return query
            .execute(
                conn,
                databaseMusic,
                'select distinct ?s where { ?s ?p ?o }',
                'application/sparql-results+json',
                {
                    limit: 10,
                    reasoning: true,
                    offset: 0,
                }
            )
    }
    ).then(res => {
        console.timeEnd('queryDistinct')
        console.log(res);
        console.log(res.body.results.bindings);
    }).finally(res => {
        return db.drop(conn, databaseMusic).then(res => {
            console.log(res.body.message);
        });
    })


    const databaseMovie = 'movie';
    console.time('createDBMovie');

    musicTest.then(res => {
        db.create(conn, databaseMovie, {}, { files: [{ filename: '/var/opt/source-data/music.ttl' }] }).then(res => {
            console.timeEnd('createDBMovie')
            console.log(res);
            console.time('querySearch')
            return query
                .execute(
                    conn,
                    databaseMovie,
                    `SELECT ?movie ?title
                    WHERE {
                        ?meg :hasName "Meg Ryan";
                            :actedIn ?movie.
                        ?tom :hasName "Tom Hanks" ;
                            :actedIn ?movie.
                        ?movie :hasTitle ?title .
                    }`,
                    'application/sparql-results+json',
                    {
                        limit: 1,
                        reasoning: true,
                        offset: 0,
                    }
                )
        }
        ).then(res => {
            console.timeEnd('querySearch')
            console.log(res.body.results);
        }).finally(res => {
            db.drop(conn, databaseMovie).then(res => {
                console.log(res.body.message);
            });
        })
    })
}
