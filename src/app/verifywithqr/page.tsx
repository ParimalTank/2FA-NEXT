"use client"
import { Button, TextField, Typography } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "../../styles/verifywithqr.module.css"
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast'
import QRCode from "qrcode";

const VerifyWithQr = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [qr, getQr] = useState();
    const [otp, setOtp] = useState();
    const [email, setEmail] = useState();

    useEffect(() => {
        const qrUrl = searchParams.get('qr');
        const userEmail = searchParams.get("email");
        console.log("userEmail: ", userEmail);
        setEmail(userEmail);

        // Converting the data into base64
        QRCode.toDataURL(qrUrl, function async(err, code) {
            if (err) return console.log("error occurred")

            // Printing the code
            getQr(code);
        })
    }, [qr, email]);

    const [formData, setFormData] = useState({
        otp: ""
    })

    // form validation rules 
    const validationSchema = Yup.object().shape({
        otp: Yup.string().required('OTP is required')
    });

    const { register, setValue, handleSubmit, formState } = useForm({ mode: "onChange", resolver: yupResolver(validationSchema) });
    const { errors } = formState

    const onSubmit = async (data: any) => {

        setOtp(data.otp);
        console.log("data.otp: ", data.otp);

        const userData = {
            otp: data.otp,
            email: email
        }

        await axios.post("http://localhost:3000/api/verifywithqr", userData).then((response) => {
            console.log("response: ", response);
            toast.success("User Verify Successfully");
            router.push("/home");
        }).catch((error) => {
            toast.error('Invalid Otp');
        })
    }

    return (
        <div className={styles.main}>
            <h1>Verification</h1>
            <form className={styles.formmain} onSubmit={handleSubmit(onSubmit)} >
                <div>
                    <img src={qr} alt="qrcode" />
                </div>
                <Typography>Enter OTP :</Typography>
                <TextField size='small' type="number" name='otp' defaultValue={formData.otp} onChange={(e) => setValue("otp", e.target.value, { shouldValidate: true })} />
                <div>{errors.otp?.message}</div>
                <br />

                <Button variant='contained' type='submit' disabled={!formState.isValid}>{!formState.isValid && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Submit
                </Button>
            </form>
        </div >
    )
}

export default VerifyWithQr