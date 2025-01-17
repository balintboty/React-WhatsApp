import React, {useCallback, useContext, useEffect, useState} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import {useContact} from "./ContactProvider";
import {useSocket} from "./SocketProvider";


const ConversationsContext = React.createContext();

export const useConversations = () => {
    return useContext(ConversationsContext);
};

export const ConversationsProvider = ({id, children}) => {
    const [conversations, setConversations] = useLocalStorage('conversations', []);
    const {contacts} = useContact();
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
    const socket = useSocket();

    const createConversation = (recipients) => {
        setConversations(prevConversations => {
            return [...prevConversations, {recipients, messages: []}]
        });
    };

    const addMessageToConversation = useCallback(({recipients, text, sender}) => {
        setConversations(prevConversations => {
            let madeChange = false;
            const newMessage = {sender, text};
            const newConversations = prevConversations.map(
                conversation => {
                    if (arrayEquality(conversation.recipients, recipients)) {
                        madeChange = true;
                        return {
                            ...conversation,
                            messages: [...conversation.messages, newMessage]
                        }
                    }
                    return conversation;
                }
            )

            if (madeChange) {
                return newConversations;
            } else {
                return [...prevConversations, {recipients, messages: [newMessage]}]
            }
        })
    }, [setConversations]);

    useEffect(() => {
        if (socket==null) return
        socket.on('receive-message', addMessageToConversation)
        return () => socket.off('receive-message');
    },[socket, addMessageToConversation]);

    const sendMessage = (recipients, text) => {
        socket.emit('send-message', {recipients, text});
        addMessageToConversation({recipients, text, sender: id});
    };

    const formattedConversations = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => {
                return contact.id === recipient;
            })
            const name = (contact && contact.name) || recipient
            return {id: recipient, name};
        })

        const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
                return contact.id === message.sender;
            })
            const name = (contact && contact.name) || message.sender;
            const fromMe = id === message.sender;
            return {...message, senderName: name, fromMe};
        })

        const selected = index === selectedConversationIndex
        return {...conversation, messages, recipients, selected};
    })

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation
    }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
};

const arrayEquality = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    arr1.sort();
    arr2.sort();
    return arr1.every((element, index) => {
        return element === arr2[index]
    });
}
