import React, { useState, useEffect, useContext } from 'react'
import { CollapsibleItem, Collapsible, Icon } from 'react-materialize'
const Chatbox = () => {
    const [chats, setChats] = useState([])
    const [active_chats, setActive_chats] = useState([])
    const [search, setSearch] = useState([])
    useEffect(() => {
        fetch("/getchats", {

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json()).then(result => {
            // console.log(chats)
            setChats(result)
        })
        for (let index = 0; index < active_chats.length; index++) {
            active_chats[index].item = chats[active_chats[index].key_chat]
        }
    })
    const searchit = (e) => {

        fetch("/search-user", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: e.target.value.toLowerCase()
            })
        }).then(res => res.json()).then(result => {
            console.log(result)
     
            setSearch(result)
        })

    }
    const sendMessage = (e, key) => {
        e.preventDefault();
        console.log(e.target[0].value)
        var me = e.target[0].value
        fetch("/addchats", {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_person: active_chats[key].item.chat_person,
                chat_person_name: active_chats[key].item.chat_person_name,
                messages: {
                    sender: JSON.parse(localStorage.getItem("user"))._id,
                    sender_name: JSON.parse(localStorage.getItem("user")).name,
                    message: me
                }
            })
        }).then(res => res.json()).then(data => {
            console.log(key)
            active_chats[key].item.messages.push({
                sender: JSON.parse(localStorage.getItem("user"))._id,
                sender_name: JSON.parse(localStorage.getItem("user")).name,
                message: me
            })
            console.log(data)
        }).catch(err => {
            console.log(err)
        })
        e.target[0].value = ""
    }
    const setChat=(item)=>{
               fetch("/addchats",{
                method:"put",
                headers:{
                    "Authorization":"Bearer " + localStorage.getItem("jwt"),
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    chat_person:item._id,
                    chat_person_name:item.name,
                    messages:{
                        sender:JSON.parse(localStorage.getItem("user"))._id,
                        sender_name:JSON.parse(localStorage.getItem("user")).name,
                        message:""
                    }
                })
            }).then(res=>res.json()).then(data=>{
                console.log(data)
                
            })
            search.length = 0
    }
    const addactive = (item, key_chat) => {
        var check = false
        active_chats.forEach(element => {
            if (element.key_chat ==  key_chat)
                check = true;
        });
        
        if(active_chats.length==0)
        check=false
        if (check)
            return;
        active_chats.push({ key_chat: key_chat, item: item });
        setActive_chats(active_chats)
        
    }
    var chatHistory = document.getElementById("chatarea");
    if (chatHistory)
        chatHistory.scrollTop = chatHistory.scrollHeight
    return (
        <div style={{ position: "fixed", bottom: "0", right: "0" }}>
            {
                active_chats.map((item, index) => {
                    return (

                        <Collapsible accordion style={{ width: "14rem", display: "inline-block ", backgroundColor: "white" }} id="chatox" >
                            <CollapsibleItem
                                expanded={false}
                                header={item.item.chat_person_name}
                                icon={<Icon>filter_drama</Icon>}
                                node="div"
                                style={{ position: "relative" }}
                            ><div style={{ height: "12rem", overflow: "auto" }} id="chatarea">{
                                item.item.messages.map(message => {

                                    return (<div className="teal" style={{ margin: "0.5em", padding: "0.5em", border: "none", borderRadius: "5px", color: "white" }}>
                                        {message.sender == JSON.parse(localStorage.getItem("user"))._id ? <div style={{ textAlign: "right", wordWrap: "break-word" }}>{message.message}</div> : <div style={{ wordWrap: "break-word" }}>{message.message}</div>}
                                    </div>)
                                })
                            }
                                </div>
                                <div class="input-field col s6" style={{ position: "absolute", width: "100%", bottom: "0", marginBottom: "0" }}>
                                    <form onSubmit={(e) => { sendMessage(e, index) }}>
                                        <input id="icon_prefix2" class="materialize-textarea" placeholder="message here" style={{ marginBottom: "0" }} />
                                    </form>
                                </div>
                            </CollapsibleItem>

                        </Collapsible>

                    )
                })}
            <Collapsible accordion style={{ width: "14rem", display: "inline-block" }} id="chats_section">
                <CollapsibleItem
                    expanded={true}
                    header="Chats"
                    icon={<Icon>filter_drama</Icon>}
                    node="div"
                    style={{ position: "relative" }}
                >
                    {
                        search.map(item => {
                            return (
                                <div class="row" style={{ margin: "0" }}>
                                    <div class="col s12" style={{ padding: "0" }}>
                                        <div class="card-panel indigo" style={{ margin: "0" }} onClick={() => {setChat(item)}}>
                                            <span class="white-text">{item.name}</span>
                                        </div>
                                    </div>
                                </div>)
                        })
                    }
                    <div class="input-field col s6" style={{ position: "absolute", width: "100%", bottom: "0", marginTop: "0rem" }}>

                        <input id="icon_prefix2" class="materialize-textarea" placeholder="Search" onChange={(e) => { searchit(e) }} style={{ marginBottom: "0" }} />

                    </div>
                    <div style={{ height: "12rem", overflow: "auto" }}>
                        {
                            chats.map((item, key_chat) => {
                                return (
                                    <div class="row" style={{ margin: "0" }}>
                                        <div class="col s12" style={{ padding: "0" }}>
                                            <div class="card-panel teal" style={{ margin: "0" }} onClick={() => { addactive(item, key_chat) }}>
                                                <span class="white-text">{item.chat_person_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </CollapsibleItem>

            </Collapsible>
        </div>
    )
}

export default Chatbox;