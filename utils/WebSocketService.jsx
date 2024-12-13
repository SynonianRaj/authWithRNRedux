class WebSocketService {
    static instance = null;
  
    constructor() {
      if (!WebSocketService.instance) {
        WebSocketService.instance = this;
        this.socket = null;
      }
      return WebSocketService.instance;
    }
  
    connect(receiverId) {
      const url = `ws://192.168.12.1:8000/ws/chat/${receiverId}/`;
      this.socket = new WebSocket(url);
  
      this.socket.onopen = () => console.log('WebSocket connected to:', url);
      
      this.socket.onclose = (event) => {
        console.log(`WebSocket closed with code ${event.code}`);
      };
      this.socket.onerror = (error) => console.error('WebSocket error:', error);
    }
  
    send(data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(data));
      } else {
        console.error('WebSocket is not connected');
      }
    }
  
    onMessage(callback) {
      if (this.socket) {
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          callback(data);
        };
      }
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  }
  
  const webSocketService = new WebSocketService();
  export default webSocketService;
  
