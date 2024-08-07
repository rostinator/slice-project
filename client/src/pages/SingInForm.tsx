import React, {useContext, useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Container, FormControl, FormHelperText, IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {yupResolver} from '@hookform/resolvers/yup';
import yup from "../validation";
import {useForm} from "react-hook-form";
import {AuthAPI} from "../api/AuthAPI";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useNavigate} from "react-router";
import {Link, useSearchParams} from "react-router-dom";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import {withBackdropLoading, WithBackdropLoadingProps} from "../componens/common/feedback/BackdropLoading";
import {useTranslation} from "react-i18next";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export const ERROR_MSG_SEARCH_PARAM = 'errorMsg'

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
}).required()

export type SignInFormData = yup.InferType<typeof schema>

const SignInForm: React.FC<WithBackdropLoadingProps> = ({openBackdropLoading, closeBackdropLoading}) => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const {t} = useTranslation()

    const {login} = useContext(AuthContext) as AuthContextType
    const [errorMsg, setErrorMsg] = useState<string | undefined | null>(searchParams.get(ERROR_MSG_SEARCH_PARAM))
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<SignInFormData>({
        resolver: yupResolver(schema)
    })

    localStorage.clear()

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    };


    const onSubmit = (formData: SignInFormData): void => {
        openBackdropLoading()
        AuthAPI.login(formData)
            .then(apiResponse => {
                if (apiResponse.isSuccessful && apiResponse.data) {
                    login(apiResponse.data)
                    navigate('/ui')
                } else {
                    setErrorMsg(t("user.invalidCredentials"))
                    closeBackdropLoading()
                }
            })
    }

    return (
        <Stack
            mt={3}
            direction='column'
            alignItems='center'
        >
            <Container
                maxWidth='xs'
            >
                <Stack
                    direction='column'
                    alignItems='center'
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        border: 1,
                        p: 3,
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h4">
                        {t("user.signIn")}
                    </Typography>
                    <TextField
                        {...register("username")}
                        fullWidth
                        size="small"
                        margin="normal"
                        label={t("user.username")}
                        error={!!errors.username}
                        helperText={errors.username?.message ? t(errors.username?.message) : ''}
                    />

                    <FormControl fullWidth>
                        <InputLabel size="small" htmlFor="outlined-adornment-password">{t("user.password")}</InputLabel>
                        <OutlinedInput
                            id="outlined-password"
                            type={showPassword ? 'text' : 'password'}
                            {...register("password")}
                            fullWidth
                            size="small"
                            margin="none"
                            label={t("user.password")}
                            error={!!errors.password}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {!!errors.password && (
                            <FormHelperText error id="password-error">
                                {errors.password?.message ? t(errors.password?.message) : ''}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <Button
                        fullWidth
                        size="medium"
                        type="submit"
                        variant="contained"
                        endIcon={<ChevronRightIcon/>}
                        sx={{
                            my: 1
                        }}
                    >
                        {t("user.signIn2")}
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 2
                        }}
                    >
                        <Typography variant='subtitle2' mr={1}>
                            {t("user.registerQuestion")}
                        </Typography>

                        <Link to='/ui/sign-up' color="inherit">
                            <Typography variant='subtitle2' color='inherit'>
                                {t("user.registerNow")}
                            </Typography>
                        </Link>
                    </Box>
                </Stack>

                {errorMsg &&
                    <Alert
                        severity='error'
                        sx={{
                            mt: 2,
                        }}
                    >
                        {errorMsg}
                    </Alert>
                }

            </Container>
        </Stack>
    )
}

export default withBackdropLoading(SignInForm)