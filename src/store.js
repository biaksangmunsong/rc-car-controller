import { create } from "zustand"
import { persist } from "zustand/middleware"

const store = set => ({
    serverBaseUrl: "http://192.168.4.1",

    connected: 0,
    setConnected: millis => set(() => ({
        connected: millis
    }))
})

const persistStore = set => ({
    mode: "valet",
    setMode: m => set(() => ({
        mode: m
    }))
})

const useStore = create(store)
const usePersistStore = create(persist(persistStore, {
    name: "persist-store",
    getStorages: () => window.localStorage
}))

export default useStore
export { usePersistStore }
