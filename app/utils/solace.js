
var TopicPublisher = function (solaceModule, topicName, newPublishedBlog,userInfo) {
    'use strict';
    var solace = solaceModule;
    var blog=newPublishedBlog;
    var user=userInfo;
    var publisher = {};
    publisher.session = null;
    publisher.topicName = topicName;

    // Logger
    publisher.log = function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
    };

    publisher.log('\n*** Publisher to topic "' + publisher.topicName + '" is ready to connect ***');

    // main function
    publisher.run = function (argv) {
        publisher.connect(argv);
    };

    // Establishes connection to Solace PubSub+ Event Broker
    publisher.connect = function (argv) {
        if (publisher.session !== null) {
            publisher.log('Already connected and ready to publish.');
            return;
        }

        var hosturl = process.env.SOLACE_URL;
        publisher.log('Connecting to Solace PubSub+ Event Broker using url: ' + hosturl);
        var username = process.env.SOLACE_USERNAME;
        publisher.log('Client username: ' + username);
        var vpn = process.env.SOLACE_VPN;
        publisher.log('Solace PubSub+ Event Broker VPN name: ' + vpn);
        var pass = process.env.SOLACE_PASS;
        // create session
        try {
            publisher.session = solace.SolclientFactory.createSession({
                url:      hosturl,
                vpnName:  vpn,
                userName: username,
                password: pass,
            });
        } catch (error) {
            publisher.log(error.toString());
        }
        // define session event listeners
        publisher.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            publisher.log('=== Successfully connected and ready to publish messages. ===');
            publisher.publish();
            // publisher.exit();
        });
        publisher.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
            publisher.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        publisher.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
            publisher.log('Disconnected.');
            if (publisher.session !== null) {
                publisher.session.dispose();
                publisher.session = null;
            }
        });
        // connect the session
        try {
            publisher.session.connect();
        } catch (error) {
            publisher.log(error.toString());
        }
    };

    // Publishes one message
    publisher.publish = function () {
        if (publisher.session !== null) {
            var messageText = `A new blog has been published with blog title is "${blog.title}" and author name is "${user.firstName} ${user.lastName}".`;
            var message = solace.SolclientFactory.createMessage();
            message.setDestination(solace.SolclientFactory.createTopicDestination(publisher.topicName));
            message.setBinaryAttachment(messageText);
            message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
            publisher.log('Publishing message "' + messageText + '" to topic "' + publisher.topicName + '"...');
            try {
                publisher.session.send(message);
                publisher.log('Message published.');
            } catch (error) {
                publisher.log(error.toString());
            }
        } else {
            publisher.log('Cannot publish because not connected to Solace PubSub+ Event Broker.');
        }
    };
    publisher.disconnect = function () {
        publisher.log('Disconnecting from Solace PubSub+ Event Broker...');
        if (publisher.session !== null) {
            try {
                publisher.session.disconnect();
            } catch (error) {
                publisher.log(error.toString());
            }
        } else {
            publisher.log('Not connected to Solace PubSub+ Event Broker.');
        }
    };

    return publisher;
};
  
  module.exports = TopicPublisher;