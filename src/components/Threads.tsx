import { useNavigate } from "@solidjs/router";
import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Grid from "@suid/material/Grid";
import Typography from "@suid/material/Typography";
import { format } from "date-fns";
import { createEffect, createSignal, For } from "solid-js";
import { chat, ChatMessage } from "../state/ChatStore";

export function Message(props: { message: ChatMessage }){
    const { content, inbound, time } = props.message;
    const color = inbound ? "bg-blue-300" : "bg-blue-400";
    const theme = useTheme();
    return (
        <Grid alignItems="center" alignContent={!inbound ? "flex-end" : "flex-start" } marginBottom={2} item xs={12}>
            <Typography marginRight={2} fontWeight="bold" variant="caption">
                {format(time, 'dd/M/yyyy HH:mm')}
            </Typography>
            <Typography variant="body1">{content}</Typography>
        </Grid>
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
            <h1 class="text-2xl">{deviceId}</h1>
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