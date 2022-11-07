import { useNavigate } from "@solidjs/router";
import { format } from "date-fns";
import { createEffect, createSignal, For } from "solid-js";
import { chat, ChatMessage } from "../state/ChatStore";

export function Message(props: { message: ChatMessage }){
    const { content, inbound, time } = props.message;
    return (
        <div style={{ "align-content": inbound ? 'flex-start' : 'flex-end' }} class="single-message">
            <span class="single-message-date">{format(time, 'dd/mm/yyyy HH:mm')}</span>
            <span class="single-message-content">{content}</span>
        </div>
    )
}

export function Thread(props: { deviceId: string }){
    const {deviceId} = props;
    const [ messages, setMessages ] = createSignal<Array<ChatMessage>>();
    const navigate = useNavigate();

    const lastMessage = messages()?.at(-1);

    createEffect(() => {
        const currentSessionMessages = chat.messages.get(deviceId);
        if(!!currentSessionMessages){
            setMessages(currentSessionMessages);
        }
    })

    return (
        <div onClick={e => navigate(`/chat/${deviceId}`)}>
            <div>{deviceId}</div>
            <div>
                {!!lastMessage ? <Message message={lastMessage} /> : "Not messages for this thread" }
            </div>
        </div>
    );
}

export default function Threads(){
    
    const [ sessions, setSessions ] = createSignal<Array<string>>();

    createEffect(() => {
        const sessionKeys = Array.from(chat.sessions.keys());
        if(!!sessionKeys){
            setSessions(sessionKeys);
        }
    });
    
    return (
        <For each={sessions()} fallback={<div>No thread so far</div>}>
            {(str: string) => <Thread deviceId={str} />}
        </For>
    );
}