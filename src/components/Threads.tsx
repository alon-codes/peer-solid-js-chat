import { useNavigate } from "@solidjs/router";
import { format } from "date-fns";
import { createEffect, createSelector, createSignal, For } from "solid-js";
import { chat, ChatMessage } from "../state/ChatStore";

export function Message(props: { message: ChatMessage }){
    const { content, inbound, time } = props.message;
    const color = inbound ? "bg-blue-300" : "bg-blue-400";
    return (
        <div class={`flex flex-col ${color} container w-1/4 rounded-lg my-4 py-2 px-4`}>
            <span class="single-message-date font-bold">{format(time, 'dd/mm/yyyy HH:mm')}</span>
            <span class="single-message-content">{content}</span>
        </div>
    )
}

export function Thread(props: { deviceId: string }){
    const { deviceId } = props;
    const navigate = useNavigate();
    const [ lastMessage, setLastMessage ] = createSignal<ChatMessage>();

    createEffect(() => {
        setLastMessage(chat.messages.get(deviceId)?.at(-1));
    })

    return (
        <div class="s" onClick={e => navigate(`/chat/${deviceId}`)}>
            <div>{deviceId}</div>
            <div>
                {/* BUG - Not showing the latest messages of the user */}
                {!!lastMessage() ? <Message message={lastMessage()} /> : "Not messages for this thread" }
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