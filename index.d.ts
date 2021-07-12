import { FastifyPlugin } from 'fastify';
import { AsyncMqttClient } from 'async-mqtt';

export interface MqttClientOptions {
  host: string,
  port: number,
  keepalive: number,
  clientId: string,
  tls: boolean,
  rejectUnauthorized: boolean,
  cert: string,
  key: string,
  passphrase: string,
  ca: string[]
}

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module 'fastify' {
  interface FastifyInstance {
    mqtt: AsyncMqttClient
  }
}

// fastify-plugin automatically adds named export, so be sure to add also this type
// the variable name is derived from `options.name` property if `module.exports.myPlugin` is missing
export const mqttPlugin: FastifyPlugin<MqttClientOptions>;

// fastify-plugin automatically adds `.default` property to the exported plugin. See the note below
export default mqttPlugin;
