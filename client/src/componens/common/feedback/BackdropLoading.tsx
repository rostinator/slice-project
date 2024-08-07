import React, {useState} from "react";
import {Backdrop, CircularProgress} from "@mui/material";


export interface WithBackdropLoadingProps {
    openBackdropLoading(): void;
    closeBackdropLoading(): void;
}

export const withBackdropLoading = <T extends WithBackdropLoadingProps>(WrappedComponent: React.FC<T>) => {
    return (props: any) => {
        const [open, setOpen] = useState<boolean>(false)

        const openBackdropLoading = () => {
            setOpen(true)
        }

        const closeBackdropLoading = () => {
            setOpen(false)
        }

        return (
            <>
                <WrappedComponent
                    {...props}
                    openBackdropLoading={openBackdropLoading}
                    closeBackdropLoading={closeBackdropLoading}
                />
                <Backdrop open={open}
                          sx={{
                              backgroundColor: "rgba(0,0,0,0.16)",
                              zIndex: (theme) =>
                                  Math.max.apply(Math, Object.values(theme.zIndex)) + 1,
                          }}
                >
                    <CircularProgress color='primary'/>
                </Backdrop>
            </>
        )
    }
}