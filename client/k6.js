import http from 'k6/http';

import protobuf from './protobuf/protobuf.js';

const proto = open('../proto/echo/echo.proto');

export default function () {
  const root = protobuf.parse(proto).root;

  // console.log(JSON.stringify(root, null, 2));

  // Obtain a message type
  const echoRequest = root.lookupType("echo.EchoRequest");
  const echoResponse = root.lookupType("echo.EchoResponse");

  // Example payload
  const payload = { name: "k6" };

  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  const errMsg = echoRequest.verify(payload);
  if (errMsg)
      fail(errMsg);
  // TM - above never fails - 

  // Create a new message
  const message = echoRequest.create(payload);
  console.log('message: ' + JSON.stringify(message));
  // TM - if I supply "Name" instead of "name" in the payload, message here is {} (I would expect verify to fail)

  // Encode a message to an Uint8Array
  const buffer = echoRequest.encode(message).finish();
  console.log('buffer: ' + JSON.stringify(buffer));
  // TM - buffer is object: {"0":10,"1":2,"2":107,"3":54}
  const uint8array = new Uint8Array(buffer);

  let res = http.post('http://localhost.:8080/echo', uint8array.buffer, { 
    headers: { 
      'Content-Type': 'application/octet-stream' 
    },
    responseType: 'binary'
  });

  const resMessage = echoResponse.decode(new Uint8Array(res.body));
  console.log('resMessage: ' + JSON.stringify(resMessage));
}