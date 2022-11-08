/* @refresh reload */
import { For, render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Router } from '@solidjs/router';
import { format } from 'date-fns';
import { chat } from './state/ChatStore';

render(() => (
    <div class="flex bg-blue-200 h-screen">
        <Router>
            <App />
            <For each={chat.errors}>
                {(curErr) => (
                    <div style={{ color: 'red' }}>
                        { curErr }
                    </div>
                )}
            </For>
            <div class="footer container fixed top-0 right-0 p-3 mx-auto text-center">
                
                <div>Your id: <b>{chat.localDeviceId}</b></div>
                {chat.peerConnection?.time && (
                    <div class="text-center">
                        Connected Since:
                        <b>{format(chat.peerConnection?.time, 'dd/MM/yyyy HH:mm')}</b>
                    </div>

                )}
            </div>
        </Router>
    </div>
), document.getElementById('root') as HTMLElement);
