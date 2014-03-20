wait-for-stream
======

`npm install wait-for-stream`

A small utility to get exactly the amount of data you need from a stream. Instead of repeatedly calling `read` until the amount of data you wanted shows up, this does the waiting for you.

methods
=======

new Waiter(stream)
------------------

Creates a new Waiter on a stream.

wait.getBytes(length, cb)
----------------

Waits until `length` bytes are available on the stream, and calls `cb` with those bytes.

wait.getLength(lengthBytes, cb)
-----------------

Helper function which gets `lengthBytes` bytes and uses them as a big-endian, unsigned length to get some data. For example, if a TCP stream sends a 32 bit length followed by data of that length, `wait.getLength(4, ...)` will get the data for you. Valid values for `lengthBytes` are 1, 2, and 4. I decided to leave out 64 bit lengths as the loss of precision when converting to a JS number may result in intermittant errors. Plus, if you're waiting for more than 4GB of data on a stream, you should probably be using some other method...

examples
========

```javascript
var Waiter = require('wait-for-stream');

var stream = net.connect(); // or something
var wait = new Waiter(stream);

wait.getBytes(12, function(data) {
    console.log(data); // Twelve bytes from the stream
});

wait.getLength(2, function(data) { // Get a 2 byte length
    console.log(data); // 55 bytes of stuff
});
```

Notes
=====

Calling the methods repeatedly without waiting for earlier callbacks to return is perfectly safe. Just remember that the callbacks will get their data in the order the original calls were made.


