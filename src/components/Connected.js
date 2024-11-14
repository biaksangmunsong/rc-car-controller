import useStore from "../store"
import Controller from "./Controller"

const Connected = () => {
    
    const serverBaseUrl = useStore(state => state.serverBaseUrl)
    
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
            <img
                src={`${serverBaseUrl}:81/stream`}
                alt=""
                className="
                    block
                    h-[70vh]
                    absolute
                    top-[7vh]
                    left-1/2
                    -translate-x-1/2
                    z-[1]
                    object-contain
                    object-bottom
                    rounded-[20px]
                    border-[4px]
                    border-solid
                    border-[#444444]
                "
            />
            <Controller/>
        </div>
    )

}

export default Connected