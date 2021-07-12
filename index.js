// @ts-check

import * as fastify from "fastify";
import mqtt from "async-mqtt";
import fp from "fastify-plugin";
import fs from "fs";

/**
 * @typedef { import("./index").MqttClientOptions } MqttClientOptions
 */

/**
 * Fastify MQTT client plugin
 *
 * @param {fastify.FastifyInstance} fastify
 * @param {MqttClientOptions} options
 * @param {CallableFunction} next
 */
function fastifyMqtt(fastify, options, next) {

  const broker_host = options.host;
  delete options.host;

  const broker_port = options.port;
  delete options.port;

  if (!broker_host || !broker_port) {
    next(new Error('`host` and `port` parameter are mandatory'));
    return;
  }

  const tls_enabled = options.tls;
  const broker_url = `${tls_enabled ? 'mqtts' : 'mqtt'}://${broker_host}:${broker_port}`;

  if (tls_enabled) {
    const { key, cert, ca } = options;
    if (!key || !cert || !ca) {
      next(new Error('`key`, `cert` or `ca` parameter missing'));
      return;
    }

    options.key = fs.readFileSync(key, { encoding: 'utf8' });
    options.cert = fs.readFileSync(cert, { encoding: 'utf8' });
    options.ca = ca.map(c => fs.readFileSync(c, { encoding: 'utf8' }));
  }

  fastify.log.info(`Connecting to MQTT broker at ${broker_url}`);

  mqtt.connectAsync(`${broker_url}:${broker_port}`, options)
    .then((client) => {

      fastify.addHook('onClose', (instance, done) => {
        fastify.log.info(`Disconnect from MQTT broker at ${broker_url}`);
        instance.mqtt.end().then(done);
      });

      if (!fastify.mqtt) {
        fastify.decorate('mqtt', client);
      }

      fastify.log.info(`Connected to MQTT broker at ${broker_url}`);
      next();
    })
    .catch((err) => {
      fastify.log.error(err);
      next(err);
    });
};

export default fp(fastifyMqtt, { name: 'fastify-mqtt' });
