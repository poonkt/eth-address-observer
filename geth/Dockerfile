FROM ethereum/client-go:alltools-stable
WORKDIR /usr/ethereum
CMD [ "geth", "--datadir", "data", "--ethash.dagdir", "dagdir", "--syncmode", "fast", "--http", "--http.addr", "0.0.0.0", "--ws", "--ws.addr", "0.0.0.0", "--goerli", "--nousb" ]