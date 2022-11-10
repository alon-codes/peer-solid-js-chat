import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Threads from "./Threads";
import Button from "@suid/material/Button";
import TextField from "@suid/material/TextField";
import Grid from "@suid/material/Grid";
import FormLabel from "@suid/material/FormLabel";
import Stack from "@suid/material/Stack";
import { useTheme } from "@suid/material";

export default function Home(){
    const navigate = useNavigate();
    const [ id, setId ] = createSignal<string>("");

    async function startChat(){
        try {
            if(!!id() && id().length > 0){
                navigate(`/chat/${id()}`);
            }
        }
        catch(e){
            console.warn("Failed call", {e});
        }
    }

    function onIdChange(val: string){
        if(val.length === 36){
            setId(val);
        }
    }

    const theme = useTheme();

    return (
        <Stack direction="column">
            <Grid spacing={2} sx={{ paddingY: theme.spacing(2) }} container direction="column" item xs={6}>
                <Grid item xs={6}>
                    <TextField fullWidth label="Device Id" onChange={e => onIdChange(e.currentTarget.value)} id="device-id" name="device-id" />
                </Grid>
                <Grid container item xs={3}>
                    <Button variant="contained" disabled={id().length <= 0} onClick={e => startChat()}>
                        Connect
                    </Button>
                </Grid>
            </Grid>
            <Threads />
        </Stack>
    );
}