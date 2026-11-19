import { base, staticServer } from './static-server.mjs';

const port = Number(process.env.PORT ?? 4321);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port');
const server = await staticServer({ redirectRoot: true });
server.listen(port, '0.0.0.0', () => console.log(`JELET learning pilot preview on port ${port}, chapter base ${base}`));
