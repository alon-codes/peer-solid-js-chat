import { ReactiveMap } from '@solid-primitives/map';
import { Route, Router, Routes } from '@solidjs/router';
import CssBaseline from '@suid/material/CssBaseline';
import { parseISO } from 'date-fns';
import { Component, createEffect, createSignal, For, onMount } from 'solid-js';
import Conversation from './components/Conversation';
import Home from './components/Home';
import Info from './components/Info';
import { connectToPeerServer } from './services/ChatService';
import { chat, ChatMessage, errors, setChatData } from './state/ChatStore';
import { v4 as uuid } from "uuid";
import Alert from '@suid/material/Alert';

let count = 0;

const App: Component = () => {

  const [ displayErrors, setDisplayErrors ] = createSignal<Array<string>>();

  onMount(() => {
    connectToPeerServer();
    // Fetch messages from the cache
    const cached = sessionStorage.getItem('messages');

    console.log("Cached messsages", { cached });
    
    // TODO - Move to seperate function
    // Parsing from session storage JSON to JS objects
    if (!!cached) {
      const cachedObj = JSON.parse(cached);
      const devices = Array.from(Object.keys(cachedObj));
      console.log("Cached devices", { devices, cachedObj });

      const incomingMap = new ReactiveMap<string, ChatMessage[]>();

      
      devices.forEach((deviceId) => {
        let parsedMessages = cachedObj[deviceId].map((prev: Record<string, any>) => ({
          ...prev,
          time: parseISO(prev.time)
        }))
        incomingMap.set(deviceId, parsedMessages);
      });

      setChatData('messages', prev => incomingMap)
    }
  });

  createEffect(() => {
    // Store messages effect everytime Map changes
    console.log("Count msgs:", chat.messages.size);

    if (chat.messages.size > 0) {
      const obj = Object.fromEntries(chat.messages.entries());
      sessionStorage.setItem('messages', JSON.stringify(obj));
    }
  });

  createEffect(() => setDisplayErrors(chat.errors))

  return (
    <div class="container p-5 mx-auto">
      <Routes>
        <Route path="/" component={Home} />
        <Route path="chat/:id" component={Conversation} />
        <For each={displayErrors()}>
            {(curError) => (<Alert severity="warning">{curError}</Alert>)}
        </For>
      </Routes>
      <Info />
      <CssBaseline />
    </div>
  )
};

export default App;
