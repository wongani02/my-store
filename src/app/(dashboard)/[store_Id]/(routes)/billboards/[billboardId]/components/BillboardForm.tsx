'use client'

import ApiAlert from "@/components/app_components/Api-alert";
import Heading from "@/components/app_components/Heading";
import ImageUpload from "@/components/app_components/Image-Upload";
import AlertModal from "@/components/app_components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Store } from "@prisma/client";
import axios from "axios";
import { Flashlight, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';

interface BillboardFormProps {
    initialData: Billboard | null,
}


const formSchema = z.object({
    label: z.string().min(1),
    imageURL: z.string()
});

type BillboardFormSchemaType = z.infer<typeof formSchema>
 
const BillboardForm: FunctionComponent<BillboardFormProps> = ({initialData}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin()

    const title = initialData?'Edit Billboard':'Create Billboard';
    const desc = initialData?'Edit a billboard':'Create a new billboard';
    const toastMessage = initialData?'Billboard successfully updated': 'Billboard successfully created';
    const action = initialData?'Save Changes': 'Create';

    const form = useForm<BillboardFormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageURL: ''
        }
    })

    const onSubmit = async(data: BillboardFormSchemaType) =>{
        try {
            if(initialData){
                await axios.patch(`/api/${params.store_Id}/billboards/${params.billboardId}`, data);
            }else{
                await axios.post(`/api/${params.store_Id}/billboards`, data);
            }

            toast({
                title: 'Store Updated successfully',
                description: 'Your store has been updated!',
            });

            router.refresh();

            router.push(`/${params.store_Id}/billboards`);

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

            axios.delete(`/api/${params.store_Id}/billboards/${params.billboardId}`);

            router.refresh();

            router.push('/');

            toast({
                title: toastMessage,
                // description: 'Your Store has been deleted successfully',
            });

        }catch(e){
            console.log(e)
            toast({
                title: 'Ooops Somthing went wrong!!',
                description: 'Make sure you have no active categories!',
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
                        <FormField
                        name="imageURL"
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>
                                    Billbaord Image
                                </FormLabel>
                                <FormControl>
                                    <ImageUpload
                                    disabled={form.formState.isSubmitting}
                                    value={field.value ? [field.value] : []}
                                    onChange={(url)=>field.onChange(url)}
                                    onRemove={()=>field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div className="grid grid-cols-3 gap-8">
                            <FormField
                            name="label"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Billboard label
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
 
export default BillboardForm;