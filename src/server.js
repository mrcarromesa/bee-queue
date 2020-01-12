import express from 'express';
import bodyParser from 'body-parser';

import Queue from 'bee-queue';

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

const queue = new Queue('example', {
    // configuração do redis
    redis: {
        host: '127.0.0.1',
        port: 6379,
    }
}
);

function makeJob({data}, done) {
    console.log('chegou em makeJob');
    // funcNotExists();
    return done(null, data.x + data.y);

}

// Fica "escutando" novas tarefas e as processas
// Necessário executar uma vez apenas, quando iniciar o servidor
app.get('/job', (req, res) => {
    /*queue.process(function (job, done) {
        console.log(`Processing job ${job.id}`);
        return done(null, job.data.x + job.data.y);
    });*/

    queue.process(makeJob);
    
    res.json({ok: 'okjob'});
});

// Criar tarefa
app.get('/make', (req, res) => {

    const job = queue.createJob({x: 2, y: 3})
    job.save();

    // Ao finalizar com sucesso cada tarefa
    job.on('succeeded', (result) => {
        console.log(`Received result for job ${job.id}: ${result}`);
    });
    
    // Caso ocarra falha em quaisquer tarefas
    queue.on('failed', (job, err) => {
        console.log(`Job ${job.id} failed with error ${err.message}`);
      });

    res.json({ok: 'ok'});
    
    // Process jobs from as many servers or processes as you like
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))