const IPFS = require("ipfs");

const metodos = {
  insertar: comando => {
    const node = new IPFS();

    return new Promise(resolve => {
      node.on("ready", async () => {
        const filesAdded = await node.files.add({
          path: comando.nombre,
          content: Buffer.from(comando.contenido)
        });

        resolve({ path: filesAdded[0].path, hash: filesAdded[0].hash });
        node.stop(() => {});
      });
    });
  },
  leer: hash => {
    const node = new IPFS();

    return new Promise((resolve, reject) => {
      node.on("ready", async () => {
        const fileBuffer = await node.files.cat(hash);
        resolve(fileBuffer.toString());
        node.stop(() => {});
      });
    });
  }
};
export default metodos;
