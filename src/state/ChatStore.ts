import { ReactiveMap } from "@solid-primitives/map";
import Peer, { DataConnection } from "peerjs";
import { createStore } from 'solid-js/store';

export interface ChatMessage {
    deviceId: string;
    inbound: Boolean;
    content: string;
    time: Date;
}

export interface ConnDescription {
    peer?: Peer;
    time?: Date;
}

export interface ChatSessionState {
    sessions: ReactiveMap<string, DataConnection>;
    localDeviceId: string | null;
    peerConnection: ConnDescription | null;
    errors: Array<string>;
    messages: ReactiveMap<string, Array<ChatMessage>>;
    connected: boolean;
    localIdLocked: boolean;
}

export const [ chat, setChatData ] = createStore<ChatSessionState>({
    sessions: new ReactiveMap(),
    localDeviceId: "",
    peerConnection: null,
    errors: [],
    messages: new ReactiveMap(),
    connected: false,
    get localIdLocked(){
        return !!sessionStorage.getItem('localIdLocked');
    }
});

export const [ errors, setErrors ] = createStore<Array<string>>([]);