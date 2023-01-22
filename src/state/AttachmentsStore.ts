import { ReactiveMap } from "@solid-primitives/map";
import { createStore } from "solid-js/store";

enum ChatAttachmentStatus {
    TRANSFERING,
    CANCELED,
    COMPLETED
}

interface ChatAttachment {
    filename: string;
    // KB
    size: number;
    time: Date;
    inbound?: boolean;
    progress: number;
    status: ChatAttachmentStatus;
}

interface AttachmentsStoreState {
    files: ReactiveMap<string, Array<ChatAttachment>>;
    currentlySending: Array<ChatAttachment>
     
}

export const [ attachments, setAttachments ] = createStore<AttachmentsStoreState>({
    files: new ReactiveMap,
    get currentlySending(){
        return Array.from(this.files.values()).filter((curFile) => curFile.)
    }
});