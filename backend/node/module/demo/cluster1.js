import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import process from 'node:process';

const CPUs = cpus();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for  ${CPUs.length} cpus`);
  // Fork workers.
  const workers = []
  for (let i = 0; i < CPUs.length; i++) {
    const worker = cluster.fork();
    workers.push(worker)
  }

  for (const id in workers) {
    workers[id].on('message', (data) => {
      console.log(data.message)
      workers[id].send(`i am primary, hello worker ${data.pid}`)
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`hello world\nWorker ${process.pid}`);
  }).listen(8000);
  console.log(`Worker ${process.pid} started`);
  process.send({ pid: process.pid, message: `i am worker ${process.pid} , hello primariy` });
  process.on('message', (res) => {
    console.log(res)
  })
}