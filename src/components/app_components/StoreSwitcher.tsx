'use client'

import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useStore } from "zustand";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";



type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwtcherProps extends PopoverTriggerProps {
    items: Store[]
}
 
const StoreSwtcher: FunctionComponent<StoreSwtcherProps> = ({items=[], className}) => {

    const storeModal = useStoreModal();

    const params = useParams();

    const router = useRouter();

    const [open, setOpen] = useState<boolean>(false) 

    const formattedItems = items.map((item)=>({
        name: item.name,
        value: item.id,
    }))

    const currentStore = formattedItems.find((item)=>item.value === params.store_Id)

    const onStoreSelect = (store: {name: string, value:string}) =>{
        setOpen(false);
        router.push(`/${store.value}`)
    }

    return ( 
        <Popover 
        open={open}
        onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant={'outline'}
                role="combobox"
                size={'sm'}
                aria-expanded={open}
                aria-label="Select a store"
                className={cn('w-[200px] justify-between ', className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    <p className="overflow-hidden truncate">{currentStore?.name}</p>
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..."/>
                        <CommandEmpty>
                            No store found
                        </CommandEmpty>
                        <CommandGroup heading='stores'>
                            {formattedItems.map((store)=>(
                                <CommandItem 
                                onSelect={()=>onStoreSelect(store)}
                                key={store.value}>
                                    <StoreIcon className="mr-2 h-4 w-4"/> 
                                    {store.name}
                                    <Check
                                    className={cn('ml-auto h-4 w-4',currentStore?.value === store.value ? 'opacity-100' : 'opacity-0' )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem 
                            onSelect={()=>{
                                setOpen(false);
                                storeModal.onOpen();
                            }}
                            >
                                <PlusCircle className="mr-2 w-5 h-5"/>
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
 
export default StoreSwtcher;