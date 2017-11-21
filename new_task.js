#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || " mal dein Gesicht!";
    console.log('args: ', );
    // var msg = ' mal dein Gesicht'
    var counter = 0;
    ch.assertQueue(q, {durable: true});

    setInterval( () = > {
        var send_msg = '' + (counter++) + msg;
        ch.sendToQueue(q, new Buffer(send_msg), {persistent: true});
        console.log(" [x] Sent '%s'", msg);
    }
  });
  //setTimeout(function() { conn.close(); process.exit(0) }, 500);
});