import React, {useState} from "react";
import {
    Alert,
    Box,
    Button,
    Container, FormControl, FormHelperText,
    Grid, IconButton, InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {NavigateFunction, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {AuthAPI} from "../api/AuthAPI";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import yup from "../validation";
import {withBackdropLoading, WithBackdropLoadingProps} from "../componens/common/feedback/BackdropLoading";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    username: yup.string().required().min(5).max(50),
    email: yup.string().required().email(),
    password: yup.string().required().min(8).test(
        "test-strong-password",
        "yup.string.strongPassword",
            value => /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && !!value.match(/\W/)
    )
}).required()

export type SignUpFormData = yup.InferType<typeof schema>

interface SignUpProps extends WithBackdropLoadingProps {
}

const SignUp: React.FC<SignUpProps> = (props) => {
    const {
        openBackdropLoading,
        closeBackdropLoading,
    } = props


    const navigate: NavigateFunction = useNavigate()
    const {t} = useTranslation()
    const [errorMsg, setErrorMsg] = useState<string | undefined>()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<SignUpFormData>({
        resolver: yupResolver(schema)
    })

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit = (formData: SignUpFormData): void => {
        openBackdropLoading()
        AuthAPI.register(formData)
            .then(response => {
                setErrorMsg(undefined)
                if (response.isSuccessful) {
                    reset()
                    navigate('/ui/sign-in', {state: {snackbarMessage: t("user.successfullyRegistered")}})
                } else {
                    closeBackdropLoading()
                    setErrorMsg(response.errorMessage)
                }
            })
    }

    return (
        <Stack
            mt={3}
            direction="column"
            alignItems="center"
        >
            <Container
                maxWidth='sm'
            >
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        border: 1,
                        p: 3,
                        borderRadius: 2
                    }}
                >
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h4" textAlign='center'>
                                {t("user.register")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                {...register("firstName")}
                                fullWidth
                                size="small"
                                margin="none"
                                label={t("user.firstName")}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message ? t(errors.firstName?.message) : ''}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                {...register("lastName")}
                                fullWidth
                                size="small"
                                margin="none"
                                label={t("user.lastName")}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message ? t(errors.lastName?.message) : ''}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                {...register("username")}
                                fullWidth
                                size="small"
                                margin="none"
                                label={t("user.username")}
                                error={!!errors.username}
                                helperText={errors.username?.message ? t(errors.username?.message) : ''}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                {...register("email")}
                                fullWidth
                                size="small"
                                margin="none"
                                label={t("user.email")}
                                error={!!errors.email}
                                helperText={errors.email?.message ? t(errors.email?.message) : ''}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel required size="small"
                                            htmlFor="outlined-adornment-password">{t("user.password")}</InputLabel>
                                <OutlinedInput
                                    id="outlined-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
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
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                size="medium"
                                type="submit"
                                variant="contained"
                                endIcon={<ChevronRightIcon/>}
                            >
                                {t("user.register2")}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
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

export default withBackdropLoading(SignUp)