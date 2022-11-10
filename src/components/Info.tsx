import { format } from "date-fns";
import Grid from "@suid/material/Grid";
import { chat } from "../state/ChatStore";
import { CopyButton } from "./Common";
import Container from "@suid/material/Container";
import { createSignal, onCleanup, onMount, from, createEffect, on, For } from "solid-js";
import { observable } from "solid-js";
import Stack from "@suid/material/Stack";
import Alert from "@suid/material/Alert";
import IconButton from "@suid/material/IconButton";
import { LockTwoTone } from "@suid/icons-material";
import { useTheme } from "@suid/material";
import { blue } from "@suid/material/colors";
import Typography from "@suid/material/Typography";

export default function Info() {

    function lockDeviceId(){
        if(!!chat.localDeviceId){
            sessionStorage.setItem('localDeviceId', chat.localDeviceId);
            sessionStorage.setItem('localIdLocked', 'true');
        }
    }

    const theme = useTheme();

    return (
        <div style={{ position: "fixed", right: 0, top: 0, width: 'auto', padding: theme.spacing(1) }}>
            <Grid justifyItems="center" alignItems="center" container>
                <Typography variant="caption">
                    Your id: <b>{chat.localDeviceId}</b>
                </Typography> 
                { !!chat.localDeviceId && <CopyButton value={chat.localDeviceId} /> }
                <IconButton size="small" onClick={e => lockDeviceId()}>
                    <LockTwoTone sx={{ color: chat.localIdLocked ? blue[400] : undefined }} />
                </IconButton>
            </Grid>
            <Grid container alignContent="space-between">
                {chat.peerConnection?.time && (
                    <Typography variant="caption">
                        Connected Since:
                        <b>{format(chat.peerConnection?.time, 'dd/MM/yyyy HH:mm')}</b>
                    </Typography>
                )}
            </Grid>
        </div>
    )
}