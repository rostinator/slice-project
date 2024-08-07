import React, {useState} from "react";
import {CircularProgress, Stack} from "@mui/material";

export interface WithLoadingProps {
    startLoading(): void;
    stopLoading(): void;
}

export const withLoading = <T extends WithLoadingProps>(WrappedComponent: React.FC<T>) => {
    return (props: any) => {
        const [loading, setLoading] = useState<boolean>(true)

        const startLoading = () => {
            setLoading(true)
        }

        const stopLoading = () => {
            setLoading(false)
        }

        return (
            <>
                <WrappedComponent
                    {...props}
                    startLoading={startLoading}
                    stopLoading={stopLoading}
                />
                {loading &&
                    <Stack
                        mt='10%'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <CircularProgress color='primary'/>
                    </Stack>
                }
            </>
        )
    }
}