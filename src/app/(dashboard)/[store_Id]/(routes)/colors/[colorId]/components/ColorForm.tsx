'use client'

import Heading from "@/components/app_components/Heading";
import AlertModal from "@/components/app_components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';

interface ColorFormProps {
    initialData: Color | null
}


const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {message: 'String must be a valid hex code'}),
});

type ColorFormSchemaType = z.infer<typeof formSchema>
 
const ColorForm: FunctionComponent<ColorFormProps> = ({initialData}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const title = initialData?'Edit Color':'Create Color';
    const desc = initialData?'Edit a color':'Create a new color';
    const toastMessage = initialData?'Color successfully updated': 'Color  successfully created';
    const action = initialData?'Save Changes': 'Create';

    const form = useForm<ColorFormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    })



    const onSubmit = async(data: ColorFormSchemaType) =>{
        try {
            if(initialData){
                await axios.patch(`/api/${params.store_Id}/colors/${params.colorId}`, data);
            }else{
                await axios.post(`/api/${params.store_Id}/colors`, data);
            }

            toast({
                title: toastMessage,
                // description: 'Your store has been updated!',
            });

            router.refresh();

            router.push(`/${params.store_Id}/colors`);

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

            axios.delete(`/api/${params.store_Id}/colors/${params.colorId}`);

            router.refresh();

            router.push(`/api/${params.store_Id}/colors`);

            toast({
                title: toastMessage,
                // description: 'Your Store has been deleted successfully',
            });

        }catch(e){
            console.log(e)
            toast({
                title: 'Ooops Somthing went wrong!!',
                description: 'Make sure you have no active colors!',
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
                title={title}
                description={desc}
                />
                {initialData && 
                    <Button 
                        disabled={form.formState.isSubmitting}
                        className=""
                        variant={'destructive'}
                        size={'icon'}
                        onClick={()=>{setOpen(true)}}
                        >
                            <TrashIcon className="h-4 w-4"/>
                    </Button>
                }
                
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
                                        Color Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={form.formState.isSubmitting} placeholder="Color name.." {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            <FormField
                            name="value"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Color Value
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input disabled={loading} placeholder="Color value" {...field} />
                                            <div 
                                                className="border p-4 rounded-full" 
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
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
                            {action}
                        </Button>
                    </form>
                </Form>
            </div>
            <Separator/>
            {/* <ApiAlert
            title="NEXT_PUBLIC_API_URL"
            description={`${origin}/api/${params.store_Id}`}
            variant="public"
            /> */}
        </>
        
    );
}
 
export default ColorForm;