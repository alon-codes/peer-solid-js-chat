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
        <div>
            <h2>{params.id}</h2>
            <div>
                {!!messages() &&  (
                    <For each={messages()} fallback={<div>Chat currently empty</div>}>
                        {(curMsg) => <Message message={curMsg} />}
                    </For>
                )}
            </div>
            <div>
                <textarea class="coneversation-content" name="content" id="content" value={content()} onKeyUp={e => setContent(e.currentTarget.value)} />
                <button disabled={content().length <= 0} class="submit" onClick={e => handleSubmit()}>Submit</button>
            </div>
        </div>
    );
}