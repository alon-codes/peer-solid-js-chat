/* @refresh reload */
import { For, render } from 'solid-js/web';

import './index.css';
import App from './App';
import { Router } from '@solidjs/router';
import { format } from 'date-fns';
import { chat } from './state/ChatStore';
import Info from './components/Info';
import Container from '@suid/material/Container';
import { createTheme, ThemeProvider } from '@suid/material';
import { blueGrey, grey, lightBlue, purple, teal } from '@suid/material/colors';

const theme = createTheme({
    palette: {
        background: {
            default: blueGrey[200]
        },
        primary: {
            main: blueGrey[500]
        },
        secondary: {
            main: blueGrey[100]
        }
    }
})

render(() => (
    <ThemeProvider theme={theme}>
    <Container>
        <Router>
            <App />
            <For each={chat.errors}>
                {(curErr) => (
                    <div style={{ color: 'red' }}>
                        { curErr }
                    </div>
                )}
            </For>
        </Router>
    </Container>
    </ThemeProvider>
), document.getElementById('root') as HTMLElement);
