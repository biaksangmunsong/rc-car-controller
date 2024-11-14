const Icon = ({color}) => {

    return (
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M223 343.5V170H174.5L257 27.5L338 170H287V343.5H338L257 486L174.5 343.5H223Z" stroke={color} strokeWidth="20"/>
        </svg>
    )

}

export default Icon