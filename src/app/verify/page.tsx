"use client"
import { Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from "../../styles/Verify.module.css"
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const Verify = () => {

    const [id, setId] = useState();

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const search = searchParams.get('id');
        setId(search);
        console.log("search: ", search);
    }, [id])

    const [formData, setFormData] = useState({
        code: ""
    })

    // form validation rules 
    const validationSchema = Yup.object().shape({
        code: Yup.string().required('Verification code is required'),
    });

    const { register, setValue, handleSubmit, formState } = useForm({ mode: "onChange", resolver: yupResolver(validationSchema) });
    const { errors } = formState

    const onSubmit = async (data: any) => {

        const userData = data;
        userData["id"] = id;

        await axios.post("http://localhost:3000/api/verify", data).then((response) => {
            console.log("response: ", response);
            toast.success('Verification Successfully');
            router.push("/home");
        }).catch((error) => {
            toast.error('Verification Failed, Invalid OTP');
        })
    }

    return (
        <div className={styles.main}>
            <h3>Verification Mail send you to your Registered Email Please Verify</h3>
            <form className={styles.formmain} onSubmit={handleSubmit(onSubmit)} >


                <Typography>Enter Verifiaction Code</Typography>
                <TextField size='small' type="number" {...register('code')} defaultValue={formData.code} onChange={(e) => setValue("code", e.target.value, { shouldValidate: true })} />
                <div className="invalid-feedback">{errors.code?.message}</div>

                <br />

                <Button variant='contained' type='submit' disabled={!formState.isValid}>{!formState.isValid && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Submit</Button>
            </form>
        </div >
    )
}


export default Verify