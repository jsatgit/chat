const server = require("./server");

require("./api");
require("./socket");

server.listen(3000);
