import { FastifyPlugin } from 'fastify';
import { AsyncMqttClient } from 'async-mqtt';

/**
 * options to connect to broker via mqtt://
 */
interface MqttConnectionOption {
  host: string,
  port: number,
  keepalive: number,
  clientId: string,
  tls: false
} 

/**
 * options to connect to broker via mqtts://
 */
interface MqttsConnectionOption {
  host: string,
  port: number,
  keepalive: number,
  clientId: string,
  tls: true,
  rejectUnauthorized?: boolean,
  cert: string,
  key: string,
  passphrase?: string,
  ca?: string[]
}

export type MqttClientOptions = MqttConnectionOption | MqttsConnectionOption;

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module 'fastify' {
  interface FastifyInstance {
    mqtt: AsyncMqttClient
  }
}

// fastify-plugin automatically adds named export, so be sure to add also this type
// the variable name is derived from `options.name` property if `module.exports.myPlugin` is missing
export const fastifyMqtt: FastifyPlugin<MqttClientOptions>;

// fastify-plugin automatically adds `.default` property to the exported plugin. See the note below
export default fastifyMqtt;
