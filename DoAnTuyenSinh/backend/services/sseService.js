// backend/services/sseService.js
class SSEService {
    constructor() {
        this.clients = new Map();
    }

    addClient(channelKey, res) {
        if (!this.clients.has(channelKey)) {
            this.clients.set(channelKey, new Set());
        }
        this.clients.get(channelKey).add(res);
        console.log(`[SSE] Client connected: ${channelKey} (total: ${this.clients.get(channelKey).size})`);
    }

    removeClient(channelKey, res) {
        if (this.clients.has(channelKey)) {
            this.clients.get(channelKey).delete(res);
            if (this.clients.get(channelKey).size === 0) {
                this.clients.delete(channelKey);
            }
        }
        console.log(`[SSE] Client disconnected: ${channelKey}`);
    }

    broadcast(channelKey, eventName, data) {
        const clientSet = this.clients.get(channelKey);
        if (!clientSet || clientSet.size === 0) return;
        const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const res of clientSet) {
            if (!res.writableEnded) res.write(message);
        }
    }

    broadcastAll(eventName, data) {
        const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const [, clientSet] of this.clients) {
            for (const res of clientSet) {
                if (!res.writableEnded) res.write(message);
            }
        }
    }

    getConnectionCount(channelKey) {
        return this.clients.has(channelKey) ? this.clients.get(channelKey).size : 0;
    }

    getTotalConnections() {
        let total = 0;
        for (const [, clientSet] of this.clients) total += clientSet.size;
        return total;
    }
}

export default new SSEService();
