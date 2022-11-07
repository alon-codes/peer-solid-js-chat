import { ReactiveMap } from "@solid-primitives/map";
import Peer, { DataConnection } from "peerjs";
import { createStore } from 'solid-js/store';
import { v4 as uuid } from 'uuid';

export interface ChatMessage {
    deviceId: string;
    inbound: Boolean;
    content: string;
    time: Date;
}

interface ConnDescription {
    peer?: Peer;
    time: Date;
}

export interface ChatSession {
    dataConnection: DataConnection;
    messages: Array<ChatMessage>;
}

export interface ChatSessionState {
    sessions: ReactiveMap<string, DataConnection>;
    localDeviceId: string;
    peerConnection: ConnDescription | null;
    errors: Array<string>;
    messages: ReactiveMap<string, Array<ChatMessage>>;
    connected: boolean;
}

export const [ chat, setChatData ] = createStore<ChatSessionState>({
    sessions: new ReactiveMap(),
    localDeviceId: uuid(),
    peerConnection: null,
    errors: [],
    messages: new ReactiveMap(),
    connected: false
});

export const [ errors, setErrors ] = createStore<Array<string>>([]);