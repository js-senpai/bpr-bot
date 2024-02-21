export const streamToBuffer = async (stream) => {
  const chunks = [];

  await new Promise((resolve, reject) => {
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });

  return Buffer.concat(chunks);
};
