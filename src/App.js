import { useEffect } from "react"
import { App as NativeApp } from "@capacitor/app"
import useStore from "./store"
import Connected from "./components/Connected"
import NotConnected from "./components/NotConnected"

const App = () => {
	
	const connected = useStore(state => state.connected)

	// handle back button
	useEffect(() => {
		NativeApp.addListener("backButton", () => {
			if (window.location.pathname !== "/" || window.location.search){
				window.history.back()
			}
			else {
				NativeApp.exitApp()
			}
		})
	}, [])
	
	return (
		<div className="
			block
			w-full
			h-full
			fixed
			z-[10]
			top-0
			left-0
			overflow-hidden
		">
			{
				connected ?
				<Connected/> :
				<NotConnected/>
			}
		</div>
	)

}

export default App