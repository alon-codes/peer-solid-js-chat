import { useNavigate } from "@solidjs/router";
import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Grid from "@suid/material/Grid";
import List from "@suid/material/List";
import ListItem from "@suid/material/ListItem";
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
        <Grid onClick={e => navigate(`/chat/${deviceId}`)}>
            <Typography variant="subtitle1">{deviceId}</Typography>
            <Typography variant="caption">
                {/* BUG - Not showing the latest messages of the user */}
                {!!lastMessage() ? <Message message={lastMessage()} /> : "Not messages for this thread" }
            </Typography>
        </Grid>
    );
}

export default function Threads(){
    
    const [ sessions, setSessions ] = createSignal<Array<string>>();
    const navigate = useNavigate();

    createEffect(() => {
        const sessionKeys = Array.from(chat.sessions.keys());
        if(!!sessionKeys){
            setSessions(sessionKeys);
        }
    });
    
    return (
        <List>
            <For each={sessions()} fallback={<div>No thread so far</div>}>
                {(deviceId: string) => (
                    <ListItem onClick={e => navigate(`/chat/${deviceId}`)}>
                        <Thread deviceId={deviceId} />
                    </ListItem>
                )}
            </For>
        </List>
        
    );
}