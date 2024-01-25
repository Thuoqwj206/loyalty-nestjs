export default {
    url: 'redis://default:redispw@localhost:49153',
    onClientReady: (client) => {
        client.on('error', (err) => { }
        )
    },
}