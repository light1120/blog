# Promise 




```js
class Scheduler {
  add(promiseCreator) { ... }
  // ...
}
   
const timeout = time => new Promise(resolve => {
  setTimeout(resolve, time);
})
  
const scheduler = new Scheduler();
  
const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

// output: 2 3 1 4
```