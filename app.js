<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js"></script>
 
    const mqttBroker = "wss://5908c37de7ba426eb250b9aac54fa08f.s1.eu.hivemq.cloud:8884/mqtt";
    const mqttUsername = "houda";
    const mqttPassword = "Youssefyassine108";
    const clientId = "webClient";

    let client;

    // Initialiser le client MQTT
    function initMqttClient() {
      client = new Paho.MQTT.Client(mqttBroker, clientId);

      client.onConnectionLost = function (responseObject) {
        if (responseObject.errorCode !== 0) {
          console.log("Connexion perdue: " + responseObject.errorMessage);
        }
      };

      client.onMessageArrived = function(message) {
        if (message.destinationName === "smart_irrigation/temperature") {
          document.getElementById("tempValue").value = message.payloadString + " °C";
        } else if (message.destinationName === "smart_irrigation/humidity") {
          document.getElementById("humidityValue").value = message.payloadString + " %";
        } else if (message.destinationName === "smart_irrigation/ir_alert") {
          document.getElementById("alert").innerText = message.payloadString;
        }
      };

      client.connect({
        onSuccess: onConnect,
        userName: mqttUsername,
        password: mqttPassword,
        useSSL: true,
        onFailure: function (error) {
          console.log("Échec de connexion: ", error.errorMessage);
        }
      });
    }

    function onConnect() {
      console.log("Connecté au broker MQTT");
      client.subscribe("smart_irrigation/temperature");
      client.subscribe("smart_irrigation/humidity");
      client.subscribe("smart_irrigation/ir_alert");
    }

    function controlDevice(topic, message) {
      if (client && client.isConnected()) {
        const mqttMessage = new Paho.MQTT.Message(message);
        mqttMessage.destinationName = topic;
        client.send(mqttMessage);
      } else {
        console.log("Client MQTT non connecté. Impossible d'envoyer le message.");
      }
    }

    function toggleLED(state) {
      controlDevice("smart_irrigation/led", state);
    }

    function toggleRelay(state) {
      controlDevice("smart_irrigation/relay", state);
    }

    // Initialiser le client MQTT au chargement de la page
    window.onload = function() {
      initMqttClient();
    };