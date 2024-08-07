import React, {createContext, PropsWithChildren} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";

export interface ApplicationContextType {
    openDrawer: boolean
    openOrCloseDrawer(): void
}

export const ApplicationContext = createContext<ApplicationContextType | null>(null)

export const ApplicationProvider: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [openDrawer, setOpenDrawer] = useLocalStorage<boolean>("OPEN_DRAWER", true)

    const openOrCloseDrawer = (): void => {
        setOpenDrawer(prevState => !prevState)
    }

    return (
        <ApplicationContext.Provider value={{openDrawer, openOrCloseDrawer}}>
            {props.children}
        </ApplicationContext.Provider>
    )

}