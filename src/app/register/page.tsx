"use client"
import { Button, Link, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import styles from "../../styles/Register.module.css";
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    })

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Email is required"),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const { register, setValue, handleSubmit, formState } = useForm({ mode: "onChange", resolver: yupResolver(validationSchema) });
    const { errors } = formState

    const onSubmit = async (data: any) => {
        console.log("Data submitted");

        await axios.post("http://localhost:3000/api/register", data).then((response) => {
            toast.success('Register Successfully');
            console.log("response: ", response.data.result._id);
            router.push(`/verify?id=${response.data.result._id}`);
        }).catch((error) => {
            toast.error('User is Already Registered');
        })
    }

    return (
        <div className={styles.main}>
            <h1>Register</h1>
            <form className={styles.formmain} onSubmit={handleSubmit(onSubmit)} >

                <Typography>Email :</Typography>
                <TextField size='small' type="email" name='email' defaultValue={formData.email} onChange={(e) => setValue("email", e.target.value, { shouldValidate: true })} />
                <div>{errors.email?.message}</div>
                <Typography>Username :</Typography>
                <TextField size='small' type="text" {...register('username')} defaultValue={formData.username} onChange={(e) => setValue("username", e.target.value, { shouldValidate: true })} />
                <div className="invalid-feedback">{errors.username?.message}</div>


                <Typography>Password :</Typography>
                <TextField size='small' type="password"  {...register('password')} defaultValue={formData.password} onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })} />
                <div className="invalid-feedback">{errors.password?.message}</div>
                <br />

                <Button variant='contained' type='submit' disabled={!formState.isValid}>{!formState.isValid && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Submit</Button>
            </form>
            <Button component={Link} href="/login">
                Already Have an Account? Click here to Login
            </Button>
        </div >
    )
}

export default Register