<h1>Job com nodejs utilizando Bee Queue</h1>

<strong>Referências</strong>

* [Repositório Bee Queue](https://github.com/bee-queue/bee-queue#settings)


<strong>Instalação</strong>

* Instalar o redis através do docker:

```bash
docker run --name  redisbeeque -p 6379:6379 -d -t redis:alpine
```

* Encontrar o container:

```bash
docker ps -a
```

* Iniciar o container do redis:

```bash
docker start ID_DO_CONTAINER_AQUI
```

* Executar o seguinte comando:

```bash
yarn add bee-queue
```

<strong>Utilização</strong>

Inserir o seguinte código:

```js
import Queue from 'bee-queue';

// ...

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
    //funcNotExists();
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

```