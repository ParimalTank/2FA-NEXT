"use client"
import { Button, Link, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import styles from "../../styles/Login.module.css";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Login = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().required('Password is required')
    });

    const { register, setValue, handleSubmit, formState } = useForm({ mode: "onChange", resolver: yupResolver(validationSchema) });
    const { errors } = formState

    const onSubmit = async (data: any) => {

        await axios.post("http://localhost:3000/api/login", data).then((response) => {

            router.push(`/verifywithqr?qr=${response.data.data.stringdata}&email=${response.data.data.email}`);
            // router.push(`/verify?id=${response?.data?.data?.userId}`);
        }).catch((error) => {
            toast.error('User Does Not Exist');
        })
    }

    return (
        <div className={styles.main}>
            <h1>Login</h1>
            <form className={styles.formmain} onSubmit={handleSubmit(onSubmit)} >

                <Typography>Email :</Typography>
                <TextField size='small' type="email" name='email' defaultValue={formData.email} onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })} />
                <div>{errors.email?.message}</div>

                <Typography>Password :</Typography>
                <TextField size='small' type="password"  {...register('password')} defaultValue={formData.password} onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })} />
                <div className="invalid-feedback">{errors.password?.message}</div>
                <br />

                <Button variant='contained' type='submit' disabled={!formState.isValid}>{!formState.isValid && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Submit
                </Button>
            </form>
            <Button component={Link} href="/register">
                Don't Have Account? Click here to register
            </Button>
        </div >
    )
}

export default Login