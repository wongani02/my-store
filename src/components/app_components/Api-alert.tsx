'use client'

import { FunctionComponent } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface ApiAlertProps {
    title: string
    description: string
    variant: "public" | "admin"
}

const textMap : Record<ApiAlertProps['variant'], string > = {
    public: 'public',
    admin: 'admin',
}

const variantMap : Record<ApiAlertProps['variant'], BadgeProps['variant'] > = {
    public: 'secondary',
    admin: 'destructive',
}
 
const ApiAlert: FunctionComponent<ApiAlertProps> = ({title, description, variant='public'}) => {


    const onCopy = (description: string) =>{
        navigator.clipboard.writeText(description);

        toast({
            title: 'Copied to clipboard'
        })
    }

    return ( 
        <Alert>
            <Server className="h-4 w-4"/>
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]} className="">
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant={'outline'} size={'icon'} onClick={()=>{onCopy(description)}}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    );
}
 
export default ApiAlert;