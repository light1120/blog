const ee = require("events");

class myEvent extends ee {}

const myEmitter = new myEvent();

myEmitter.on("newListener", (data) => {
  console.log("new listener:", data);
});
myEmitter.on("show", (value) => {
  console.log("show trigger:", value);
});
// myEmitter.on("something", async (value) => {
//   throw new Error("kaboom");
// });
myEmitter.emit("show", "test event");
myEmitter.emit("something");

// const ee1 = new ee({ captureRejections: true });
// ee1.on("something", async (value) => {
//   throw new Error("kaboom");
// });

// ee1.on("error", console.log);
