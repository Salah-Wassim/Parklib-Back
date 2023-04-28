
class SocketIoService{
    static io = null;
    static socket = null;

    constructor(socketIo){
        this.io = socketIo;
        if (SocketIoService.io === null) {
            SocketIoService.io = this.io;
        }

        this.io.on('connection', socket => {
            console.log(`New connection ${socket.id}`);
            socket.on('disconnect', () => console.log('disconnected')); 
            
            if (SocketIoService.socket === null) {
                SocketIoService.socket = socket;
            }
        })
    }

}

module.exports = SocketIoService;  