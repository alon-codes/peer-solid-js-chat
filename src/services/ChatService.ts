import { ReactiveMap } from "@solid-primitives/map";
import Peer, { DataConnection } from "peerjs";
import { chat, ChatMessage, setChatData } from "../state/ChatStore";
import { v4 as uuid } from "uuid";

let prevTimeout: number;

// TODO - move to chat store
export function addError(msg: string) {
    setChatData('errors', prevErrors => [...prevErrors, msg]);

    if (!!prevTimeout) {
        clearTimeout(prevTimeout);
    }

    prevTimeout = setTimeout(() => {
        setChatData('errors', []);
    }, 1000);
}

export function handelIncomingMessage(conn: DataConnection, d: any) {
    console.log(`Received message from ${conn.peer}`, { d });
    if (typeof d === 'string') {
        console.log({ d, peer: conn.peer });

        addMessage(conn.peer, {
            content: d,
            time: new Date(),
            deviceId: conn.peer,
            inbound: true
        });

    }

    // TODO - support more message types
}

export function addMessage(deviceId: string, chatMessage: ChatMessage) {
    setChatData('messages', (prevMessagesMap) => {
        const currentMessages = prevMessagesMap.get(deviceId);
        console.log({ currentMessages });
        if (!currentMessages?.length) {
            // TODO - check this scenario
            return prevMessagesMap.set(deviceId, [chatMessage]);
        }

        console.log({ r: [...currentMessages, chatMessage] });

        return prevMessagesMap.set(deviceId, [...currentMessages, chatMessage]);
    })
}

export function connectToPeerServer() {
    try {
        // Checking for local device id
        let deviceId = sessionStorage.getItem('localDeviceId');

        if (!!deviceId && !!chat.localIdLocked) {
            setChatData('localDeviceId', deviceId);
        } else {
            deviceId = uuid();
            setChatData('localDeviceId', uuid());
        }

        let peer = new Peer(deviceId);
        // With Peer.js server
        peer.on('open', () => {
            setChatData('peerConnection', {
                time: new Date(),
                peer
            })
            setChatData('connected', true);
            console.log("Connected");
        });

        peer.on('close', () => {
            setChatData('connected', false);
        });

        
        peer.on('error', (e) => {
            console.error('Peer server error', { e });
            addError(e.message);
        })

        // With one of the clients
        peer.on('connection', conn => {
            console.log('Conncted to peer', { conn });

            conn.on('open', () => {
                setChatData('sessions', (prevSessions) => prevSessions.set(conn.peer, conn))
                console.log(`Connection with ${conn.peer}`)
                conn.on('data', (d) => handelIncomingMessage(conn, d));
            });

            conn.on('error', (e) => {
                console.error("Error with", { p: conn.peer, e });
            })
        });
    }
    catch (e) {
        console.log("Problem connecting to peer server", { e });
        addError(`Problem connecting to peer server`)
    }
}

export async function startConnection(deviceId: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

        console.log(`Calling ${deviceId}...`)

        if (!chat.peerConnection || !chat.peerConnection.peer) {
            console.warn("Peer connection not ready yet");
            resolve(false);
            return;
        }

        const prevConn = chat.sessions.get(deviceId);

        console.log({ prevConn });

        let existingConn: DataConnection;

        if (!prevConn || !prevConn.open) {
            // Creating new connection or replacing disconnected
            console.log("Conneting to device id - ", deviceId);
            existingConn = chat.peerConnection.peer.connect(deviceId);
            console.log("Problem with connection?", { existingConn });

            if(!!existingConn) {
                console.log("Registering session", { peer: existingConn.peer });
                setChatData('sessions', (prevSessions) => prevSessions.set(existingConn.peer, existingConn));
            } else {
                resolve(false);
            }

        } else {
            existingConn = prevConn;
        }

        console.log({ existingConn });

        // TODO - Find better place for those listeners
        existingConn.on('open', () => {
            existingConn.on('data', (d) => handelIncomingMessage(existingConn, d));
            console.log("Connection opened with another client", { deviceId })
            resolve(true);
        })

        // TODO - Find better place for those listeners
        existingConn.on('error', (e) => {
            console.log("Problem calling", { e });
            addError(`Problem connecting with ${deviceId}`)
            reject(false);
        })
    })
}

export function sendMessage(deviceId: string, content: string) {
    try {
        console.log("About to send data", { deviceId, content });

        if (!!chat.sessions.has(deviceId)) {
            const currentSession = chat.sessions.get(deviceId);

            const incomingMessage = {
                inbound: false,
                deviceId,
                content,
                time: new Date()
            }

            console.log({ currentSession, deviceId })

            if (!!currentSession) {
                currentSession.send(content);
                addMessage(deviceId, incomingMessage);
            }
        } else {
            console.warn("Not active session", { deviceId });
        }
    }
    catch (e) {
        console.log("Problem sending message", { content, deviceId });
        addError(`Problem sending message to ${deviceId}`)
    }
}
