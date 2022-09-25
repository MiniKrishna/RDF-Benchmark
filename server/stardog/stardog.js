const { Connection, db, query } = require('stardog');
const Path = require('path');


module.exports = function StardogExample() {
    const conn = new Connection({
        username: 'admin',
        password: 'admin',
        endpoint: 'http://localhost:5820',
    });


    const databaseName = 'music'
    console.time('createDB')


    db.create(conn, databaseName, {}, { files: [{ filename: '/var/opt/source-data/music.ttl' }] }).then(res => {
        console.timeEnd('createDB')
        console.log(res);
        console.time('queryDistinct')
        return query
            .execute(
                conn,
                databaseName,
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
        db.drop(conn, databaseName).then(res => {
            console.log(res.body.message);
        });
    })
}
