import '../App.css';
import Login from "./Login";
import useLocalStorage from "../hooks/useLocalStorage";
import Dashboard from "./Dashboard";
import {ContactProvider} from "../context/ContactProvider";
import {ConversationsProvider} from "../context/ConversationsProvider";
import {SocketProvider} from "../context/SocketProvider";

function App() {
    const [id, setId] = useLocalStorage("id");

    const dashboard = (
        <SocketProvider id={id}>
            <ContactProvider>
                <ConversationsProvider id={id}>
                    <Dashboard id={id}/>
                </ConversationsProvider>
            </ContactProvider>
        </SocketProvider>
    );

    return (
        id ? dashboard : <Login onIdSubmit={setId}/>
    );
}

export default App;
