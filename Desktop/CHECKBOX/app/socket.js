const { fetchCheckboxStates, storeCheckboxStates } = require('../database');

module.exports = (socketServer) => {
 
  socketServer.use((socket, next) => {
    require('./middleware/session')(socket.request, {}, next);
  });


  socketServer.use((socket, next) => {
    require('passport').initialize()(socket.request, {}, next);
  });


  socketServer.use((socket, next) => {
    require('passport').session()(socket.request, {}, next);
  });

 
  socketServer.on('connection', (clientSocket) => {
    if (!clientSocket.request.user) {
      return clientSocket.disconnect(true);
    }

    console.log('A new client has connected');

   
    fetchCheckboxStates()
      .then((checkboxStates) => {
        clientSocket.emit('initialState', checkboxStates);
      })
      .catch((error) => {
        console.error('Failed to load checkbox states:', error);
      });

  
    clientSocket.on('checkboxChange', async (update) => {
      const { index, checked } = update;
      try {
        const currentStates = await fetchCheckboxStates();
        currentStates[index] = checked;
        await storeCheckboxStates(currentStates);
        socketServer.emit('checkboxUpdate', update);
      } catch (error) {
        console.error('Failed to save checkbox states:', error);
      }
    });

   
    clientSocket.on('disconnect', () => {
      console.log('A client has disconnected');
    });
  });
};
