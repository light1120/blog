import dgram from "dgram";

const client = dgram.createSocket("udp4");

client.send(Buffer.from("test msg"), 8000, "127.0.0.1", (err) => {
  client.close();
});
