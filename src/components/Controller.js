import { useState, useEffect, useRef } from "react"
import axios from "axios"
import useStore, { usePersistStore } from "../store"
import LeftRightIcon from "./icons/LeftRight"
import UpDownIcon from "./icons/UpDown"

const Controller = () => {

    const mode = usePersistStore(state => state.mode)
    const setMode = usePersistStore(state => state.setMode)
    const steeringRes = useRef(mode === "valet" ? 10 : 20)
    const speedRes = useRef(mode === "valet" ? 15 : 51)
    useEffect(() => {
        if (mode === "valet"){
            steeringRes.current = 10
            speedRes.current = 15
        }
        else {
            steeringRes.current = 20
            speedRes.current = 51
        }
    }, [mode])

    const toggleMode = () => {
        setMode(mode === "valet" ? "sport" : "valet")
    }
    
    const steeringBtnRef = useRef(null)
    const speedBtnRef = useRef(null)
    const [ steeringTouchStartX, setSteeringTouchStartX ] = useState(0)
    const [ steeringBtnLeft, setSteeringBtnLeft ] = useState(0)
    const [ speedTouchStartY, setSpeedTouchStartY ] = useState(0)
    const [ speedBtnTop, setSpeedBtnTop ] = useState(0)
    const steeringTouchId = useRef(null)
    const speedTouchId = useRef(null)

    const controlInterval = useRef(false)
    const [ steeringValue, setSteeringValue ] = useState(0)
    const steeringValueRef = useRef(steeringValue)
    useEffect(() => {
        steeringValueRef.current = steeringValue
    }, [steeringValue])
    const [ speedValue, setSpeedValue ] = useState(0)
    const speedValueRef = useRef(speedValue)
    useEffect(() => {
        speedValueRef.current = speedValue
    }, [speedValue])

    const serverBaseUrl = useStore(state => state.serverBaseUrl)
    const setConnected = useStore(state => state.setConnected)
    const lastServerPing = useRef(0)
    
    const handleTouchStart = e => {
        for (let i = 0; i < e.changedTouches.length; i++){
            const touch = e.changedTouches[i]

            if (touch.target === steeringBtnRef.current && steeringTouchId.current === null){
                steeringTouchId.current = touch.identifier
                setSteeringTouchStartX(touch.clientX)
            }
            else if (touch.target === speedBtnRef.current && speedTouchId.current === null){
                speedTouchId.current = touch.identifier
                setSpeedTouchStartY(touch.clientY)
            }
        }
    }

    const handleTouchMove = e => {
        for (let i = 0; i < e.changedTouches.length; i++){
            const touch = e.changedTouches[i]

            if (touch.identifier === steeringTouchId.current){
                const btnWidth = touch.target.clientWidth
                const maxX = Math.round(btnWidth/2)
                let x = touch.clientX-steeringTouchStartX
                if (x > maxX){
                    x = maxX
                }
                else if (x < -maxX){
                    x = -maxX
                }
                setSteeringBtnLeft(x)
                const newSteeringValue = Math.round(x/(maxX/steeringRes.current))
                setSteeringValue(newSteeringValue)
            }
            if (touch.identifier === speedTouchId.current){
                const btnHeight = touch.target.clientHeight
                const viewportHeight = window.innerHeight
                const maxY = Math.round((viewportHeight-btnHeight)/2)
                let y = touch.clientY-speedTouchStartY
                if (y > maxY){
                    y = maxY
                }
                else if (y < -maxY){
                    y = -maxY
                }
                setSpeedBtnTop(y)
                const newSpeedValue = -Math.round(y/(maxY/speedRes.current))
                setSpeedValue(newSpeedValue)
            }
        }
    }

    const handleTouchEnd = e => {
        for (let i = 0; i < e.changedTouches.length; i++){
            const touch = e.changedTouches[i]

            if (touch.identifier === steeringTouchId.current){
                steeringTouchId.current = null
                setSteeringTouchStartX(0)
                setSteeringBtnLeft(0)
                setSteeringValue(0)
            }
            else if (touch.identifier === speedTouchId.current){
                speedTouchId.current = null
                setSpeedTouchStartY(0)
                setSpeedBtnTop(0)
                setSpeedValue(0)
            }
        }
    }
    
    const setControl = useRef(async () => {
        if ((Date.now()-lastServerPing.current) < 40) return

        lastServerPing.current = Date.now()

        try {
            let query = ""
            
            const speedMultiplier = 20
            if (speedValueRef.current < 0){
                query = `-sp=${Math.abs(speedValueRef.current)*speedMultiplier}`
            }
            else if (speedValueRef.current > 0) {
                query = `sp=${speedValueRef.current*speedMultiplier}`
            }
            else {
                query = `sp=0`
            }
            query += `&st=${steeringValueRef.current}`
            await axios.get(`${serverBaseUrl}:8080/set-control?${query}`, {timeout: 50})
            setConnected(Date.now())
        }
        catch {}
    })
    
    useEffect(() => {
        if (!controlInterval.current && setControl.current){
            controlInterval.current = true
            controlInterval.current = setInterval(setControl.current, 50)
        }

        return () => {
            if (controlInterval.current){
                clearInterval(controlInterval.current)
            }
        }
    }, [])
    
    return (
        <>
            <div className="
                inline-block
                absolute
                z-[10]
                bottom-[7.5vh]
                left-1/2
                -translate-x-1/2
            ">
                <button type="button" onClick={() => window.location.reload()} className="
                    inline-block
                    align-middle
                    w-[20vh]
                    h-[8vh]
                    bg-[#222222]
                    active:bg-[#555555]
                    font-defaultBold
                    text-center
                    text-[2.2vh]
                    uppercase
                    text-[#999999]
                    active:text-[#ffffff]
                    rounded-[4px]
                    mr-[5vh]
                ">Refresh</button>
                <div className="
                    inline-block
                    align-middle
                    w-[28vh]
                    h-[8vh]
                    bg-[#222222]
                    rounded-[6px]
                    overflow-hidden
                    relative
                " onClick={toggleMode}>
                    <div className={`
                        block
                        w-1/2
                        h-full
                        absolute
                        z-[1]
                        top-0
                        ${mode === "valet" ? "left-0" : "left-1/2"}
                        duration-[.2s]
                        ease-in-out
                        p-[4px]
                    `}>
                        <div className="
                            block
                            w-full
                            h-full
                            bg-[#444444]
                            rounded-[4px]
                        "></div>
                    </div>
                    <div className={`
                        inline-block
                        w-1/2
                        leading-[8.3vh]
                        font-defaultBold
                        text-center
                        text-[2.2vh]
                        ${mode === "valet" ? "text-[#ffffff]" : "text-[#888888]"}
                        relative
                        z-[10]
                        uppercase
                        duration-[.2s]
                        ease-in-out
                    `}>valet</div>
                    <div className={`
                        inline-block
                        w-1/2
                        leading-[8.3vh]
                        font-defaultBold
                        text-center
                        text-[2.2vh]
                        ${mode === "valet" ? "text-[#888888]" : "text-[#ffffff]"}
                        relative
                        z-[10]
                        uppercase
                        duration-[.2s]
                        ease-in-out
                    `}>sport</div>
                </div>
            </div>
            <div className="
                block
                w-[30vh]
                h-[30vh]
                absolute
                z-[10]
                top-1/2
                -translate-y-1/2
                left-[15vh]
                overflow-visible
            ">
                <div
                    className={`
                        block
                        w-full
                        h-full
                        rounded-[50%]
                        border-[4px]
                        border-solid
                        border-[#444444]
                        relative
                        z-[10]
                    `}
                    ref={steeringBtnRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{left: `${steeringBtnLeft}px`}}
                ></div>
                <div className="
                    block
                    w-[30vh]
                    h-[30vh]
                    absolute
                    z-[1]
                    top-0
                    p-[5vh]
                    bg-[rgba(0,0,0,.8)]
                    rounded-[50%]
                " style={{left: `${steeringBtnLeft}px`}}><LeftRightIcon color="#999999"/></div>
            </div>
            <div className="
                block
                w-[30vh]
                h-[30vh]
                absolute
                z-[10]
                top-1/2
                -translate-y-1/2
                right-[10vh]
            ">
                <div
                    className="
                        block
                        w-[30vh]
                        h-[30vh]
                        rounded-[50%]
                        border-[4px]
                        border-solid
                        border-[#444444]
                        relative
                        z-[10]
                    "
                    ref={speedBtnRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{top: `${speedBtnTop}px`}}
                ></div>
                <div className="
                    block
                    w-[30vh]
                    h-[30vh]
                    absolute
                    z-[1]
                    left-0
                    p-[5vh]
                    bg-[rgba(0,0,0,.8)]
                    rounded-[50%]
                " style={{top: `${speedBtnTop}px`}}><UpDownIcon color="#999999"/></div>
            </div>
        </>
    )

}

export default Controller