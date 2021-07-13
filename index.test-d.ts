import fastify from 'fastify';
import fastifyMqtt from '../fastify-mqtt';

const app = fastify();

app
  .register(fastifyMqtt, {
    host: "localhost",
    port: 3000,
    clientId: "test",
    keepalive: 300,
    tls: false
  })
  .after(async (err) => {
    const mqttClient = app.mqtt;
  });
