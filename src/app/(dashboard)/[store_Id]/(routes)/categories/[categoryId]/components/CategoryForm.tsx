'use client'

import Heading from "@/components/app_components/Heading";
import AlertModal from "@/components/app_components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category, Store } from "@prisma/client";
import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';

interface CategoryFormProps {
    initialData: Category | null
    billboards: Billboard[]
}


const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string()
});

type CategoryFormSchemaType = z.infer<typeof formSchema>
 
const CategoryForm: FunctionComponent<CategoryFormProps> = ({initialData, billboards}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin()

    const title = initialData?'Edit Category':'Create Category';
    const desc = initialData?'Edit a Category':'Create a new Category';
    const toastMessage = initialData?'Category successfully updated': 'Category successfully created';
    const action = initialData?'Save Changes': 'Create';

    const form = useForm<CategoryFormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })



    const onSubmit = async(data: CategoryFormSchemaType) =>{
        try {
            if(initialData){
                await axios.patch(`/api/${params.store_Id}/categories/${params.categoryId}`, data);
            }else{
                await axios.post(`/api/${params.store_Id}/categories`, data);
            }

            toast({
                title: toastMessage,
                // description: 'Your store has been updated!',
            });

            router.refresh();

            router.push(`/${params.store_Id}/categories`);

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

            axios.delete(`/api/${params.store_Id}/categories/${params.categoryId}`);

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
                        
                        <div className="grid grid-cols-3 gap-8">
                            <FormField
                            name="name"
                            control={form.control}
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>
                                        Category Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={form.formState.isSubmitting} placeholder="Category name.." {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                             <FormField
                                control={form.control}
                                name="billboardId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select a billboard</FormLabel>
                                        <Select 
                                        value={field.value}
                                        disabled={form.formState.isSubmitting}
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a billboard associated with the category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {billboards.map((item)=>(
                                                    <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/* <FormDescription>
                                            You can manage email addresses in your{" "}
                                            <Link href="/examples/forms">email settings</Link>.
                                        </FormDescription> */}
                                        <FormMessage />
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
 
export default CategoryForm;