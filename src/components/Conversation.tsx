import { useParams } from "@solidjs/router";
import { format } from "date-fns";
import { createEffect, createSignal, For } from "solid-js";
import { unwrap } from "solid-js/store";
import { sendMessage } from "../services/ChatService";
import { chat, ChatMessage } from "../state/ChatStore";
import { Message } from "./Threads";

export default function Conversation() {

    const params = useParams<{ id: string }>();
    const [content, setContent] = createSignal<string>("");

    function handleSubmit() {
        console.log({ id: params.id, content: content() })
        sendMessage(params.id, content());
        setContent("")
    }

    const [ messages, setMessages ] = createSignal<Array<ChatMessage>>();

    createEffect(() => {
        const currentSessionMessages = chat.messages.get(params.id);
        if(!!currentSessionMessages){
            setMessages(currentSessionMessages);
        }
    })

    console.log({ messages });

    return (
        <div class="flex container w-screen flex-col h-full justify-between">
            <div class="flex">
                <h2 class="text-bold">{params.id}</h2>
            </div>
            <div class="container flex flex-col">
                {!!messages() &&  (
                    <For each={messages()} fallback={<div>Chat currently empty</div>}>
                        {(curMsg) => <Message message={curMsg} />}
                    </For>
                )}
            </div>
            <div class="container flex flex-row justify-around">
                <div class="flex w-10/12">
                    <textarea class="rounded-lg w-full" name="content" id="content" value={content()} onKeyUp={e => setContent(e.currentTarget.value)} />
                </div>
                <div class="flex w-2/12">
                    <button class="rounded-lg  w-full bg-blue-300 px-2 mx-2" disabled={content().length <= 0} onClick={e => handleSubmit()}>Submit</button>
                </div>
                
            </div>
        </div>
    );
}