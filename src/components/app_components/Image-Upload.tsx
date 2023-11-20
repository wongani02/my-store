'use client'

import { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import {CldUploadWidget} from 'next-cloudinary';


interface ImageUploadProps {
    disabled?: boolean
    onChange: (value: string)=>void
    onRemove: (value: string)=>void
    value: string[]
}
 
const ImageUpload: FunctionComponent<ImageUploadProps> = ({disabled, onChange, onRemove, value}) => {

    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    const onUpload = (result: any)=>{
        onChange(result.info.secure_url)
    }

    if (!isMounted){
        return null;
    }

    return ( 
        <div>
            <div className="flex items-center gap-4 mb-4">
                {value.map((url)=>(
                    <div key={url} className="relative rounded-md overflow-hidden w-[200px] h-[200px]">
                        <div className="z-10 absolute top-2 right-2">
                            <Button 
                            type="button"
                            onClick={()=>onRemove(url)}
                            variant={'destructive'}
                            size={'icon'}
                            >
                                <Trash className="w-4 h-4"/>
                            </Button>
                        </div>
                        <Image
                        src={url}
                        alt="billboard image"
                        className="object-cover"
                        fill
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
            onUpload={onUpload}
            uploadPreset="ucizk8jx"
            >
                {({open})=>{
                    const onClick = () =>{
                        open();
                    }

                    return (
                        <Button
                        variant={'secondary'}
                        disabled={disabled}
                        onClick={onClick}
                        type="button"
                        >
                            <ImagePlus className="mr-2 h-4 w-4"/>
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    );
}
 
export default ImageUpload;