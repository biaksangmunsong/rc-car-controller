import { useState } from "react"
import axios from "axios"
import useStore from "../store"
import SpinnerLight from "../images/spinner-light.gif"

const NotConnected = () => {

    const [ connecting, setConnecting ] = useState(false)
    const serverBaseUrl = useStore(state => state.serverBaseUrl)
    const connected = useStore(state => state.connected)
    const setConnected = useStore(state => state.setConnected)

    const connect = async () => {
        if (connecting || connected) return

        try {
            setConnecting(true)

            await axios.get(`${serverBaseUrl}:8080/ping`, {timeout: 1000})
            await axios.get(`${serverBaseUrl}/control?var=hmirror&val=1`)
            await axios.get(`${serverBaseUrl}/control?var=vflip&val=1`)
            await axios.get(`${serverBaseUrl}/control?var=framesize&val=2`)
            setConnecting(false)
            setConnected(Date.now())
        }
        catch {
            setConnecting(false)
        }
    }
    
    return (
        <div className="
            block
            w-full
            h-full
            absolute
            top-0
            left-0
            z-[10]
        ">
            <button type="button" className="
                block
                w-[200px]
                h-[50px]
                bg-[#222222]
                absolute
                top-1/2
                left-1/2
                -translate-x-1/2
                -translate-y-1/2
                rounded-[4px]
                font-defaultBold
                text-center
                text-[14px]
                text-[#ffffff]
                active:bg-[#444444]
            " onClick={connect}>
                {
                    connecting ?
                    <img src={SpinnerLight} alt="" className="
                        block
                        w-[20px]
                        mx-auto
                    "/> :
                    <span>Connect</span>
                }
            </button>
        </div>
    )

}

export default NotConnected