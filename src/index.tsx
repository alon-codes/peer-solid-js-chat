/* @refresh reload */
import { For, render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Router } from '@solidjs/router';
import { format } from 'date-fns';
import { chat } from './state/ChatStore';

render(() => (
    <Router>
         <App />
         <div style={{ position: 'fixed', bottom: 0, padding: '10px', margin: '10px'}} class="footer">
            <For each={chat.errors}>
                {(curErr) => (
                    <div style={{ color: 'red' }}>
                        { curErr }
                    </div>
                )}
            </For>
            <div>Your id: <b>{chat.localDeviceId}</b></div>
            {chat.peerConnection?.time && (
                <div>
                    Connected Since:
                    <b>{format(chat.peerConnection?.time, 'dd/MM/yyyy HH:mm')}</b>
                </div>

            )}
        </div>
    </Router>
), document.getElementById('root') as HTMLElement);
