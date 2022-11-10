import ContentCopy from "@suid/icons-material/ContentCopy";
import IconButton from "@suid/material/IconButton";
import { chat, setChatData } from "../state/ChatStore";
import { copyToClipboard } from "../Utils";

interface CopyButtonProps {
    value: string;
}

export function CopyButton(props: CopyButtonProps){
    const { value } = props;    

    return (
        <IconButton
            size="small"
            onClick={e => async () => {
                try {
                    await copyToClipboard(value);
                    setChatData('errors', (prevErrors) => [...prevErrors].concat('Copied to clipboard'))
                }
                catch(e){
                    console.warn("Copy to clipboard failed", { e });
                }
            }}>
            <ContentCopy />
        </IconButton>
    )
}