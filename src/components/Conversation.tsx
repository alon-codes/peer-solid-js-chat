import { useParams } from "@solidjs/router";
import { useTheme } from "@suid/material";
import Button from "@suid/material/Button";
import Card from "@suid/material/Card";
import { blueGrey, green, grey, lightGreen } from "@suid/material/colors";
import Grid from "@suid/material/Grid";
import List from "@suid/material/List";
import ListItem from "@suid/material/ListItem";
import ListItemText from "@suid/material/ListItemText";
import Paper from "@suid/material/Paper";
import Stack from "@suid/material/Stack";
import TextField from "@suid/material/TextField";
import Typography from "@suid/material/Typography";
import { createEffect, createSignal, For, from, on, onMount, observable, createReaction } from "solid-js";
import { sendMessage, startConnection } from "../services/ChatService";
import { chat, ChatMessage } from "../state/ChatStore";
import { CopyButton } from "./Common";
import { Message } from "./Threads";

export default function Conversation() {

    const params = useParams<{ id: string }>();
    const [content, setContent] = createSignal<string>("");
    const [isOnline, setOnline] = createSignal<boolean>(false);
    const [messages, setMessages] = createSignal<Array<ChatMessage>>();

    let itemsListRef: any;

    function handleSubmit() {
        console.log({ id: params.id, content: content() })
        sendMessage(params.id, content());
        setContent("")
        if (!!itemsListRef) {
            //itemsListRef.scrollIntoView();
        }
    }

    // Messages from store effect
    createEffect(() => {
        const currentSessionMessages = chat.messages.get(params.id);
        if (!!currentSessionMessages) {
            setMessages(currentSessionMessages);
        }
    });

    let conn = chat.sessions.get(params.id);

    // Tracking online status from session
    createEffect(() => {
        const session = chat.sessions.get(params.id);
        if (!!session) {
            session.on('open', () => {
                console.log('Connection closed with ', params.id);
                setOnline(true);
            });
            session.on('close', () => {
                console.log('Connection closed with ', params.id);
                setOnline(false);
            });
            session.on('error', (e) => {
                console.error('Connection error with ', { id: params.id, e });
                setOnline(false)
            });
        }
    });

    onMount(async () => {
        // BUG - find better way to solve it!
        // Find a way to subscribe to chat.peerConnection for updates
        setTimeout(async () => {
            if (!!chat.peerConnection && !!chat.peerConnection.peer) {
                const res = await startConnection(params.id);
                setOnline(res);
            }
        }, 500);
    });


    console.log({ messages });

    const theme = useTheme();
    
    // TODO - convert from hardcoded pixels to theme.spacing()

    return (
        <Grid sx={{ position: "relative", height: `calc(100vh - 85px)`, paddingTop: theme.spacing(6) }} item xs={12} container flexDirection="column">
            <Stack sx={{ position: "fixed", top: 0, height: theme.spacing(5), marginBottom: theme.spacing(4.5), paddingTop: theme.spacing(1) }} direction="column">
                <Grid container>
                    <Typography variant="h6">{params.id}</Typography>
                    <CopyButton value={params.id} />
                </Grid>
                <Typography color={!!isOnline() ? green[800] : blueGrey[400]}>
                    {!!isOnline() ? 'Online' : 'Offline'}
                </Typography>
            </Stack>

            <Grid  sx={{ overflowY: "scroll", height: "100vh", marginTop: theme.spacing(3) }} alignContent="flex-start" container>
                {!!messages() && (
                    <For each={messages()} fallback={
                        <Typography variant="body2">Chat currently empty</Typography>
                    }>
                        {(curMsg, i) => (
                            <Message message={curMsg} />
                        )}
                    </For>
                )}
            </Grid>
            <Grid alignContent="center" justifyItems="center" alignItems="center" justifyContent="center" item xs={9} sx={{ position: "fixed", bottom: 0, paddingY: theme.spacing(2) }} container>
                <Grid item xs={10}>
                    <TextField maxRows={1} fullWidth name="content" id="content" value={content()} onChange={e => setContent(e.currentTarget.value)} />
                </Grid>
                <Grid container item xs={2}>
                    <Button sx={{ height: theme.spacing(7) }} variant="contained" fullWidth disabled={content().length <= 0} onClick={e => handleSubmit()}>Submit</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}