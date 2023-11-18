'use client'

import { FunctionComponent } from "react";
import Modal from "../Modal";
import * as z from 'zod';
import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";


const formSchema = z.object({
    name: z.string().min(1),
})


interface StoreModalProps {
    
}
 
const StoreModal: FunctionComponent<StoreModalProps> = () => {

    const storeModal = useStoreModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) =>{
        // TODO: Create store
        console.log(data)

        try {

            const response = await axios.post('/api/stores', data)

            window.location.assign(`/${response.data.id}`)

            toast({
                title: 'Store created Successfully :)',
                description: `Your store ${data.name} has been created successfully!!!`
            })

        }catch (error) {

            console.log(error)

            toast({
                title: 'Ooops Something went wrong :(',
                description: `Failed to create store, please try again or cantact sales`,
                variant: 'destructive'
            })


        }finally{

        }
    }

    return ( 
        <Modal
        title="Create Your Store "
        description="Create a store that suits your business and pay as you go"
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Store Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={form.formState.isSubmitting} placeholder="Shoe store" {...field}/>
                                    </FormControl>
                                    <FormDescription/>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end">
                                <Button 
                                disabled={form.formState.isSubmitting}
                                onClick={storeModal.onClose}
                                variant={'outline'}>
                                    Cancel
                                </Button>
                                <Button
                                disabled={form.formState.isSubmitting}
                                type="submit">
                                    Create Store 
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
}
 
export default StoreModal;