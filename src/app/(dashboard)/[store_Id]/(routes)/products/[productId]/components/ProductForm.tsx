'use client'

import ApiAlert from "@/components/app_components/Api-alert";
import Heading from "@/components/app_components/Heading";
import ImageUpload from "@/components/app_components/Image-Upload";
import AlertModal from "@/components/app_components/modals/AlertModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useOrigin } from "@/hooks/use-origin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Product, Size, Image } from "@prisma/client";
import axios from "axios";
import { Flashlight, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null,
    categories: Category[]
    sizes: Size[]
    colors: Color[]
}


const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});

type ProductFormSchemaType = z.infer<typeof formSchema>
 
const ProductForm: FunctionComponent<ProductFormProps> = ({initialData, categories, colors, sizes}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin()

    const title = initialData?'Edit Product':'Create Product';
    const desc = initialData?'Edit a product':'Create a new product';
    const toastMessage = initialData?'Product successfully updated': 'Product successfully created';
    const action = initialData?'Save Changes': 'Create';

    const defaultValues = initialData ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
    } : {
        name: '',
        images: [],
        price: 0,
        categoryId: '',
        colorId: '',
        sizeId: '',
        isFeatured: false,
        isArchived: false,
    }

    const form = useForm<ProductFormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const onSubmit = async(data: ProductFormSchemaType) =>{
        try {
            console.log(data)
            if(initialData){
                await axios.patch(`/api/${params.store_Id}/products/${params.productId}`, data);
            }else{
                await axios.post(`/api/${params.store_Id}/products`, data);
            }

            toast({
                title: 'Store Updated successfully',
                description: 'Your store has been updated!',
            });

            router.refresh();

            router.push(`/${params.store_Id}/products`);

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

            axios.delete(`/api/${params.store_Id}/products/${params.productId}`);

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
                description: 'Make sure you have are connected to the internet!',
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
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                <ImageUpload 
                                    value={field.value.map((image) => image.url)} 
                                    disabled={form.formState.isSubmitting} 
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <div className="md:grid md:grid-cols-3 gap-8">
                            <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={form.formState.isSubmitting} placeholder="Product name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={form.formState.isSubmitting} placeholder="9.99" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={form.formState.isSubmitting} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select disabled={form.formState.isSubmitting} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {sizes.map((size) => (
                                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select 
                                disabled={form.formState.isSubmitting} 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {colors.map((color) => (
                                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    // @ts-ignore
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    Featured
                                    </FormLabel>
                                    <FormDescription>
                                    This product will appear on the home page
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    // @ts-ignore
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    Archived
                                    </FormLabel>
                                    <FormDescription>
                                    This product will not appear anywhere in the store.
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                            />
                        </div>
                        <Button disabled={loading} className="ml-auto" type="submit">
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
 
export default ProductForm;