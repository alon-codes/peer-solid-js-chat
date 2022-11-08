import { ReactiveMap } from "@solid-primitives/map";
import Peer, { DataConnection } from "peerjs";
import { chat, ChatMessage, setChatData } from "../state/ChatStore";

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

export function handelIncomingMessage(conn: DataConnection, d: any){
    console.log(`Received message from ${conn.peer}`, { d });
    if(typeof d === 'string'){
        console.log({ d, peer: conn.peer });

        addMessage(conn.peer, {
            content: d,
            time: new Date(),
            deviceId: conn.peer,
            inbound: true
        });
    }
}

export function addMessage(deviceId: string, chatMessage: ChatMessage){
    setChatData('messages', (prevMessagesMap) => {
        const currentMessages = prevMessagesMap.get(deviceId);
        console.log({ currentMessages });
        if(!currentMessages?.length){
            // TODO - check this scenario
            return prevMessagesMap.set(deviceId, [chatMessage]);
        }

        console.log({ r: [...currentMessages, chatMessage] });

        return prevMessagesMap.set(deviceId, [...currentMessages, chatMessage]);
    })
}

export function connectToPeerServer() {
    try {
        let peer = new Peer(chat.localDeviceId);
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
        })

        // With one of the clients
        peer.on('connection', conn => {
            console.log('Conncted to peer', { conn });
            
            conn.on('open', () => {
                setChatData('sessions', (prevSessions) => prevSessions.set(conn.peer, conn))
                console.log(`Connection with ${conn.peer}`)
                conn.on('data', (d) => handelIncomingMessage(conn, d));
            });
        });
    }
    catch (e) {
        console.log("Problem connecting to peer server", { e });
        addError(`Problem connecting to peer server`)
    }
}

export async function startConnection(deviceId: string) {

    return new Promise((resolve, reject) => {

        if (!chat.peerConnection || !chat.peerConnection.peer) {
            resolve(false);
            return;
        }

        if (!chat.sessions.has(deviceId)) {
            const conn: DataConnection = chat.peerConnection.peer.connect(deviceId);

            conn.on('open', () => {
                conn.on('data', (d) => handelIncomingMessage(conn, d));
                setChatData('sessions', (prevSessions) => prevSessions.set(deviceId, conn));
                resolve(true);
            })

            conn.on('error', (e) => {
                console.log("Problem calling", { e });
                addError(`Problem connecting with ${deviceId}`)
                reject(false);
            })
        } else {
            resolve(true);
        }
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

            console.log({ currentSession })

            if (!!currentSession) {
                currentSession.send(content);
                addMessage(deviceId, incomingMessage);
            }
        }
    }
    catch (e) {
        console.log("Problem sending message", { content, deviceId });
        addError(`Problem sending message to ${deviceId}`)
    }
}