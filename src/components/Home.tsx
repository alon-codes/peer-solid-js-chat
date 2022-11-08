import { createSignal, onMount } from "solid-js";
import { connectToPeerServer, startConnection } from "../services/ChatService"
import Chat from "./Conversation";
import { v4 as uuid } from "uuid";
import { useNavigate } from "@solidjs/router";
import { format } from "date-fns";
import Threads from "./Threads";
import { chat } from "../state/ChatStore";

export default function Home(){
    const navigate = useNavigate();
    const [ id, setId ] = createSignal<string>("");

    async function startChat(){
        try {
            if(!!id() && id().length > 0){
                const res = await startConnection(id());
                console.log({ res });
                if(!!res){
                    navigate(`/chat/${id()}`);
                }
            }
        }
        catch(e){
            console.warn("Failed call", {e});
        }
    }

    return (
        <div class="container connect-form">
            <div class="flex flex-col w-1/4 my-4">
                <label for="device-id">Device ID</label>
                <input class="rounded-lg border border-blue-400 p-2" onKeyUp={e => setId(e.currentTarget.value)} id="device-id" name="device-id" />
            </div>
            <div class="container">
                <button class="button p-3 bg-blue-400 rounded-lg" disabled={id().length <= 0} onClick={e => startChat()}>Connect</button>
            </div>

            <Threads />
        </div>
    );
}