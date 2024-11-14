const Icon = ({color}) => {

    return (
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M343 289H169.5V337.5L27 255L169.5 174V225H343V174L485.5 255L343 337.5V289Z" stroke={color} strokeWidth="20"/>
        </svg>
    )

}

export default Icon