'use client'

import Heading from "@/components/app_components/Heading";
import AlertModal from "@/components/app_components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { Flashlight, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';

interface SettingsFormProps {
    initialData: Store,
}



const formSchema = z.object({
    name: z.string().min(1)
});

type settingsFormSchemaType = z.infer<typeof formSchema>
 
const SettingsForm: FunctionComponent<SettingsFormProps> = ({initialData}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();

    const form = useForm<settingsFormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData.name,
        }
    })

    const onSubmit = async(data: settingsFormSchemaType) =>{
        try {
            console.log(data)
            await axios.patch(`/api/stores/${params.store_Id}/`, data);

            toast({
                title: 'Store Updated successfully',
                description: 'Your store has been updated!',
            });

            router.refresh();

        }catch(e){
            toast({
                title: 'Ooops Something went wrong',
                description: 'Failed to update store, please try again later!',
                variant: 'destructive'
            })
        }
    }

    const onDelete = async () =>{
        try{

            setLoading(true);

            axios.delete(`/api/stores/${params.store_Id}`);

            router.push('/')
            window.location.assign(`/`)

            toast({
                title: 'Store Deleted',
                description: 'Your Store has been deleted successfully',
            })

        }catch(e){
            console.log(e)
            toast({
                title: 'Ooops Somthing went wrong!!',
                description: 'Make sure you have deleted all products',
                variant: 'destructive',
            });

        }finally{
            setLoading(false);
        }
    }

    return ( 
        <>
            <AlertModal
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={()=>{onDelete()}}
            loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                title='Settings'
                description='Manage Store preferences'
                />
                <Button 
                disabled={form.formState.isSubmitting}
                className=""
                variant={'destructive'}
                size={'icon'}
                onClick={()=>{setOpen(true)}}
                >
                    <TrashIcon className="h-4 w-4"/>
                </Button>
            </div>
            <Separator/>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <div className="grid grid-cols-3 gap-8">
                            <FormField
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Store Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={form.formState.isSubmitting} placeholder="Store name.." {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                        </div>
                        <Button 
                        className="ml-auto"
                        type="submit"
                        disabled={form.formState.isSubmitting}>
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </div>
        </>
        
    );
}
 
export default SettingsForm;