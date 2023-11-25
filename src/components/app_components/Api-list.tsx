import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { FunctionComponent } from "react";
import ApiAlert from "./Api-alert";

interface APIListProps {
    entityName: string
    entityIdName: string
}
 
const APIList: FunctionComponent<APIListProps> = ({entityIdName, entityName}) => {


    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.store_Id}`

    return ( 
        <>
            <ApiAlert 
            title="GET"
            variant="public"
            description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
            title="GET"
            variant="public"
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert 
            title="POST"
            variant="admin"
            description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
            title="PATCH"
            variant="admin"
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert 
            title="DELETE"
            variant="admin"
            description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
        </>
    );
}
 
export default APIList;